import Transaction from '../models/Transaction.js';
import Wallet from '../models/Wallet.js';
import User from '../models/User.js';

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id || req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Incorrect old password' });
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const toggleFreeze = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.id || req.user._id });
    if (!wallet) return res.status(404).json({ success: false, message: 'Wallet not found' });
    wallet.isFrozen = !wallet.isFrozen;
    await wallet.save();
    res.json({
      success: true,
      isFrozen: wallet.isFrozen,
      message: wallet.isFrozen ? 'Wallet frozen' : 'Wallet unfrozen',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deactivateAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id || req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = false;
    await user.save();
    res.json({ success: true, message: 'Account deactivated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getActivityLog = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const wallet = await Wallet.findOne({ userId });

    if (!user.activeSessions || user.activeSessions.length === 0) {
      user.activeSessions = [
        {
          device: 'Chrome on Windows 11',
          location: 'coimbatore, India',
          ipAddress: '103.21.124.89',
          lastActive: 'Just now',
          isCurrent: true,
        },
        {
          device: 'PayGate App on iPhone 15 Pro',
          location: 'Bengaluru, India',
          ipAddress: '49.207.210.14',
          lastActive: '2 days ago',
          isCurrent: false,
        },
        {
          device: 'Safari on macOS Sonoma',
          location: 'Chennai, India',
          ipAddress: '157.48.91.2',
          lastActive: '3 days ago',
          isCurrent: false,
        },
      ];
    }

    if (!user.securityLogs || user.securityLogs.length === 0) {
      user.securityLogs = [
        {
          event: 'Password Changed',
          status: 'SUCCESS',
          ip: '103.21.124.89',
          device: 'Chrome on Windows',
          timestamp: '2026-09-15 14:30:12',
        },
        {
          event: '2FA OTP Verification',
          status: 'SUCCESS',
          ip: '103.21.124.89',
          device: 'Chrome on Windows',
          timestamp: '2026-09-15 14:28:05',
        },
        {
          event: 'Wallet Freeze Toggled',
          status: 'INFO',
          ip: '49.207.210.14',
          device: 'iPhone 15 Pro',
          timestamp: '2026-09-12 18:11:40',
        },
        {
          event: 'Failed Login Attempt',
          status: 'FAILED',
          ip: '185.220.101.5',
          device: 'Unknown Client (Tor Exit)',
          timestamp: '2026-09-10 03:42:19',
        },
      ];
    }

    await user.save();

    res.json({
      success: true,
      data: {
        isWalletFrozen: wallet?.isFrozen || false,
        twoFactorEnabled: user.twoFactorEnabled ?? true,
        biometricsEnabled: user.biometricsEnabled ?? false,
        autoLockMinutes: user.autoLockMinutes ?? 15,
        activeSessions: user.activeSessions.map((s) => ({
          id: s._id.toString(),
          device: s.device,
          location: s.location,
          ipAddress: s.ipAddress,
          lastActive: s.lastActive,
          isCurrent: s.isCurrent,
        })),
        securityActivityLogs: user.securityLogs.slice(-15).reverse().map((l) => ({
          id: l._id.toString(),
          event: l.event,
          status: l.status,
          ip: l.ip,
          device: l.device,
          timestamp: l.timestamp,
        })),
      },
    });
  } catch (err) {
    console.error('getActivityLog error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const terminateSession = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { sessionId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.activeSessions = user.activeSessions.filter((s) => s._id.toString() !== sessionId);
    await user.save();

    res.json({ success: true, message: 'Session terminated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const terminateAllOtherSessions = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.activeSessions = user.activeSessions.filter((s) => s.isCurrent);
    await user.save();

    res.json({ success: true, message: 'All other sessions terminated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateSecuritySettings = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { twoFactorEnabled, biometricsEnabled, autoLockMinutes } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (twoFactorEnabled !== undefined) user.twoFactorEnabled = twoFactorEnabled;
    if (biometricsEnabled !== undefined) user.biometricsEnabled = biometricsEnabled;
    if (autoLockMinutes !== undefined) user.autoLockMinutes = autoLockMinutes;

    await user.save();
    res.json({ success: true, message: 'Settings saved' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
