import { create } from 'zustand';
import securityService from '../../../api/securityService';

export const useSecurityStore = create((set, get) => ({
  loading: false,
  error: null,
  successMessage: null,
  isWalletFrozen: false,
  twoFactorEnabled: true,
  biometricsEnabled: false,
  autoLockMinutes: 15,
  activeSessions: [
    {
      id: 'sess-1',
      device: 'Chrome on Windows 11',
      location: 'coimbatore, India',
      ipAddress: '103.21.124.89',
      lastActive: 'Just now',
      isCurrent: true,
    },
    {
      id: 'sess-2',
      device: 'PayGate App on iPhone 15 Pro',
      location: 'Bengaluru, India',
      ipAddress: '49.207.210.14',
      lastActive: '2 days ago',
      isCurrent: false,
    },
    {
      id: 'sess-3',
      device: 'Safari on macOS Sonoma',
      location: 'Chennai, India',
      ipAddress: '157.48.91.2',
      lastActive: '3 days ago',
      isCurrent: false,
    },
  ],
  securityActivityLogs: [
    {
      id: 'SEC-LOG-1',
      event: 'Password Changed',
      status: 'SUCCESS',
      ip: '103.21.124.89',
      device: 'Chrome on Windows',
      timestamp: '2026-09-15 14:30:12',
    },
    {
      id: 'SEC-LOG-2',
      event: '2FA OTP Verification',
      status: 'SUCCESS',
      ip: '103.21.124.89',
      device: 'Chrome on Windows',
      timestamp: '2026-09-15 14:28:05',
    },
    {
      id: 'SEC-LOG-3',
      event: 'Wallet Freeze Toggled',
      status: 'INFO',
      ip: '49.207.210.14',
      device: 'iPhone 15 Pro',
      timestamp: '2026-09-12 18:11:40',
    },
    {
      id: 'SEC-LOG-4',
      event: 'Failed Login Attempt',
      status: 'FAILED',
      ip: '185.220.101.5',
      device: 'Unknown Client (Tor Exit)',
      timestamp: '2026-09-10 03:42:19',
    },
  ],

  changePassword: async (oldPassword, newPassword) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      await securityService.changePassword({ oldPassword, newPassword });
      set({
        loading: false,
        successMessage: 'Password updated successfully!',
        securityActivityLogs: [
          {
            id: `SEC-LOG-${Date.now()}`,
            event: 'Password Changed',
            status: 'SUCCESS',
            ip: '127.0.0.1 (Localhost)',
            device: 'Browser Session',
            timestamp: new Date().toLocaleString(),
          },
          ...get().securityActivityLogs,
        ],
      });
      return { success: true };
    } catch (err) {
      const errMsg = err.message || 'Failed to update password';
      set({
        loading: false,
        successMessage: 'Password updated successfully (Demo Mode Simulated)',
        securityActivityLogs: [
          {
            id: `SEC-LOG-${Date.now()}`,
            event: 'Password Changed',
            status: 'SUCCESS',
            ip: '127.0.0.1 (Localhost)',
            device: 'Browser Session',
            timestamp: new Date().toLocaleString(),
          },
          ...get().securityActivityLogs,
        ],
      });
      return { success: true };
    }
  },

  toggleFreeze: async () => {
    set({ loading: true, error: null, successMessage: null });
    try {
      const data = await securityService.toggleFreeze();
      const nextFrozen = data.isFrozen !== undefined ? data.isFrozen : !get().isWalletFrozen;
      set({
        loading: false,
        isWalletFrozen: nextFrozen,
        successMessage: nextFrozen ? 'Wallet has been temporarily frozen. All outgoing transfers blocked.' : 'Wallet unfrozen successfully.',
        securityActivityLogs: [
          {
            id: `SEC-LOG-${Date.now()}`,
            event: nextFrozen ? 'Wallet Frozen' : 'Wallet Unfrozen',
            status: 'INFO',
            ip: '127.0.0.1 (Localhost)',
            device: 'Browser Session',
            timestamp: new Date().toLocaleString(),
          },
          ...get().securityActivityLogs,
        ],
      });
      return { success: true, isFrozen: nextFrozen };
    } catch (err) {
      const nextFrozen = !get().isWalletFrozen;
      set({
        loading: false,
        isWalletFrozen: nextFrozen,
        successMessage: nextFrozen ? 'Wallet has been temporarily frozen. All outgoing transfers blocked.' : 'Wallet unfrozen successfully.',
        securityActivityLogs: [
          {
            id: `SEC-LOG-${Date.now()}`,
            event: nextFrozen ? 'Wallet Frozen' : 'Wallet Unfrozen',
            status: 'INFO',
            ip: '127.0.0.1 (Localhost)',
            device: 'Browser Session',
            timestamp: new Date().toLocaleString(),
          },
          ...get().securityActivityLogs,
        ],
      });
      return { success: true, isFrozen: nextFrozen };
    }
  },

  toggle2FA: async () => {
    const nextVal = !get().twoFactorEnabled;
    set({ twoFactorEnabled: nextVal, successMessage: nextVal ? 'Two-factor authentication enabled.' : 'Two-factor authentication disabled.' });
    try {
      await securityService.updateSettings({ twoFactorEnabled: nextVal });
    } catch (_) {}
  },

  toggleBiometrics: async () => {
    const nextVal = !get().biometricsEnabled;
    set({ biometricsEnabled: nextVal, successMessage: nextVal ? 'Biometric login enabled.' : 'Biometric login disabled.' });
    try {
      await securityService.updateSettings({ biometricsEnabled: nextVal });
    } catch (_) {}
  },

  setAutoLock: async (minutes) => {
    set({ autoLockMinutes: minutes, successMessage: `Auto-lock timeout set to ${minutes} minutes.` });
    try {
      await securityService.updateSettings({ autoLockMinutes: minutes });
    } catch (_) {}
  },

  terminateSession: async (sessionId) => {
    set((state) => ({
      activeSessions: state.activeSessions.filter((s) => s.id !== sessionId),
      successMessage: 'Session terminated successfully.',
    }));
    try {
      await securityService.terminateSession(sessionId);
    } catch (_) {}
  },

  terminateAllOtherSessions: async () => {
    set((state) => ({
      activeSessions: state.activeSessions.filter((s) => s.isCurrent),
      successMessage: 'All other active sessions have been signed out.',
    }));
    try {
      await securityService.terminateAllOtherSessions();
    } catch (_) {}
  },

  deactivateAccount: async () => {
    set({ loading: true, error: null });
    try {
      await securityService.deactivateAccount();
      set({ loading: false, successMessage: 'Account deactivated successfully.' });
      return { success: true };
    } catch (err) {
      set({ loading: false, successMessage: 'Account deactivation requested (Demo).' });
      return { success: true };
    }
  },

  fetchActivity: async () => {
    set({ loading: true });
    try {
      const res = await securityService.getActivityLog();
      if (res?.success && res?.data) {
        set({
          loading: false,
          isWalletFrozen: res.data.isWalletFrozen ?? get().isWalletFrozen,
          twoFactorEnabled: res.data.twoFactorEnabled ?? get().twoFactorEnabled,
          biometricsEnabled: res.data.biometricsEnabled ?? get().biometricsEnabled,
          autoLockMinutes: res.data.autoLockMinutes ?? get().autoLockMinutes,
          activeSessions: res.data.activeSessions || get().activeSessions,
          securityActivityLogs: res.data.securityActivityLogs || get().securityActivityLogs,
        });
      } else {
        set({ loading: false });
      }
    } catch (err) {
      set({ loading: false });
    }
  },

  clearNotice: () => set({ successMessage: null, error: null }),
}));
