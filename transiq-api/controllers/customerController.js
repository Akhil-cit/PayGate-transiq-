import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import Pocket from '../models/Pocket.js';

export const publicUser = (user) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone,
  role: user.role,
  isActive: user.isActive,
  twoFactorEnabled: user.twoFactorEnabled,
  biometricsEnabled: user.biometricsEnabled,
});

export const getMe = async (req, res) => {
  try {
    const [wallet, pockets] = await Promise.all([
      Wallet.findOne({ userId: req.user._id }).lean(),
      Pocket.find({ userId: req.user._id }).sort({ createdAt: -1 }).lean(),
    ]);
    res.json({
      success: true,
      data: {
        user: publicUser(req.user),
        wallet,
        pockets: pockets || [],
        recentTxns: [],
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Unable to load dashboard' });
  }
};

export const updateMe = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    if (phone && phone.trim() !== req.user.phone) {
      const exists = await User.findOne({ phone: phone.trim(), _id: { $ne: req.user._id } });
      if (exists) return res.status(409).json({ success: false, message: 'Phone number already registered' });
      req.user.phone = phone.trim();
    }
    if (firstName?.trim()) req.user.firstName = firstName.trim();
    if (lastName?.trim()) req.user.lastName = lastName.trim();
    await req.user.save();
    res.json({ success: true, message: 'Profile updated', data: publicUser(req.user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Profile update failed' });
  }
};

export const dashboard = getMe;
