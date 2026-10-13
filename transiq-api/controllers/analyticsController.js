import Transaction from '../models/Transaction.js';
import Wallet from '../models/Wallet.js';
import Receipt from '../models/Receipt.js';

const getWalletId = async (user) => {
  let w = await Wallet.findOne({ userId: user._id });
  if (!w && user.role === 'customer') {
    w = await Wallet.create({ userId: user._id, mainBalance: 50000, currency: 'INR' });
  }
  return w?._id;
};

export const summary = async (req, res, next) => {
  try {
    const walletId = await getWalletId(req.user);
    if (!walletId) {
      return res.json({
        success: true,
        data: {
          totalSent: 0,
          successCount: 0,
          failedCount: 0,
          pendingCount: 0,
          totalCount: 0,
          avgAmount: 0,
          highestAmount: 0,
          lowestAmount: 0,
          currentBalance: 0,
          currency: 'INR',
          netFlow: 0,
        },
      });
    }

    const [agg] = await Transaction.aggregate([
      { $match: { senderWalletId: walletId } },
      {
        $group: {
          _id: null,
          totalSent: { $sum: { $cond: [{ $eq: ['$status', 'success'] }, '$amount', 0] } },
          successCount: { $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] } },
          failedCount: { $sum: { $cond: [{ $eq: ['$status', 'failure'] }, 1, 0] } },
          pendingCount: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          totalCount: { $sum: 1 },
          avgAmount: { $avg: '$amount' },
          highestAmount: { $max: '$amount' },
          lowestAmount: { $min: '$amount' },
        },
      },
    ]);

    const wallet = await Wallet.findById(walletId);

    res.json({
      success: true,
      data: {
        totalSent: agg?.totalSent || 0,
        successCount: agg?.successCount || 0,
        failedCount: agg?.failedCount || 0,
        pendingCount: agg?.pendingCount || 0,
        totalCount: agg?.totalCount || 0,
        avgAmount: Math.round((agg?.avgAmount || 0) * 100) / 100,
        highestAmount: agg?.highestAmount || 0,
        lowestAmount: agg?.lowestAmount || 0,
        currentBalance: wallet?.mainBalance || 0,
        currency: wallet?.currency || 'INR',
        netFlow: -(agg?.totalSent || 0),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const byMethod = async (req, res, next) => {
  try {
    const walletId = await getWalletId(req.user);
    const breakdown = await Transaction.aggregate([
      { $match: { senderWalletId: walletId } },
      {
        $group: {
          _id: '$method',
          count: { $sum: 1 },
          total: { $sum: '$amount' },
          success: { $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] } },
          failed: { $sum: { $cond: [{ $eq: ['$status', 'failure'] }, 1, 0] } },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.json({ success: true, data: breakdown });
  } catch (err) {
    next(err);
  }
};

export const byMonth = async (req, res, next) => {
  try {
    const walletId = await getWalletId(req.user);
    const monthly = await Transaction.aggregate([
      { $match: { senderWalletId: walletId } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          totalAmount: { $sum: '$amount' },
          successAmount: { $sum: { $cond: [{ $eq: ['$status', 'success'] }, '$amount', 0] } },
          count: { $sum: 1 },
          successCount: { $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] } },
          failedCount: { $sum: { $cond: [{ $eq: ['$status', 'failure'] }, 1, 0] } },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          label: {
            $concat: [
              { $arrayElemAt: [['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], '$_id.month'] },
              ' ',
              { $toString: '$_id.year' },
            ],
          },
          totalAmount: 1,
          successAmount: 1,
          count: 1,
          successCount: 1,
          failedCount: 1,
        },
      },
    ]);

    res.json({ success: true, data: monthly });
  } catch (err) {
    next(err);
  }
};

export const insights = async (req, res, next) => {
  try {
    const walletId = await getWalletId(req.user);

    const [topRecipientAgg] = await Transaction.aggregate([
      { $match: { senderWalletId: walletId, status: 'success' } },
      { $group: { _id: '$recipientId', totalSent: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { totalSent: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: 'receipts',
          localField: '_id',
          foreignField: '_id',
          as: 'recipient',
        },
      },
      { $unwind: { path: '$recipient', preserveNullAndEmptyArrays: true } },
    ]);

    const peakDayAgg = await Transaction.aggregate([
      { $match: { senderWalletId: walletId, status: 'success' } },
      { $group: { _id: { $dayOfWeek: '$createdAt' }, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $limit: 1 },
    ]);
    const days = ['', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const [highestTxn] = await Transaction.find({ senderWalletId: walletId, status: 'success' })
      .sort({ amount: -1 })
      .limit(1)
      .populate('recipientId', 'name')
      .lean();

    const [avgAgg] = await Transaction.aggregate([
      { $match: { senderWalletId: walletId } },
      { $group: { _id: null, avg: { $avg: '$amount' } } },
    ]);
    const avg = avgAgg?.avg || 0;
    const unusualCount = await Transaction.countDocuments({
      senderWalletId: walletId,
      amount: { $gt: avg * 2 },
    });

    res.json({
      success: true,
      data: {
        topRecipient: topRecipientAgg
          ? {
              name: topRecipientAgg.recipient?.name || 'Unknown',
              totalSent: topRecipientAgg.totalSent,
              count: topRecipientAgg.count,
            }
          : null,
        peakSpendDay: peakDayAgg[0]
          ? { day: days[peakDayAgg[0]._id], total: peakDayAgg[0].total, count: peakDayAgg[0].count }
          : null,
        highestTxn: highestTxn
          ? {
              referenceCode: highestTxn.referenceCode,
              amount: highestTxn.amount,
              recipient: highestTxn.recipientId?.name || 'Unknown',
              date: highestTxn.createdAt,
            }
          : null,
        unusualActivity: { count: unusualCount, avgThreshold: Math.round(avg * 2 * 100) / 100 },
      },
    });
  } catch (err) {
    next(err);
  }
};

export const exportCsv = async (req, res, next) => {
  try {
    const walletId = await getWalletId(req.user);
    const txns = await Transaction.find({ senderWalletId: walletId })
      .sort({ createdAt: -1 })
      .populate('recipientId', 'name bankName accountNumber')
      .lean();

    const rows = txns.map((t) => ({
      referenceCode: t.referenceCode,
      amount: t.amount,
      status: t.status,
      type: t.type,
      method: t.method,
      recipient: t.recipientId?.name || '',
      bank: t.recipientId?.bankName || '',
      account: t.recipientId?.accountNumber || '',
      description: t.description || '',
      failureReason: t.failureReason || '',
      createdAt: t.createdAt ? new Date(t.createdAt).toISOString() : '',
    }));

    const headers = Object.keys(rows[0] || {});
    const csvLines = [
      headers.join(','),
      ...rows.map((r) =>
        headers.map((h) => `"${String(r[h]).replace(/"/g, '""')}"`).join(',')
      ),
    ];

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="transactions_${Date.now()}.csv"`);
    res.send(csvLines.join('\n'));
  } catch (err) {
    next(err);
  }
};
