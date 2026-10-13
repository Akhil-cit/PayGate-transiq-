import { useEffect } from 'react';
import { useLogsStore } from '../store/logsStore';

const PendingTransactionMonitor = ({ showHeader = true }) => {
  const pendingTransactions = useLogsStore((state) => state.pendingTransactions);
  const fetchTransactions = useLogsStore((state) => state.fetchTransactions);
  const resolvePendingTransaction = useLogsStore((state) => state.resolvePendingTransaction);
  const cancelPendingTransaction = useLogsStore((state) => state.cancelPendingTransaction);

  useEffect(() => {
    fetchTransactions({ status: 'pending' });
  }, [fetchTransactions]);

  const formatParty = (party, fallback = 'Account') => {
    if (!party) return fallback;
    if (typeof party === 'string') return party;
    if (party.firstName || party.lastName) return `${party.firstName || ''} ${party.lastName || ''}`.trim();
    if (party.name) return party.name;
    return fallback;
  };

  const getElapsedTime = (createdAt) => {
    if (!createdAt) return 2;
    const diffMs = Date.now() - new Date(createdAt).getTime();
    return Math.max(1, Math.floor(diffMs / 60000));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 mb-6">
      {showHeader && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Pending Transactions & Gateway Monitor</h2>
            <p className="text-xs text-slate-500 mt-0.5">Tracking live in-flight payments awaiting bank clearing or 2FA confirmation</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            {pendingTransactions.length} In-Flight
          </span>
        </div>
      )}

      {pendingTransactions.length === 0 ? (
        <div className="py-10 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <p className="font-semibold text-slate-800 text-xs">Zero Pending Backlog</p>
          <p className="text-[11px] text-slate-400 mt-0.5">All initiated payments have settled or reached a terminal state in MongoDB.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingTransactions.map((txn) => {
            const elapsedMins = getElapsedTime(txn.createdAt);
            const maxMins = 30; // standard 30-min gateway clearing TTL
            const progress = Math.min((elapsedMins / maxMins) * 100, 100);
            const isNearTimeout = progress > 75;
            const txnId = txn.referenceCode || txn.transactionId || txn._id;
            const remitter = formatParty(txn.senderWalletId?.userId || txn.remitter, 'Remitter');
            const recipient = formatParty(txn.recipientId || txn.recipient, 'Recipient');

            return (
              <div
                key={txn._id || txn.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 hover:border-slate-300 transition"
              >
                {/* Top strip */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700">{txnId}</span>
                      <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-medium">
                        {txn.method || 'TRANSFER'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 font-medium">
                      {remitter} to {recipient}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-slate-900">₹{(txn.amount || 0).toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {txn.createdAt ? new Date(txn.createdAt).toLocaleTimeString() : 'Recent'}
                    </p>
                  </div>
                </div>

                {/* Status stage */}
                <div className="bg-white p-2 rounded-lg border border-slate-200 mb-3 text-xs flex items-center justify-between">
                  <span className="text-slate-500 text-[11px]">Gateway Stage:</span>
                  <span className="font-semibold text-amber-700 font-mono text-[11px]">Awaiting Bank Settlement ACK</span>
                </div>

                {/* Timeout Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-[11px] mb-1 font-mono">
                    <span className="text-slate-500">Elapsed: {elapsedMins} mins</span>
                    <span className={isNearTimeout ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                      Max TTL: {maxMins} mins
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${isNearTimeout ? 'bg-rose-500' : 'bg-amber-400'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Force Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => resolvePendingTransaction(txn._id || txn.id)}
                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                  >
                    Simulate Settlement (Success)
                  </button>
                  <button
                    onClick={() => cancelPendingTransaction(txn._id || txn.id)}
                    className="py-1.5 px-3 bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-700 rounded-lg text-xs font-medium transition cursor-pointer"
                  >
                    Cancel Payment
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PendingTransactionMonitor;
