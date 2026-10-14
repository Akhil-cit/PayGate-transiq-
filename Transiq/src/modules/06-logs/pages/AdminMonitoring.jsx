import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLogsStore } from '../store/logsStore';

const AdminMonitoring = () => {
  const stats = useLogsStore((state) => state.stats);
  const transactionLogs = useLogsStore((state) => state.transactionLogs);
  const errorLogs = useLogsStore((state) => state.errorLogs);
  const pendingTransactions = useLogsStore((state) => state.pendingTransactions);
  const systemHealth = useLogsStore((state) => state.systemHealth);
  const fetchStats = useLogsStore((state) => state.fetchStats);
  const fetchTransactions = useLogsStore((state) => state.fetchTransactions);
  const fetchErrors = useLogsStore((state) => state.fetchErrors);
  const fetchHealth = useLogsStore((state) => state.fetchHealth);

  useEffect(() => {
    fetchStats();
    fetchTransactions();
    fetchErrors();
    fetchHealth();
    // Poll telemetry every 10 seconds
    const timer = setInterval(fetchHealth, 10000);
    return () => clearInterval(timer);
  }, [fetchStats, fetchTransactions, fetchErrors, fetchHealth]);

  const totalTransactions = stats?.totalTxns ?? (transactionLogs.length + pendingTransactions.length);
  const successTransactions = stats?.successTxns ?? transactionLogs.filter((log) => (log.status || '').toUpperCase() === 'SUCCESS').length;
  const failedTransactions = stats?.failedTxns ?? transactionLogs.filter((log) => (log.status || '').toUpperCase() === 'FAILURE' || (log.status || '').toUpperCase() === 'FAILED').length;
  const pendingCount = stats?.pendingTxns ?? pendingTransactions.length;
  const unresolvedErrors = stats?.unresolvedErrors ?? errorLogs.filter((log) => !log.resolved).length;
  const totalVolume = stats?.totalVolume ?? transactionLogs
    .filter((l) => (l.status || '').toUpperCase() === 'SUCCESS')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const successRate = stats?.successRate ?? (totalTransactions > 0 ? ((successTransactions / totalTransactions) * 100).toFixed(1) : 0);
  const failureRate = stats?.failureRate ?? (totalTransactions > 0 ? ((failedTransactions / totalTransactions) * 100).toFixed(1) : 0);

  const recentTransactions = transactionLogs.slice(0, 5);
  const recentErrors = errorLogs.filter((l) => !l.resolved).slice(0, 3);

  const getStatusBadge = (status = '') => {
    const s = status.toUpperCase();
    switch (s) {
      case 'SUCCESS':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'FAILURE':
      case 'FAILED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-600 text-white';
      case 'HIGH':
        return 'bg-orange-500 text-white';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-900 border border-amber-300';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const formatPartyName = (party) => {
    if (!party) return 'External Account';
    if (typeof party === 'string') return party;
    if (party.firstName || party.lastName) return `${party.firstName || ''} ${party.lastName || ''}`.trim();
    if (party.name) return party.name;
    return 'Customer Account';
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 pr-36">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Admin Telemetry & Operations</span>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">Admin Monitoring Overview</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              High-level gateway telemetry and system health
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-semibold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Gateway Active
          </span>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Transactions</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{totalTransactions}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Settled Volume</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">₹{totalVolume.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">Success Rate</p>
            <p className="text-2xl font-bold text-emerald-600 mt-2">{successRate}%</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{successTransactions} successful</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider">Failed</p>
            <p className="text-2xl font-bold text-rose-600 mt-2">{failedTransactions}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{failureRate}% failure</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">Pending</p>
            <p className="text-2xl font-bold text-amber-600 mt-2">{pendingCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-[11px] font-semibold text-orange-700 uppercase tracking-wider">Errors</p>
            <p className="text-2xl font-bold text-orange-600 mt-2">{unresolvedErrors}</p>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left: Recent Activity & Pending */}
          <div className="xl:col-span-2 space-y-6">
            {/* Recent Transactions */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-bold text-slate-900">Recent Payment Activity</h2>
                <Link to="/admin/history" className="text-xs font-semibold text-blue-600 hover:text-blue-800">
                  View all ({totalTransactions})
                </Link>
              </div>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full min-w-[580px] text-left text-xs">
                  <thead className="bg-slate-900 text-slate-300 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-3 py-2.5 whitespace-nowrap">Txn ID</th>
                      <th className="px-3 py-2.5 whitespace-nowrap">Parties</th>
                      <th className="px-3 py-2.5 whitespace-nowrap">Amount</th>
                      <th className="px-3 py-2.5 whitespace-nowrap">Status</th>
                      <th className="px-3 py-2.5 whitespace-nowrap">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-3 py-4 text-center text-slate-400">
                          No transactions recorded yet.
                        </td>
                      </tr>
                    ) : (
                      recentTransactions.map((log) => {
                        const id = log.referenceCode || log.transactionId || log._id;
                        const remitterName = formatPartyName(log.senderWalletId?.userId || log.remitter);
                        const recipientName = formatPartyName(log.recipientId || log.recipient);
                        const dateStr = log.createdAt ? new Date(log.createdAt).toLocaleTimeString() : log.timestamp || 'N/A';

                        return (
                          <tr key={log._id || log.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-3 py-2.5 font-mono text-[11px] font-semibold text-blue-600 whitespace-nowrap">{id}</td>
                            <td className="px-3 py-2.5 text-slate-700 text-xs">
                              <span className="font-medium text-slate-800">{remitterName}</span> <span className="text-slate-400">to</span> <span className="font-medium text-slate-800">{recipientName}</span>
                            </td>
                            <td className="px-3 py-2.5 font-bold text-slate-900 whitespace-nowrap">₹{(log.amount || 0).toLocaleString()}</td>
                            <td className="px-3 py-2.5 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadge(log.status)}`}>
                                {(log.status || '').toUpperCase()}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-slate-500 font-mono text-[11px] whitespace-nowrap">{dateStr}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pending Queue */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-bold text-slate-900">In-Flight Pending Queue</h2>
                <Link to="/admin/pending" className="text-xs font-semibold text-amber-700 hover:text-amber-800">
                  Open monitor ({pendingCount})
                </Link>
              </div>
              {pendingTransactions.length === 0 ? (
                <p className="p-4 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-xs">
                  No pending transactions. All payments settled.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {pendingTransactions.map((txn) => {
                    const id = txn.referenceCode || txn.transactionId || txn._id;
                    const remitterName = formatPartyName(txn.senderWalletId?.userId || txn.remitter);
                    const recipientName = formatPartyName(txn.recipientId || txn.recipient);

                    return (
                      <div key={txn._id || txn.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-blue-700 text-xs">{id}</span>
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 rounded font-medium">
                              {txn.statusStage || 'Processing'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">{remitterName} to {recipientName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900 text-xs">₹{txn.amount?.toLocaleString()}</p>
                          <p className="text-[11px] text-slate-400">{txn.durationMinutes || 5}m / {txn.maxAllowedMinutes || 30}m</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right: Health & Errors */}
          <div className="space-y-6">
            {/* Real System Health Telemetry */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">System Health</h3>
                <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                  systemHealth?.status === 'Operational'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {systemHealth?.status || 'Connecting...'}
                </span>
              </div>
              <div className="space-y-2 text-xs">
                {[
                  ['MongoDB Status', systemHealth?.database || 'Connecting...', systemHealth?.database === 'Connected'],
                  ['Database Ping', systemHealth?.dbPingMs || 'Calculating...', true],
                  ['Gateway Roundtrip', systemHealth?.serverLatency || 'Calculating...', false],
                  ['Server Heap Memory', systemHealth?.memoryHeapUsed || 'N/A', false],
                  ['Process Uptime', systemHealth?.uptime || 'N/A', false],
                ].map(([label, value, isGreen]) => (
                  <div key={label} className="flex justify-between items-center py-1 border-b border-slate-50 last:border-0">
                    <span className="text-slate-600">{label}</span>
                    <span className={`font-semibold ${isGreen ? 'text-emerald-600' : 'text-slate-800 font-mono'}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Errors */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-slate-900 text-sm">Unresolved Exceptions</h3>
                <Link to="/admin/errors" className="text-xs font-semibold text-rose-600 hover:text-rose-800">
                  All errors ({errorLogs.length})
                </Link>
              </div>
              {recentErrors.length === 0 ? (
                <p className="p-3 text-center text-slate-500 bg-slate-50 rounded-lg text-xs">No unresolved exceptions.</p>
              ) : (
                <div className="space-y-2">
                  {recentErrors.map((err) => (
                    <div key={err._id || err.id} className="p-2.5 bg-rose-50/50 rounded-lg border border-rose-100 text-xs">
                      <div className="flex justify-between items-start mb-0.5">
                        <span className="font-mono font-bold text-slate-800 text-[11px]">{err.errorCode || err.errorId}</span>
                        <span className={`px-1.5 rounded text-[10px] font-bold ${getSeverityBadge(err.severity)}`}>
                          {err.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2">{err.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMonitoring;
