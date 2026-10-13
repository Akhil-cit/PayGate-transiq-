const getOriginatingIp = (txn) => {
  return txn?.ipAddress || '103.21.124.89';
};

const TransactionModal = ({ transaction, onClose }) => {
  if (!transaction) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
      case 'FAILED':
        return 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
      case 'PENDING':
        return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
      default:
        return 'bg-slate-700 text-slate-300';
    }
  };

  const txnId =
    typeof transaction.transactionId === 'object'
      ? transaction.transactionId?.referenceCode || transaction.transactionId?._id
      : transaction.transactionId || transaction.referenceCode || transaction._id;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900 text-white rounded-t-xl">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-base font-bold tracking-wide text-blue-400">
                {txnId}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusBadge(transaction.status)}`}>
                {transaction.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">Timestamp: {transaction.timestamp}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-bold p-1 rounded-md hover:bg-slate-800 transition cursor-pointer leading-none"
            aria-label="Close modal"
          >
            X
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Amount Card */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fund Transfer Amount</p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">
                ₹{transaction.amount?.toLocaleString()} <span className="text-sm font-normal text-slate-500">{transaction.currency || 'INR'}</span>
              </p>
            </div>
            <div className="text-right max-w-xs">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Payment Method</p>
              <span className="inline-block mt-1 px-2.5 py-1 bg-white rounded text-xs font-semibold text-slate-800 border border-slate-200">
                {transaction.method || 'TRANSFER'}
              </span>
              <p className="text-[10px] text-slate-500 mt-1">
                {(transaction.method || '').toUpperCase() === 'UPI'
                  ? 'Fast, free daily retail transfers (up to ₹1 Lakh)'
                  : (transaction.method || '').toUpperCase() === 'IMPS'
                  ? 'Immediate 24x7 interbank clearing for higher amounts'
                  : (transaction.method || '').toUpperCase() === 'NEFT'
                  ? 'National electronic batch clearing'
                  : 'Electronic banking gateway settlement'}
              </p>
            </div>
          </div>

          {/* Parties Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1.5">
                Sender (Remitter)
              </p>
              <p className="font-bold text-slate-900 text-sm">{transaction.remitter}</p>
              <p className="text-xs text-slate-500 mt-0.5 font-mono">Account: {transaction.remitterAccount || '****4592'}</p>
              <p className="text-xs text-slate-600 font-medium">Bank: {transaction.remitterBank || 'HDFC Bank'}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1.5">
                Receiver (Recipient)
              </p>
              <p className="font-bold text-slate-900 text-sm">{transaction.recipient}</p>
              <p className="text-xs text-slate-500 mt-0.5 font-mono">Account: {transaction.recipientAccount || '****8812'}</p>
              <p className="text-xs text-slate-600 font-medium">Bank: {transaction.recipientBank || 'ICICI Bank'}</p>
            </div>
          </div>

          {/* Description & Technical Gateway Metadata */}
          <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
            <div className="bg-slate-100 px-4 py-2 font-semibold text-slate-700 border-b border-slate-200 uppercase tracking-wider text-[11px]">
              Gateway Audit Log
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-500">Bank Reference ID:</span>
                <p className="font-mono font-semibold text-slate-800">{transaction.bankRefId || 'N/A'}</p>
              </div>
              <div>
                <span className="text-slate-500">Originating IP:</span>
                <p className="font-mono text-slate-800">{getOriginatingIp(transaction)}</p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500">Payment Description:</span>
                <p className="text-slate-800 font-medium">{transaction.description || 'Fund Transfer'}</p>
              </div>
              {transaction.failureReason && (
                <div className="col-span-2 bg-rose-50 p-2.5 rounded border border-rose-200 text-rose-800">
                  <span className="font-semibold">Failure Code:</span> {transaction.failureReason} (Source: {transaction.failureSource || 'BANKING'})
                </div>
              )}
            </div>
          </div>

          {/* Timeline of Lifecycle Events */}
          {transaction.timeline && transaction.timeline.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2.5">Execution Timeline</h4>
              <div className="space-y-2.5 relative pl-4 border-l-2 border-slate-200">
                {transaction.timeline.map((step, idx) => (
                  <div key={idx} className="relative text-xs">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                    <div>
                      <span className="font-semibold text-slate-800">{step.status}</span>
                      <span className="text-slate-400 ml-2 font-mono text-[11px]">({step.time})</span>
                      <p className="text-slate-600 mt-0.5">{step.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2.5 rounded-b-xl">
          <button
            onClick={() => {
              const blob = new Blob([JSON.stringify(transaction, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `transaction-${txnId}.json`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium cursor-pointer transition"
          >
            Export Log JSON
          </button>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-medium cursor-pointer transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
