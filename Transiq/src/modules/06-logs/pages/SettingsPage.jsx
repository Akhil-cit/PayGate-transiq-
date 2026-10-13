import { useState, useEffect } from 'react';
import adminService from '../../../api/adminService';

const SettingsPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState(null);

  // Gateway Settings State
  const [gatewaySettings, setGatewaySettings] = useState(() => {
    try {
      const saved = localStorage.getItem('paygate_gateway_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      pendingTimeoutMinutes: 30,
      maxRetryAttempts: 3,
      autoResolveLowSeverity: false,
      logRetentionDays: 90,
      errorAlertThreshold: 'HIGH',
    };
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await adminService.getUsers();
      setUsers(data.data || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFreezeToggle = async (userId) => {
    setActionLoading(userId);
    setMessage(null);
    try {
      const { data } = await adminService.freezeWallet(userId);
      setMessage({ type: 'success', text: data.message || 'Wallet status updated.' });
      setUsers((prev) =>
        prev.map((u) => {
          if (u._id === userId && u.wallet) {
            return { ...u, wallet: { ...u.wallet, isFrozen: data.data.isFrozen } };
          }
          return u;
        })
      );
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update wallet freeze status.' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleActivateToggle = async (userId) => {
    setActionLoading(userId);
    setMessage(null);
    try {
      const { data } = await adminService.toggleUserActive(userId);
      setMessage({ type: 'success', text: data.message || 'User status updated.' });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isActive: data.data.isActive } : u))
      );
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to toggle user activation.' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('paygate_gateway_settings', JSON.stringify(gatewaySettings));
    } catch {}
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 pr-36">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Platform Configuration</span>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">Admin Settings & Gateway Governance</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure system parameters, gateway timeout policies, and manage customer account security controls
          </p>
        </div>

        {message && (
          <div
            className={`p-3.5 rounded-lg text-xs font-medium border flex justify-between items-center ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600 font-bold">
              ✕
            </button>
          </div>
        )}

        <div className="space-y-6">
          {/* Left: Customer Account Security Governance (Live Database) */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Account Security & Wallet Freezing</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live customer database controls to freeze wallets or deactivate suspicious entities
                  </p>
                </div>
                <button
                  onClick={fetchUsers}
                  className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium transition cursor-pointer"
                >
                  Refresh Users
                </button>
              </div>

              {loading ? (
                <div className="py-12 text-center text-slate-400 text-xs">Loading customer directory...</div>
              ) : users.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs border border-dashed rounded-lg">
                  No registered customer accounts found in MongoDB.
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <table className="min-w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-200 uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="px-3.5 py-2.5 whitespace-nowrap">User</th>
                        <th className="px-3.5 py-2.5 whitespace-nowrap">Email</th>
                        <th className="px-3.5 py-2.5 whitespace-nowrap">Wallet Balance</th>
                        <th className="px-3.5 py-2.5 whitespace-nowrap">Wallet State</th>
                        <th className="px-3.5 py-2.5 whitespace-nowrap text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.map((u) => {
                        const isFrozen = u.wallet?.isFrozen;
                        const balance = u.wallet ? `₹${u.wallet.mainBalance?.toLocaleString()}` : 'No Wallet';

                        return (
                          <tr key={u._id} className="hover:bg-slate-50 transition">
                            <td className="px-3.5 py-2.5 font-medium text-slate-900">
                              {u.firstName} {u.lastName || ''}
                            </td>
                            <td className="px-3.5 py-2.5 font-mono text-slate-600 text-[11px]">{u.email}</td>
                            <td className="px-3.5 py-2.5 font-bold text-slate-800">{balance}</td>
                            <td className="px-3.5 py-2.5">
                              <span
                                className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold border ${
                                  isFrozen
                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                }`}
                              >
                                {isFrozen ? 'FROZEN' : 'ACTIVE'}
                              </span>
                            </td>
                            <td className="px-3.5 py-2.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleFreezeToggle(u._id)}
                                  disabled={actionLoading === u._id}
                                  className={`px-2 py-1 rounded text-[11px] font-semibold border transition cursor-pointer ${
                                    isFrozen
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                                      : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                                  }`}
                                >
                                  {isFrozen ? 'Unfreeze' : 'Freeze Wallet'}
                                </button>
                                <button
                                  onClick={() => handleActivateToggle(u._id)}
                                  disabled={actionLoading === u._id}
                                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium transition cursor-pointer"
                                >
                                  {u.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Database & Storage Architecture */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
              <h2 className="text-sm font-bold text-slate-900">Database & Connection Configuration</h2>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-400 text-[10px] block uppercase">Active Database</span>
                  <span className="font-bold text-slate-800">paygate_db</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-400 text-[10px] block uppercase">Driver / Connector</span>
                  <span className="font-bold text-slate-800">Mongoose 8.x (B-Tree Indexes)</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-400 text-[10px] block uppercase">Authentication Mode</span>
                  <span className="font-bold text-slate-800">JWT (HS256) + bcrypt-salt 12</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-400 text-[10px] block uppercase">Strict Schema Enforcement</span>
                  <span className="font-bold text-emerald-600">Enabled (strict: true)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Gateway Rules & Policy Controls */}
          <div className="space-y-6">
            <form onSubmit={handleSaveSettings} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold text-slate-900">Gateway Policies & Timeout Rules</h2>
                <p className="text-xs text-slate-500 mt-0.5">Threshold parameters used by pending monitors and error handlers</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pending Transaction Timeout (Minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={gatewaySettings.pendingTimeoutMinutes}
                  onChange={(e) =>
                    setGatewaySettings({ ...gatewaySettings, pendingTimeoutMinutes: parseInt(e.target.value) || 30 })
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800"
                />
                <p className="text-[11px] text-slate-400 mt-0.5">Transactions exceeding this TTL flag automated bank timeout warnings.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Maximum Auto-Retry Attempts on Network Glitch
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={gatewaySettings.maxRetryAttempts}
                  onChange={(e) =>
                    setGatewaySettings({ ...gatewaySettings, maxRetryAttempts: parseInt(e.target.value) || 3 })
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Audit Log Retention Period (Days)
                </label>
                <select
                  value={gatewaySettings.logRetentionDays}
                  onChange={(e) =>
                    setGatewaySettings({ ...gatewaySettings, logRetentionDays: parseInt(e.target.value) || 90 })
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800 cursor-pointer"
                >
                  <option value={30}>30 Days</option>
                  <option value={60}>60 Days</option>
                  <option value={90}>90 Days (Standard Banking)</option>
                  <option value={180}>180 Days (Extended)</option>
                  <option value={365}>365 Days (Annual Audit)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Critical Alert Severity Level
                </label>
                <select
                  value={gatewaySettings.errorAlertThreshold}
                  onChange={(e) => setGatewaySettings({ ...gatewaySettings, errorAlertThreshold: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800 cursor-pointer"
                >
                  <option value="CRITICAL">CRITICAL Only</option>
                  <option value="HIGH">HIGH and CRITICAL</option>
                  <option value="MEDIUM">MEDIUM, HIGH and CRITICAL</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  {savedSuccess ? '✓ Policy Saved' : 'Save Gateway Configuration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
