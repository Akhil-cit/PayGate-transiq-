import Transaction from '../models/Transaction.js';
import Wallet from '../models/Wallet.js';
import Receipt from '../models/Receipt.js';

export const getAll = async (req, res, next) => {
  try {
    let wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet && req.user.role === 'customer') {
      wallet = await Wallet.create({ userId: req.user._id, mainBalance: 50000, currency: 'INR' });
    }

    const { status, type, method, dateFrom, dateTo, page = 1, limit = 10 } = req.query;
    const filter = wallet ? { senderWalletId: wallet._id } : {};

    if (!wallet && req.user.role !== 'admin') {
      return res.json({
        success: true,
        total: 0,
        page: parseInt(page),
        pages: 0,
        data: [],
      });
    }

    if (status) filter.status = status;
    if (type) filter.type = type;
    if (method) filter.method = method;
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Transaction.countDocuments(filter);
    const txns = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('recipientId', 'name bankName accountNumber ifscCode accountType')
      .lean();

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)) || 0,
      data: txns,
    });
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user._id });
    const txn = await Transaction.findOne({ _id: req.params.id, senderWalletId: wallet?._id })
      .populate('recipientId', 'name bankName accountNumber ifscCode accountType referenceCode')
      .populate('senderWalletId', 'mainBalance currency')
      .populate('resolvedBy', 'firstName lastName email')
      .lean();
    if (!txn) return res.status(404).json({ success: false, message: 'Transaction not found' });
    res.json({ success: true, data: txn });
  } catch (err) {
    next(err);
  }
};

export const initiate = async (req, res, next) => {
  try {
    const { recipientId, amount, method, description, type } = req.body;

    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) return res.status(404).json({ success: false, message: 'Wallet not found' });
    if (wallet.isFrozen) return res.status(403).json({ success: false, message: 'Wallet is frozen' });
    if (wallet.mainBalance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient funds' });
    }

    const recipient = await Receipt.findOne({ _id: recipientId, userId: req.user._id });
    if (!recipient) return res.status(404).json({ success: false, message: 'Recipient not found' });

    const txn = await Transaction.create({
      senderWalletId: wallet._id,
      recipientId,
      amount,
      method,
      description: description || '',
      type: type || 'transfer',
      status: 'pending',
    });

    res.status(201).json({ success: true, message: 'Transaction initiated', data: txn });
  } catch (err) {
    next(err);
  }
};

export const cancel = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user._id });
    const txn = await Transaction.findOne({ _id: req.params.id, senderWalletId: wallet?._id });
    if (!txn) return res.status(404).json({ success: false, message: 'Transaction not found' });
    if (txn.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Only pending transactions can be cancelled' });
    }
    txn.status = 'cancelled';
    txn.failureReason = 'Cancelled by user';
    await txn.save();
    res.json({ success: true, message: 'Transaction cancelled', data: txn });
  } catch (err) {
    next(err);
  }
};

export const retry = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user._id });
    const original = await Transaction.findOne({ _id: req.params.id, senderWalletId: wallet?._id });
    if (!original) return res.status(404).json({ success: false, message: 'Transaction not found' });
    if (original.status !== 'failure') {
      return res.status(400).json({ success: false, message: 'Only failed transactions can be retried' });
    }

    const freshWallet = await Wallet.findById(wallet._id);
    if (freshWallet.isFrozen) return res.status(403).json({ success: false, message: 'Wallet is frozen' });
    if (freshWallet.mainBalance < original.amount) {
      return res.status(400).json({ success: false, message: 'Insufficient funds for retry' });
    }

    const retried = await Transaction.create({
      senderWalletId: wallet._id,
      recipientId: original.recipientId,
      amount: original.amount,
      method: original.method,
      description: `Retry of ${original.referenceCode}`,
      type: original.type,
      originalTransactionId: original._id,
      status: 'pending',
    });

    res.status(201).json({ success: true, message: 'Transaction retried', data: retried });
  } catch (err) {
    next(err);
  }
};

export const validateTransaction = async (req, res, next) => {
  try {
    const { amount, recipientId } = req.body;
    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) return res.status(404).json({ success: false, message: 'Wallet not found' });

    const checks = {
      walletFrozen: wallet.isFrozen,
      sufficientFunds: wallet.mainBalance >= amount,
      validRecipient: false,
      availableBalance: wallet.mainBalance,
    };

    if (recipientId) {
      const r = await Receipt.findOne({ _id: recipientId, userId: req.user._id });
      checks.validRecipient = !!r;
    }

    const canProceed = !checks.walletFrozen && checks.sufficientFunds && checks.validRecipient;
    res.json({ success: true, canProceed, checks });
  } catch (err) {
    next(err);
  }
};
