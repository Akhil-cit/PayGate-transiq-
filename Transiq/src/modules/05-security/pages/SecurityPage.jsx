import React, { useState, useEffect } from 'react';
import { useSecurityStore } from '../store/useSecurityStore';

const SecurityPage = () => {
  const {
    loading,
    error,
    successMessage,
    isWalletFrozen,
    twoFactorEnabled,
    biometricsEnabled,
    autoLockMinutes,
    activeSessions,
    securityActivityLogs,
    changePassword,
    toggleFreeze,
    toggle2FA,
    toggleBiometrics,
    setAutoLock,
    terminateSession,
    terminateAllOtherSessions,
    deactivateAccount,
    fetchActivity,
    clearNotice,
  } = useSecurityStore();

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdError, setPwdError] = useState('');

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwdError('');
    if (newPassword.length < 8) {
      setPwdError('New password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError('New passwords do not match');
      return;
    }

    await changePassword(currentPassword, newPassword);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDeactivate = () => {
    if (
      window.confirm(
        '⚠️ Are you sure you want to deactivate your PayGate account? This will disable your wallet and revoke all active sessions.'
      )
    ) {
      deactivateAccount();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 pr-36">
          <div>
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              Account Security & Access Control
            </span>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">Security & Access Management</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Control authentication, device sessions, instant wallet kill-switch, and safety preferences.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Shield Protected (AES-256)
            </span>
          </div>
        </div>

        {/* Status Alerts */}
        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex justify-between items-center shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-base">✓</span>
              <span>{successMessage}</span>
            </div>
            <button
              onClick={clearNotice}
              className="text-emerald-700 font-bold hover:text-emerald-900 px-2 py-0.5 text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex justify-between items-center shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-base">⚠</span>
              <span>{error}</span>
            </div>
            <button
              onClick={clearNotice}
              className="text-rose-700 font-bold hover:text-rose-900 px-2 py-0.5 text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Emergency Kill-Switch & Wallet Freeze Banner */}
        <div
          className={`p-6 rounded-xl border transition-all duration-300 ${
            isWalletFrozen
              ? 'bg-rose-50/80 border-rose-300'
              : 'bg-gradient-to-r from-slate-900 to-slate-800 text-white border-slate-700'
          }`}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl"></span>
                <h2
                  className={`text-base font-bold ${
                    isWalletFrozen ? 'text-rose-900' : 'text-white'
                  }`}
                >
                  Emergency Wallet Freeze (Kill-Switch)
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                    isWalletFrozen
                      ? 'bg-rose-600 text-white'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {isWalletFrozen ? 'WALLET FROZEN' : 'WALLET ACTIVE'}
                </span>
              </div>
              <p
                className={`text-xs max-w-2xl ${
                  isWalletFrozen ? 'text-rose-700' : 'text-slate-300'
                }`}
              >
                {isWalletFrozen
                  ? 'Your wallet is currently LOCKED. All outbound transfers, payment requests, and pocket withdrawals are immediately declined.'
                  : 'In case of suspicious behavior or compromised device, instantly lock your wallet funds with zero delay.'}
              </p>
            </div>
            <button
              onClick={toggleFreeze}
              disabled={loading}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-md ${
                isWalletFrozen
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
            >
              {isWalletFrozen ? 'Unfreeze Wallet Now' : ' Freeze Wallet Instantly'}
            </button>
          </div>
        </div>

        {/* Main Grid: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Password & Auth Config */}
          <div className="lg:col-span-6 space-y-6">
            {/* Change Password Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-base"></span>
                  <h2 className="text-sm font-bold text-slate-900">Change Password</h2>
                </div>
                <span className="text-[11px] text-slate-400">Min 8 characters</span>
              </div>

              {pwdError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700">
                  {pwdError}
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    required
                    className="w-full text-xs px-3.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    required
                    className="w-full text-xs px-3.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    required
                    className="w-full text-xs px-3.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-4 rounded-lg transition-colors shadow-xs"
                  >
                    {loading ? 'Updating Password...' : 'Save New Password'}
                  </button>
                </div>
              </form>
            </div>

            {/* Authentication Preferences */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <span className="text-base"></span>
                <h2 className="text-sm font-bold text-slate-900">Multi-Factor Authentication</h2>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* 2FA Item */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-150">
                  <div>
                    <p className="font-semibold text-slate-900">Two-Factor Authentication (2FA)</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Require OTP verification code on payment authorization
                    </p>
                  </div>
                  <button
                    onClick={toggle2FA}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                      twoFactorEnabled
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>

                {/* Biometrics Item */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-150">
                  <div>
                    <p className="font-semibold text-slate-900">Biometric / TouchID Login</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Fast unlock on supported mobile & desktop devices
                    </p>
                  </div>
                  <button
                    onClick={toggleBiometrics}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                      biometricsEnabled
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {biometricsEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>

                {/* Auto-lock timer */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-150">
                  <div>
                    <p className="font-semibold text-slate-900">Session Auto-Lock Timeout</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Inactivity threshold before re-authenticating
                    </p>
                  </div>
                  <select
                    value={autoLockMinutes}
                    onChange={(e) => setAutoLock(Number(e.target.value))}
                    className="text-xs font-semibold bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-800 focus:outline-none"
                  >
                    <option value={5}>5 mins</option>
                    <option value={15}>15 mins</option>
                    <option value={30}>30 mins</option>
                    <option value={60}>1 hour</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sessions, Activity & Danger Zone */}
          <div className="lg:col-span-6 space-y-6">
            {/* Active Sessions */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-base"></span>
                  <h2 className="text-sm font-bold text-slate-900">Active Authorized Sessions</h2>
                </div>
                {activeSessions.length > 1 && (
                  <button
                    onClick={terminateAllOtherSessions}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-800"
                  >
                    Sign out all other devices
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {activeSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{session.device}</span>
                        {session.isCurrent && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Current Device
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {session.location} • <span className="font-mono">{session.ipAddress}</span> •{' '}
                        {session.lastActive}
                      </p>
                    </div>

                    {!session.isCurrent && (
                      <button
                        onClick={() => terminateSession(session.id)}
                        className="text-[11px] font-semibold text-rose-600 hover:bg-rose-50 px-2 py-1 rounded transition-colors"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Security Audit Log */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <span className="text-base"></span>
                <h2 className="text-sm font-bold text-slate-900">Recent Security Activity</h2>
              </div>

              <div className="space-y-2">
                {securityActivityLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{log.event}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            log.status === 'SUCCESS'
                              ? 'bg-emerald-100 text-emerald-800'
                              : log.status === 'FAILED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {log.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {log.ip} • {log.device}
                      </p>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-rose-50/50 rounded-xl border border-rose-200 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-base">⚠️</span>
                <h2 className="text-sm font-bold text-rose-900">Danger Zone</h2>
              </div>
              <p className="text-xs text-rose-700">
                Deactivating your account will immediately stop all active transfers, freeze wallet funds, and
                de-authorize your credentials permanently.
              </p>
              <button
                onClick={handleDeactivate}
                disabled={loading}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors shadow-xs"
              >
                Deactivate PayGate Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;
