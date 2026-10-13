import Transaction from '../models/Transaction.js';
import ErrorLog from '../models/ErrorLog.js';
import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import Receipt from '../models/Receipt.js';

// ── Helper: build pagination metadata ────────────────────────────────────────
const paginate = (page, limit, total) => ({
  currentPage: page,
  totalPages: Math.ceil(total / limit),
  totalRecords: total,
  limit,
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/stats
// KPI summary: total txns, volume, success rate, failed, pending, errors
// ─────────────────────────────────────────────────────────────────────────────
export const getStats = async (req, res) => {
  try {
    const [
      totalTxns,
      successTxns,
      failedTxns,
      pendingTxns,
      unresolvedErrors,
      totalUsers,
    ] = await Promise.all([
      Transaction.countDocuments(),
      Transaction.countDocuments({ status: 'success' }),
      Transaction.countDocuments({ status: { $in: ['failure', 'cancelled'] } }),
      Transaction.countDocuments({ status: 'pending' }),
      ErrorLog.countDocuments({ resolved: false }),
      User.countDocuments({ role: 'customer' }),
    ]);

    // Total settled volume
    const volumeAgg = await Transaction.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalVolume = volumeAgg[0]?.total || 0;

    const successRate = totalTxns > 0
      ? parseFloat(((successTxns / totalTxns) * 100).toFixed(2))
      : 0;

    res.json({
      success: true,
      data: {
        totalTxns,
        totalVolume,
        successTxns,
        failedTxns,
        pendingTxns,
        unresolvedErrors,
        totalUsers,
        successRate,
        failureRate: parseFloat((100 - successRate).toFixed(2)),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/transactions
// All transactions with filters: status, type, method, dateFrom, dateTo, page, limit
// ─────────────────────────────────────────────────────────────────────────────
export const getAllTransactions = async (req, res) => {
  try {
    const {
      status, type, method,
      dateFrom, dateTo,
      page = 1, limit = 20,
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (type)   filter.type   = type;
    if (method) filter.method = method;
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo)   filter.createdAt.$lte = new Date(dateTo);
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await Transaction.countDocuments(filter);

    const transactions = await Transaction.find(filter)
      .populate('senderWalletId', 'mainBalance currency userId')
      .populate({
        path: 'senderWalletId',
        populate: { path: 'userId', select: 'firstName lastName email' },
      })
      .populate('recipientId', 'name accountNumber bankName')
      .populate('resolvedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    res.json({
      success: true,
      data: transactions,
      pagination: paginate(parseInt(page, 10), parseInt(limit, 10), total),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/transactions/:id
// Full transaction audit view with all populated references
// ─────────────────────────────────────────────────────────────────────────────
export const getTransactionById = async (req, res) => {
  try {
    const txn = await Transaction.findById(req.params.id)
      .populate({
        path: 'senderWalletId',
        select: 'mainBalance currency isFrozen',
        populate: { path: 'userId', select: 'firstName lastName email phone' },
      })
      .populate('recipientId', 'name accountNumber bankName ifscCode accountType')
      .populate('originalTransactionId', 'referenceCode amount status type')
      .populate('resolvedBy', 'firstName lastName email');

    if (!txn) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // Fetch related error log if any
    const errorLog = await ErrorLog.findOne({ transactionId: txn._id });

    res.json({ success: true, data: { ...txn.toObject(), errorLog: errorLog || null } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/admin/transactions/:id/force-success
// Force a pending transaction to success (admin override)
// ─────────────────────────────────────────────────────────────────────────────
export const forceSuccess = async (req, res) => {
  try {
    const txn = await Transaction.findById(req.params.id);
    if (!txn) return res.status(404).json({ success: false, message: 'Transaction not found' });
    if (txn.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Cannot force-success a ${txn.status} transaction` });
    }

    txn.status = 'success';
    txn.resolvedBy = req.user._id;
    await txn.save(); // triggers post('save') to deduct wallet balance

    res.json({ success: true, message: 'Transaction marked as success', data: txn });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/admin/transactions/:id/force-fail
// Force a pending transaction to failure (admin override)
// ─────────────────────────────────────────────────────────────────────────────
export const forceFail = async (req, res) => {
  try {
    const txn = await Transaction.findById(req.params.id);
    if (!txn) return res.status(404).json({ success: false, message: 'Transaction not found' });
    if (txn.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Cannot force-fail a ${txn.status} transaction` });
    }

    txn.status = 'failure';
    txn.failureReason = req.body.failureReason || 'BANK_TIMEOUT';
    txn.resolvedBy = req.user._id;
    await txn.save(); // triggers post('save') to create ErrorLog

    res.json({ success: true, message: 'Transaction marked as failure', data: txn });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/errors
// All error logs with filters: severity, resolved, errorCode, page
// ─────────────────────────────────────────────────────────────────────────────
export const getErrors = async (req, res) => {
  try {
    const { severity, resolved, errorCode, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (severity)  filter.severity  = severity;
    if (errorCode) filter.errorCode = errorCode;
    if (resolved !== undefined) filter.resolved = resolved === 'true';

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await ErrorLog.countDocuments(filter);

    const errors = await ErrorLog.find(filter)
      .populate('transactionId', 'referenceCode amount status method')
      .populate('resolvedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    res.json({
      success: true,
      data: errors,
      pagination: paginate(parseInt(page, 10), parseInt(limit, 10), total),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/admin/errors/:id/resolve
// Resolve a single error log
// ─────────────────────────────────────────────────────────────────────────────
export const resolveError = async (req, res) => {
  try {
    const { resolutionNotes } = req.body;
    const errorLog = await ErrorLog.findById(req.params.id);
    if (!errorLog) return res.status(404).json({ success: false, message: 'Error log not found' });

    if (errorLog.resolved) {
      errorLog.resolved = false;
      errorLog.resolvedBy = null;
      errorLog.resolvedAt = null;
      errorLog.resolutionNotes = resolutionNotes || `Reopened by ${req.user.firstName} at ${new Date().toLocaleString()}`;
    } else {
      errorLog.resolved = true;
      errorLog.resolvedBy = req.user._id;
      errorLog.resolvedAt = new Date();
      errorLog.resolutionNotes = resolutionNotes || `Resolved by ${req.user.firstName} at ${new Date().toLocaleString()}`;
    }
    await errorLog.save();

    res.json({
      success: true,
      message: errorLog.resolved ? 'Error log marked as resolved' : 'Error log reopened',
      data: errorLog,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/admin/errors/resolve-all
// Resolve all unresolved errors
// ─────────────────────────────────────────────────────────────────────────────
export const resolveAllErrors = async (req, res) => {
  try {
    const { resolutionNotes } = req.body;
    const result = await ErrorLog.updateMany(
      { resolved: false },
      {
        $set: {
          resolved: true,
          resolvedBy: req.user._id,
          resolvedAt: new Date(),
          resolutionNotes: resolutionNotes || `Bulk resolved by admin at ${new Date().toLocaleString()}`,
        },
      }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} error(s) resolved`,
      data: { resolvedCount: result.modifiedCount },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/users
// All customer accounts with their wallet info
// ─────────────────────────────────────────────────────────────────────────────
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter = { role: 'customer' };
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName:  { $regex: search, $options: 'i' } },
        { email:     { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await User.countDocuments(filter);

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    // Attach wallet info to each user
    const userIds = users.map((u) => u._id);
    const wallets = await Wallet.find({ userId: { $in: userIds } });
    const walletMap = {};
    wallets.forEach((w) => { walletMap[w.userId.toString()] = w; });

    const enriched = users.map((u) => ({
      ...u.toObject(),
      wallet: walletMap[u._id.toString()] || null,
    }));

    res.json({
      success: true,
      data: enriched,
      pagination: paginate(parseInt(page, 10), parseInt(limit, 10), total),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/admin/users/:id/freeze
// Toggle freeze on a user's wallet
// ─────────────────────────────────────────────────────────────────────────────
export const freezeUserWallet = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const wallet = await Wallet.findOne({ userId: user._id });
    if (!wallet) return res.status(404).json({ success: false, message: 'Wallet not found' });

    wallet.isFrozen = !wallet.isFrozen;
    await wallet.save({ validateModifiedOnly: true }); // skip balance-change hook

    res.json({
      success: true,
      message: `Wallet ${wallet.isFrozen ? 'frozen' : 'unfrozen'} successfully`,
      data: wallet,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/admin/users/:id/activate
// Toggle isActive on a user account
// ─────────────────────────────────────────────────────────────────────────────
export const toggleUserActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot deactivate an admin account' });
    }

    user.isActive = !user.isActive;
    await user.save({ validateModifiedOnly: true });

    res.json({
      success: true,
      message: `Account ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export default {
  getStats,
  getAllTransactions,
  getTransactionById,
  forceSuccess,
  forceFail,
  getErrors,
  resolveError,
  resolveAllErrors,
  getAllUsers,
  freezeUserWallet,
  toggleUserActive,
};
