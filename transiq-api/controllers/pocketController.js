import Pocket from '../models/Pocket.js';
import Wallet from '../models/Wallet.js';

const validAmount = (amount) => Number.isFinite(Number(amount)) && Number(amount) > 0;

export const list = async (req, res) => {
  try {
    const pockets = await Pocket.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: pockets });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Unable to load pockets' });
  }
};

export const create = async (req, res) => {
  try {
    const { name, targetAmount = 0 } = req.body;
    if (!name?.trim()) return res.status(400).json({ success: false, message: 'Pocket name is required' });
    if (Number(targetAmount) < 0) return res.status(400).json({ success: false, message: 'Target amount cannot be negative' });

    let wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      wallet = await Wallet.create({ userId: req.user._id, mainBalance: 50000, currency: 'INR' });
    }

    const pocket = await Pocket.create({
      walletId: wallet._id,
      userId: req.user._id,
      name: name.trim(),
      targetAmount: Number(targetAmount),
      currentAmount: 0,
      isLocked: false,
    });
    res.status(201).json({ success: true, message: 'Pocket created', data: pocket });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Pocket creation failed' });
  }
};

export const update = async (req, res) => {
  try {
    const pocket = await Pocket.findOne({ _id: req.params.id, userId: req.user._id });
    if (!pocket) return res.status(404).json({ success: false, message: 'Pocket not found' });
    if (pocket.isLocked && (req.body.name !== undefined || req.body.targetAmount !== undefined)) {
      return res.status(400).json({ success: false, message: 'Unlock the pocket before editing it' });
    }
    if (req.body.name !== undefined) {
      if (!req.body.name.trim()) return res.status(400).json({ success: false, message: 'Pocket name is required' });
      pocket.name = req.body.name.trim();
    }
    if (req.body.targetAmount !== undefined) {
      if (Number(req.body.targetAmount) < 0) return res.status(400).json({ success: false, message: 'Target amount cannot be negative' });
      pocket.targetAmount = Number(req.body.targetAmount);
    }
    await pocket.save();
    res.json({ success: true, message: 'Pocket updated', data: pocket });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Pocket update failed' });
  }
};

export const deposit = async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    if (!validAmount(amount)) return res.status(400).json({ success: false, message: 'Amount must be greater than 0' });

    const wallet = await Wallet.findOneAndUpdate(
      { userId: req.user._id, isFrozen: false, mainBalance: { $gte: amount } },
      { $inc: { mainBalance: -amount } },
      { new: true }
    );
    if (!wallet) return res.status(400).json({ success: false, message: 'Insufficient wallet balance or wallet is frozen' });

    const pocket = await Pocket.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id, isLocked: false },
      { $inc: { currentAmount: amount } },
      { new: true }
    );
    if (!pocket) {
      await Wallet.updateOne({ _id: wallet._id }, { $inc: { mainBalance: amount } });
      return res.status(400).json({ success: false, message: 'Pocket not found or locked' });
    }
    res.json({ success: true, message: 'Funds moved to pocket', data: { wallet, pocket } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Deposit failed' });
  }
};

export const withdraw = async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    if (!validAmount(amount)) return res.status(400).json({ success: false, message: 'Amount must be greater than 0' });

    const pocket = await Pocket.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id, isLocked: false, currentAmount: { $gte: amount } },
      { $inc: { currentAmount: -amount } },
      { new: true }
    );
    if (!pocket) return res.status(400).json({ success: false, message: 'Insufficient pocket balance, pocket is locked, or pocket was not found' });

    const wallet = await Wallet.findOneAndUpdate(
      { userId: req.user._id, isFrozen: false },
      { $inc: { mainBalance: amount } },
      { new: true }
    );
    if (!wallet) {
      await Pocket.updateOne({ _id: pocket._id }, { $inc: { currentAmount: amount } });
      return res.status(400).json({ success: false, message: 'Wallet is frozen or unavailable' });
    }
    res.json({ success: true, message: 'Funds returned to wallet', data: { wallet, pocket } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Withdrawal failed' });
  }
};

export const toggleLock = async (req, res) => {
  try {
    const pocket = await Pocket.findOne({ _id: req.params.id, userId: req.user._id });
    if (!pocket) return res.status(404).json({ success: false, message: 'Pocket not found' });
    pocket.isLocked = !pocket.isLocked;
    await pocket.save();
    res.json({ success: true, message: pocket.isLocked ? 'Pocket locked' : 'Pocket unlocked', data: pocket });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Lock update failed' });
  }
};

export const remove = async (req, res) => {
  try {
    const pocket = await Pocket.findOne({ _id: req.params.id, userId: req.user._id });
    if (!pocket) return res.status(404).json({ success: false, message: 'Pocket not found' });
    let wallet = await Wallet.findOne({ userId: req.user._id, isFrozen: false });
    if (!wallet) return res.status(400).json({ success: false, message: 'Wallet not found or frozen' });
    if (pocket.currentAmount > 0) {
      wallet = await Wallet.findOneAndUpdate(
        { _id: wallet._id, isFrozen: false },
        { $inc: { mainBalance: pocket.currentAmount } },
        { new: true }
      );
    }
    await Pocket.deleteOne({ _id: pocket._id });
    res.json({ success: true, message: 'Pocket deleted and funds returned to wallet', data: { wallet } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Pocket deletion failed' });
  }
};
