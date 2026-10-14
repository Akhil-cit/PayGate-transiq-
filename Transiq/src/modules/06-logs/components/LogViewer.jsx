import { useState, useEffect } from 'react';
import { useLogsStore } from '../store/logsStore';

const LogViewer = () => {
  const transactionLogs = useLogsStore((state) => state.transactionLogs);
  const pendingTransactions = useLogsStore((state) => state.pendingTransactions);
  const fetchTransactions = useLogsStore((state) => state.fetchTransactions);

  const allLogs = [...transactionLogs, ...pendingTransactions];
  const [selectedLog, setSelectedLog] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    if (!selectedLog && allLogs.length > 0) {
      setSelectedLog(allLogs[0]);
    }
  }, [allLogs, selectedLog]);

  const normalizeStatus = (status = '') => {
    const s = status.toUpperCase();
    if (s === 'FAILURE') return 'FAILED';
    return s;
  };

  const formatParty = (party, fallback = 'Account') => {
    if (!party) return fallback;
    if (typeof party === 'string') return party;
    if (party.firstName || party.lastName) return `${party.firstName || ''} ${party.lastName || ''}`.trim();
    if (party.name) return party.name;
    return fallback;
  };

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

  const getMethodInfo = (method = '') => {
    switch (method.toUpperCase()) {
      case 'UPI':
        return {
          badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
          desc: 'Instant, zero-fee daily retail settlements up to ₹1,00,000.',
        };
      case 'IMPS':
        return {
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
          desc: 'High-value immediate 24x7 interbank clearing exceeding standard mobile limits.',
        };
      case 'NEFT':
        return {
          badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
          desc: 'Batch-wise national electronic clearing for standard scheduled payouts.',
        };
      case 'RTGS':
        return {
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
          desc: 'Real-time gross settlement for high-value corporate transfers (₹2 Lakh+).',
        };
      case 'CARD':
        return {
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          desc: 'Debit/Credit card processing via payment gateway network switch.',
        };
      case 'WALLET':
        return {
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          desc: 'Internal stored-value wallet ledger balance transfer.',
        };
      default:
        return {
          badge: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
          desc: 'Standard electronic interbank clearing.',
        };
    }
  };

  const filteredLogs = allLogs.filter((log) => {
    const s = normalizeStatus(log.status);
    const matchStatus = statusFilter === 'ALL' || s === statusFilter;
    const query = searchTerm.toLowerCase().trim();

    const id = (log.referenceCode || log.transactionId || log._id || '').toLowerCase();
    const remitter = formatParty(log.senderWalletId?.userId || log.remitter).toLowerCase();
    const recipient = formatParty(log.recipientId || log.recipient).toLowerCase();

    const matchQuery = !query || id.includes(query) || remitter.includes(query) || recipient.includes(query);
    return matchStatus && matchQuery;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Transaction Audit & Settlement Stream</h2>
          <p className="text-xs text-slate-500 mt-0.5">Comprehensive audit trail of transaction lifecycle, settlement verification, and gateway events</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-5 items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
        <div className="flex gap-1 bg-white p-1 rounded-md border border-slate-200">
          {['ALL', 'SUCCESS', 'FAILED', 'PENDING'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded text-xs font-medium cursor-pointer transition ${
                statusFilter === st
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Filter log stream by ID, user..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800 placeholder-slate-400 w-64"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs border border-dashed rounded-xl">
              No transaction logs found in database.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const id = log.referenceCode || log.transactionId || log._id;
              const remitter = formatParty(log.senderWalletId?.userId || log.remitter, 'Remitter');
              const recipient = formatParty(log.recipientId || log.recipient, 'Recipient');
              const isSelected = (selectedLog?._id || selectedLog?.id) === (log._id || log.id);
              const dateStr = log.createdAt ? new Date(log.createdAt).toLocaleString() : log.timestamp || 'N/A';

              return (
                <div
                  key={log._id || log.id}
                  onClick={() => setSelectedLog(log)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-500 shadow-2xs ring-1 ring-blue-500'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-mono text-xs font-bold text-blue-700">{id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(log.status)}`}>
                      {normalizeStatus(log.status)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-700 flex justify-between items-center font-medium">
                    <span>{remitter} to {recipient}</span>
                    <span className="font-bold text-slate-900">₹{(log.amount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
                    <span className="font-mono">{log.method || 'BANK_TRANSFER'}</span>
                    <span>{dateStr}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="lg:col-span-7">
          {selectedLog ? (
            <div className="bg-slate-900 text-slate-200 rounded-xl p-5 border border-slate-800 shadow-md sticky top-4">
              <div className="flex justify-between items-start border-b border-slate-800 pb-4 mb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Live Database Record</span>
                  <h3 className="font-mono text-lg font-bold text-blue-400">
                    {selectedLog.referenceCode || selectedLog.transactionId || selectedLog._id}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedLog.description || 'Electronic Fund Settlement'}</p>
                </div>
                <span className="px-2.5 py-1 rounded text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700">
                  {normalizeStatus(selectedLog.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs mb-4 font-mono">
                <div className="bg-slate-800/70 p-3 rounded-lg border border-slate-700">
                  <span className="text-slate-400 text-[10px] block uppercase">Remitter Account</span>
                  <span className="text-white font-semibold">{formatParty(selectedLog.senderWalletId?.userId || selectedLog.remitter)}</span>
                  <span className="text-slate-400 text-[10px] block mt-0.5">
                    Wallet: {selectedLog.senderWalletId?._id ? String(selectedLog.senderWalletId._id).slice(-8) : selectedLog.remitterAccount || 'Linked'}
                  </span>
                </div>
                <div className="bg-slate-800/70 p-3 rounded-lg border border-slate-700">
                  <span className="text-slate-400 text-[10px] block uppercase">Recipient Account</span>
                  <span className="text-white font-semibold">{formatParty(selectedLog.recipientId || selectedLog.recipient)}</span>
                  <span className="text-slate-400 text-[10px] block mt-0.5">
                    Dest: {selectedLog.recipientId?.accountNumber || selectedLog.recipientAccount || 'Verified'}
                  </span>
                </div>
                <div className="bg-slate-800/70 p-3 rounded-lg border border-slate-700">
                  <span className="text-slate-400 text-[10px] block uppercase">Settlement Amount</span>
                  <span className="text-emerald-400 font-bold text-sm">₹{(selectedLog.amount || 0).toLocaleString()} {selectedLog.currency || 'INR'}</span>
                </div>
                <div className="bg-slate-800/70 p-3 rounded-lg border border-slate-700">
                  <span className="text-slate-400 text-[10px] block uppercase">Transaction Type</span>
                  <span className="text-blue-300 uppercase">{selectedLog.type || 'TRANSFER'}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gateway Audit & Security Clearance</p>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-slate-500 text-[10px]">Payment Protocol</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${getMethodInfo(selectedLog.method).badge}`}>
                        {selectedLog.method || 'BANK_TRANSFER'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-300 font-sans leading-tight">
                      {getMethodInfo(selectedLog.method).desc}
                    </p>
                  </div>
                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px]">Settlement Status</span>
                    <span className={`font-semibold ${
                      normalizeStatus(selectedLog.status) === 'SUCCESS' ? 'text-emerald-400' :
                      normalizeStatus(selectedLog.status) === 'FAILED' ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      {normalizeStatus(selectedLog.status)}
                    </span>
                  </div>
                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px]">Origin Timestamp</span>
                    <span className="text-slate-300">
                      {selectedLog.createdAt ? new Date(selectedLog.createdAt).toLocaleString() : 'Live Recorded'}
                    </span>
                  </div>
                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px]">Database Record ID</span>
                    <span className="text-slate-400 text-[10px] truncate block font-mono">
                      {selectedLog._id || selectedLog.id || 'N/A'}
                    </span>
                  </div>
                </div>

                {selectedLog.failureReason ? (
                  <div className="p-3 bg-rose-950/40 border border-rose-800/50 rounded-lg text-xs">
                    <span className="text-rose-400 font-bold block text-[10px] uppercase tracking-wider">Failure Diagnosis</span>
                    <p className="text-rose-200 mt-0.5">{selectedLog.failureReason}</p>
                  </div>
                ) : (
                  <div className="p-2.5 bg-emerald-950/30 border border-emerald-800/40 rounded-lg text-xs flex items-center justify-between">
                    <span className="text-emerald-400 font-medium text-[11px]">Integrity Check Passed</span>
                    <span className="text-emerald-300 font-mono text-[10px]">Verified Hash & Ledger Sync</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
              Select a transaction on the left to inspect audit details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogViewer;
