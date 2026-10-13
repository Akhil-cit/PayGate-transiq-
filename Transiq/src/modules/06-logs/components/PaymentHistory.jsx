import { useState, useEffect } from 'react';
import { useLogsStore } from '../store/logsStore';
import TransactionModal from './TransactionModal';

const PaymentHistory = ({ defaultFilter = 'ALL', showHeader = true }) => {
  const transactionLogs = useLogsStore((state) => state.transactionLogs);
  const fetchTransactions = useLogsStore((state) => state.fetchTransactions);
  const retryFailedTransaction = useLogsStore((state) => state.retryFailedTransaction);

  const [statusFilter, setStatusFilter] = useState(defaultFilter);
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTxn, setSelectedTxn] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const formatParty = (party, fallback = 'Account') => {
    if (!party) return fallback;
    if (typeof party === 'string') return party;
    if (party.firstName || party.lastName) return `${party.firstName || ''} ${party.lastName || ''}`.trim();
    if (party.name) return party.name;
    return fallback;
  };

  const normalizeStatus = (status = '') => {
    const s = status.toUpperCase();
    if (s === 'FAILURE') return 'FAILED';
    return s;
  };

  const filteredLogs = transactionLogs.filter((log) => {
    const normStatus = normalizeStatus(log.status);
    const matchesStatus = statusFilter === 'ALL' || normStatus === statusFilter;
    const matchesMethod = methodFilter === 'ALL' || (log.method || '').toUpperCase() === methodFilter;
    const query = searchQuery.toLowerCase().trim();

    const id = (log.referenceCode || log.transactionId || log._id || '').toLowerCase();
    const remitter = formatParty(log.senderWalletId?.userId || log.remitter, 'Remitter').toLowerCase();
    const recipient = formatParty(log.recipientId || log.recipient, 'Recipient').toLowerCase();
    const desc = (log.description || '').toLowerCase();

    const matchesQuery =
      !query ||
      id.includes(query) ||
      remitter.includes(query) ||
      recipient.includes(query) ||
      desc.includes(query);

    return matchesStatus && matchesMethod && matchesQuery;
  });

  const getStatusBadge = (status = '') => {
    const s = normalizeStatus(status);
    switch (s) {
      case 'SUCCESS':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'FAILED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusDot = (status = '') => {
    const s = normalizeStatus(status);
    switch (s) {
      case 'SUCCESS':
        return 'bg-emerald-500';
      case 'FAILED':
        return 'bg-rose-500';
      case 'PENDING':
        return 'bg-amber-500';
      default:
        return 'bg-slate-400';
    }
  };

  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Remitter', 'Recipient', 'Amount', 'Currency', 'Status', 'Timestamp', 'Method'];
    const rows = filteredLogs.map((l) => [
      l.referenceCode || l.transactionId || l._id,
      formatParty(l.senderWalletId?.userId || l.remitter),
      formatParty(l.recipientId || l.recipient),
      l.amount,
      l.currency || 'INR',
      normalizeStatus(l.status),
      l.createdAt ? new Date(l.createdAt).toLocaleString() : l.timestamp,
      l.method,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `PayGate_Transaction_History_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const counts = {
    ALL: transactionLogs.length,
    SUCCESS: transactionLogs.filter((l) => normalizeStatus(l.status) === 'SUCCESS').length,
    FAILED: transactionLogs.filter((l) => normalizeStatus(l.status) === 'FAILED').length,
    PENDING: transactionLogs.filter((l) => normalizeStatus(l.status) === 'PENDING').length,
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 mb-6">
      {showHeader && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Payment History & Status Records</h2>
            <p className="text-xs text-slate-500 mt-0.5">Comprehensive audit trail of all transactions handled by the gateway</p>
          </div>
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition cursor-pointer"
          >
            Export CSV
          </button>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 mb-5 flex flex-wrap gap-3 items-center justify-between">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-1 bg-white p-1 rounded-lg border border-slate-200">
          {[
            { key: 'ALL', label: 'All Records', count: counts.ALL },
            { key: 'SUCCESS', label: 'Success', count: counts.SUCCESS },
            { key: 'FAILED', label: 'Failed', count: counts.FAILED },
            { key: 'PENDING', label: 'Pending', count: counts.PENDING },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
                statusFilter === tab.key
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                statusFilter === tab.key ? 'bg-blue-800 text-blue-100' : 'bg-slate-200 text-slate-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Method Filter */}
        <div className="flex flex-wrap gap-2 flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by ID, Remitter, Recipient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[180px] px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800 placeholder-slate-400"
          />
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800 cursor-pointer"
          >
            <option value="ALL">All Methods</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="CARD">Card</option>
            <option value="WALLET">Wallet</option>
            <option value="UPI">UPI</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-200 uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-4 py-3">Transaction ID</th>
              <th className="px-4 py-3">Remitter</th>
              <th className="px-4 py-3">Recipient</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center text-slate-500">
                  No payment records found matching current criteria.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => {
                const id = log.referenceCode || log.transactionId || log._id;
                const remitterName = formatParty(log.senderWalletId?.userId || log.remitter, 'Remitter');
                const recipientName = formatParty(log.recipientId || log.recipient, 'Recipient');
                const remitterAcc = log.senderWalletId?.userId?.phone || log.remitterAccount || 'Account Verified';
                const recipientAcc = log.recipientId?.accountNumber || log.recipientAccount || 'Dest Verified';
                const dateStr = log.createdAt ? new Date(log.createdAt).toLocaleString() : log.timestamp || 'N/A';

                return (
                  <tr key={log._id || log.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-mono font-semibold text-blue-600">
                      <button
                        onClick={() => setSelectedTxn({
                          ...log,
                          transactionId: id,
                          remitter: remitterName,
                          recipient: recipientName,
                          timestamp: dateStr,
                        })}
                        className="hover:underline cursor-pointer"
                      >
                        {id}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">{remitterName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{remitterAcc}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">{recipientName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{recipientAcc}</p>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">
                      ₹{(log.amount || 0).toLocaleString()}
                      <span className="text-[10px] font-normal text-slate-400 ml-1">({log.currency || 'INR'})</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">{log.method || 'TRANSFER'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(log.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(log.status)}`} />
                        {normalizeStatus(log.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">{dateStr}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {normalizeStatus(log.status) === 'FAILED' && (
                          <button
                            onClick={() => retryFailedTransaction(log._id || log.id)}
                            className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded text-[11px] font-semibold transition cursor-pointer"
                          >
                            Retry
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedTxn({
                            ...log,
                            transactionId: id,
                            remitter: remitterName,
                            recipient: recipientName,
                            timestamp: dateStr,
                          })}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium transition cursor-pointer"
                        >
                          Audit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {selectedTxn && (
        <TransactionModal
          transaction={selectedTxn}
          onClose={() => setSelectedTxn(null)}
        />
      )}
    </div>
  );
};

export default PaymentHistory;
