import { useEffect } from 'react';
import { useTransactionStore } from '../store/transactionStore';
import {
  ArrowLeft, CheckCircle2, Clock, XOctagon, RotateCcw, XCircle,
  CreditCard, Building2, Smartphone, Zap, ArrowUpDown
} from 'lucide-react';

const STATUS_META = {
  success: { icon: CheckCircle2, color: '#22c55e', label: 'Success' },
  pending: { icon: Clock,        color: '#f59e0b', label: 'Pending' },
  failure: { icon: XOctagon,     color: '#ef4444', label: 'Failed'  },
  cancelled: { icon: XCircle,    color: '#64748b', label: 'Cancelled' },
};

const METHOD_META = {
  BANK_TRANSFER: { icon: Building2,   label: 'Bank Transfer' },
  CARD:          { icon: CreditCard,  label: 'Card' },
  WALLET:        { icon: ArrowUpDown, label: 'Wallet' },
  UPI:           { icon: Smartphone,  label: 'UPI' },
  NEFT:          { icon: ArrowUpDown, label: 'NEFT' },
  RTGS:          { icon: Zap,         label: 'RTGS' },
  IMPS:          { icon: Zap,         label: 'IMPS' },
};

export default function TransactionDetailPage({ txnId, onBack }) {
  const { selectedItem: txn, loading, fetchById, cancel, retry } = useTransactionStore();

  useEffect(() => {
    if (txnId) fetchById(txnId);
  }, [txnId]);

  if (loading) {
    return (
      <div className="txn-page">
        <div className="txn-loading"><div className="txn-spinner" /><span>Loading…</span></div>
      </div>
    );
  }

  if (!txn) {
    return (
      <div className="txn-page">
        <button className="txn-back-btn" onClick={onBack}><ArrowLeft size={16} /> Back</button>
        <p>Transaction not found.</p>
      </div>
    );
  }

  const status  = STATUS_META[txn.status] || STATUS_META.pending;
  const StatusIcon = status.icon;
  const method  = METHOD_META[txn.method] || {};
  const MethodIcon = method.icon || ArrowUpDown;

  const handleCancel = async () => {
    if (window.confirm('Cancel this transaction?')) {
      await cancel(txn._id);
      onBack?.();
    }
  };

  const handleRetry = async () => {
    const result = await retry(txn._id);
    if (result.success) onBack?.();
  };

  return (
    <div className="txn-page">
      <button className="txn-back-btn" onClick={onBack}>
        <ArrowLeft size={16} /> Back to transactions
      </button>

      <div className="txn-detail-grid">
        {/* Status card */}
        <div className="txn-detail-status-card" style={{ '--status-color': status.color }}>
          <StatusIcon size={48} color={status.color} />
          <h2 className="txn-detail-status-label">{status.label}</h2>
          <p className="txn-detail-ref">{txn.referenceCode}</p>
          <p className="txn-detail-amount">₹{Number(txn.amount).toLocaleString('en-IN')}</p>
          <p className="txn-detail-date">
            {txn.createdAt
              ? new Date(txn.createdAt).toLocaleString('en-IN', {
                  day: '2-digit', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })
              : '—'}
          </p>

          {txn.status === 'pending' && (
            <button className="txn-btn-danger" onClick={handleCancel}>
              <XCircle size={15} /> Cancel Transaction
            </button>
          )}
          {txn.status === 'failure' && (
            <button className="txn-btn-primary" onClick={handleRetry}>
              <RotateCcw size={15} /> Retry Transaction
            </button>
          )}
        </div>

        {/* Details */}
        <div className="txn-detail-sections">
          <section className="txn-detail-card">
            <h3>Transaction Details</h3>
            <div className="txn-detail-rows">
              <Row label="Type"        value={txn.type} />
              <Row label="Method"      value={<span className="flex items-center gap-1.5 justify-end"><MethodIcon size={14} /> {method.label || txn.method}</span>} />
              <Row label="Description" value={txn.description || '—'} />
              {txn.failureReason && (
                <Row label="Failure Reason" value={txn.failureReason} highlight />
              )}
            </div>
          </section>

          <section className="txn-detail-card">
            <h3>Recipient</h3>
            <div className="txn-detail-rows">
              <Row label="Name"           value={txn.recipientId?.name || '—'} />
              <Row label="Bank"           value={txn.recipientId?.bankName || '—'} />
              <Row label="Account"        value={txn.recipientId?.accountNumber || '—'} />
              <Row label="IFSC"           value={txn.recipientId?.ifscCode || '—'} />
              <Row label="Account Type"   value={txn.recipientId?.accountType || '—'} />
              <Row label="Reference Code" value={txn.recipientId?.referenceCode || '—'} />
            </div>
          </section>

          {txn.originalTransactionId && (
            <section className="txn-detail-card">
              <h3>Original Transaction</h3>
              <div className="txn-detail-rows">
                <Row label="ID" value={txn.originalTransactionId} mono />
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, highlight, mono }) {
  return (
    <div className="txn-detail-row">
      <span className="txn-detail-label">{label}</span>
      <strong className={`txn-detail-value ${highlight ? 'text-red-500' : ''} ${mono ? 'font-mono text-[13px]' : ''}`}>
        {value}
      </strong>
    </div>
  );
}
