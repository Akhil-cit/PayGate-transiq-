import { useState, useEffect } from 'react';
import { useLogsStore } from '../store/logsStore';

const ErrorLogViewer = ({ showHeader = true }) => {
  const errorLogs = useLogsStore((state) => state.errorLogs);
  const fetchErrors = useLogsStore((state) => state.fetchErrors);
  const toggleResolveError = useLogsStore((state) => state.toggleResolveError);
  const resolveAllErrors = useLogsStore((state) => state.resolveAllErrors);

  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [expandedTrace, setExpandedTrace] = useState(null);

  useEffect(() => {
    fetchErrors();
  }, [fetchErrors]);

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-600 text-white font-semibold';
      case 'HIGH':
        return 'bg-orange-500 text-white font-semibold';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold';
      case 'LOW':
        return 'bg-slate-100 text-slate-700 font-semibold';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getErrorCodeColor = (errorCode) => {
    switch (errorCode) {
      case 'INSUFFICIENT_FUNDS':
      case 'INVALID_AMOUNT':
        return 'text-rose-600';
      case 'BANK_TIMEOUT':
      case 'NETWORK_ERROR':
        return 'text-purple-600';
      case 'VALIDATION_ERROR':
        return 'text-amber-600';
      case 'AUTHORIZATION_FAILED':
        return 'text-indigo-600';
      default:
        return 'text-slate-700';
    }
  };

  const getTxnRef = (txn) => {
    if (!txn) return 'N/A';
    if (typeof txn === 'object') return txn.referenceCode || txn._id || 'N/A';
    return String(txn);
  };

  const filteredLogs = errorLogs.filter((log) => {
    let matchStatus = true;
    if (filter === 'UNRESOLVED') matchStatus = !log.resolved;
    else if (filter === 'RESOLVED') matchStatus = log.resolved;
    else if (filter !== 'ALL') matchStatus = log.severity === filter;

    const query = search.toLowerCase().trim();
    const txnRef = getTxnRef(log.transactionId);
    const matchQuery =
      !query ||
      (log.errorId && String(log.errorId).toLowerCase().includes(query)) ||
      (log.errorCode && String(log.errorCode).toLowerCase().includes(query)) ||
      (log.message && String(log.message).toLowerCase().includes(query)) ||
      (txnRef && txnRef.toLowerCase().includes(query));

    return matchStatus && matchQuery;
  });

  const unresolvedCount = errorLogs.filter((l) => !l.resolved).length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 mb-6">
      {showHeader && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">System Error Logs & Exception Diagnostics</h2>
              {unresolvedCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200">
                  {unresolvedCount} Pending
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Captures banking exceptions, network timeouts, and payment validation failures</p>
          </div>

          <button
            onClick={() => resolveAllErrors()}
            disabled={unresolvedCount === 0}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition ${
              unresolvedCount > 0
                ? 'bg-slate-900 hover:bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            Mark All Resolved
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 mb-5 flex flex-wrap gap-3 items-center justify-between">
        {/* Severity & Resolution Filters */}
        <div className="flex flex-wrap gap-1 bg-white p-1 rounded-lg border border-slate-200">
          {[
            { key: 'ALL', label: 'All Errors', count: errorLogs.length },
            { key: 'UNRESOLVED', label: 'Unresolved', count: unresolvedCount },
            { key: 'RESOLVED', label: 'Resolved', count: errorLogs.filter((l) => l.resolved).length },
            { key: 'CRITICAL', label: 'Critical', count: errorLogs.filter((l) => l.severity === 'CRITICAL').length },
            { key: 'HIGH', label: 'High', count: errorLogs.filter((l) => l.severity === 'HIGH').length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition flex items-center gap-1.5 ${
                filter === tab.key
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  filter === tab.key ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search error ID, code, message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Error Logs List */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="py-8 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <p className="text-xs font-semibold text-slate-700">No error records found</p>
            <p className="text-[11px] text-slate-400 mt-0.5">All transactions executing normally.</p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const logId = log._id || log.id || log.errorId;
            const txnRef = getTxnRef(log.transactionId);
            return (
              <div
                key={logId}
                className={`border rounded-xl p-4 transition ${
                  log.resolved ? 'bg-slate-50/70 border-slate-200 opacity-80' : 'bg-white border-rose-200 shadow-2xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {log.errorId || logId}
                    </span>
                    <span className={`font-mono text-xs font-bold ${getErrorCodeColor(log.errorCode)}`}>
                      {log.errorCode}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      Source: {log.source || 'Payment Gateway'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center justify-center px-2 py-1 h-[26px] rounded text-[11px] font-semibold ${getSeverityBadge(log.severity)}`}>
                      {log.severity}
                    </span>
                    <button
                      onClick={() => toggleResolveError(log._id || logId)}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                        log.resolved
                          ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {log.resolved ? 'Re-open' : 'Resolve'}
                    </button>
                  </div>
                </div>

                {/* Message */}
                <p className="text-xs font-medium text-slate-800 mb-2">{log.message}</p>

                {/* Stack Trace Accordion */}
                {log.stackTrace && (
                  <div className="mb-2">
                    <button
                      onClick={() => setExpandedTrace(expandedTrace === logId ? null : logId)}
                      className="text-[11px] font-medium text-blue-600 hover:underline cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>{expandedTrace === logId ? 'Hide Diagnostics' : 'Show Diagnostics'}</span>
                    </button>
                    {expandedTrace === logId && (
                      <div className="mt-2 p-3 bg-slate-900 text-slate-200 rounded-lg text-[11px] font-mono overflow-x-auto border border-slate-800">
                        <code>{log.stackTrace}</code>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer Meta */}
                <div className="flex flex-wrap justify-between items-center text-[11px] text-slate-500 pt-2.5 border-t border-slate-100 gap-2">
                  <span className="font-mono">
                    Transaction Ref: <strong className="text-blue-600 font-semibold">{txnRef}</strong>
                  </span>
                  <span>
                    Logged:{' '}
                    <strong className="text-slate-700 font-medium">
                      {log.createdAt ? new Date(log.createdAt).toLocaleString() : log.timestamp || 'Recent'}
                    </strong>
                  </span>
                  <span className={`font-semibold ${log.resolved ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {log.resolved ? 'Resolved' : 'Unresolved'}
                  </span>
                </div>

                {log.resolutionNotes && (
                  <div className="mt-2 text-xs bg-emerald-50 text-emerald-800 p-2 rounded border border-emerald-200">
                    {log.resolutionNotes}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ErrorLogViewer;
