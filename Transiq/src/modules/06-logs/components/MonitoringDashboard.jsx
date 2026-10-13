import { useLogsStore } from '../store/logsStore';

const MonitoringDashboard = () => {
  const transactionLogs = useLogsStore((state) => state.transactionLogs);
  const errorLogs = useLogsStore((state) => state.errorLogs);

  const totalTransactions = transactionLogs.length;
  const successCount = transactionLogs.filter((log) => log.status === 'SUCCESS' || log.status === 'success').length;
  const failureCount = transactionLogs.filter((log) => log.status === 'FAILED' || log.status === 'failure').length;
  const criticalErrors = errorLogs.filter((log) => log.severity === 'CRITICAL').length;

  const recentActivity = transactionLogs.slice(0, 5);

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'success') return 'bg-emerald-100 text-emerald-700';
    if (s === 'failed' || s === 'failure') return 'bg-rose-100 text-rose-700';
    return 'bg-amber-100 text-amber-700';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
      <h2 className="text-sm font-bold text-slate-900">Dashboard Overview</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Txns</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{totalTransactions}</p>
        </div>
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Success</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{successCount}</p>
        </div>
        <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Failures</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">{failureCount}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Critical Errors</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">{criticalErrors}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            No recent transactions.
          </p>
        ) : (
          <div className="space-y-2">
            {recentActivity.map((log) => {
              const id = log.referenceCode || (typeof log.transactionId === 'object' ? log.transactionId?.referenceCode : log.transactionId) || log._id;
              return (
                <div key={log._id || log.id} className="flex items-center justify-between bg-slate-50 border border-slate-100 p-3 rounded-lg">
                  <div>
                    <p className="font-mono text-xs font-semibold text-blue-600">{id}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{log.timestamp || (log.createdAt ? new Date(log.createdAt).toLocaleTimeString() : 'Recent')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 text-xs">₹{(log.amount || 0).toLocaleString()}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getStatusBadge(log.status)}`}>
                      {(log.status || '').toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MonitoringDashboard;
