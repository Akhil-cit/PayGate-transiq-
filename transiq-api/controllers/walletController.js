import Wallet from '../models/Wallet.js';

export const getMine = async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      wallet = await Wallet.create({ userId: req.user._id, mainBalance: 50000, currency: 'INR' });
    }
    res.json({ success: true, data: wallet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Unable to load wallet' });
  }
};

export const changeCurrency = async (req, res) => {
  try {
    const { currency } = req.body;
    if (!['INR', 'USD', 'EUR', 'BTC'].includes(currency)) {
      return res.status(400).json({ success: false, message: 'Unsupported currency' });
    }
    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) return res.status(404).json({ success: false, message: 'Wallet not found' });
    if (wallet.mainBalance > 0 && wallet.currency !== currency) {
      return res.status(400).json({ success: false, message: 'Currency cannot be changed while wallet has a balance' });
    }
    wallet.currency = currency;
    await wallet.save();
    res.json({ success: true, message: 'Currency updated', data: wallet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Currency update failed' });
  }
};
