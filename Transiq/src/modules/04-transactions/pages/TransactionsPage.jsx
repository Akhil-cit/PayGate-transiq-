import { useEffect, useState } from 'react';
import { useTransactionStore } from '../store/transactionStore';
import {
  Search, Filter, Download, RefreshCw, Eye, XCircle, RotateCcw,
  CheckCircle2, Clock, XOctagon, ChevronLeft, ChevronRight
} from 'lucide-react';
import TransactionDetailPage from './TransactionDetailPage';
import analyticsService from '../../../api/analyticsService';

const STATUS_COLORS = {
  success: 'txn-badge-success',
  pending: 'txn-badge-pending',
  failure: 'txn-badge-failure',
  cancelled: 'txn-badge-failure',
};

const METHOD_ICONS = {
  BANK_TRANSFER: '🏦', CARD: '💳', WALLET: '👛',
  UPI: '📱', NEFT: '🔄', RTGS: '⚡', IMPS: '🚀',
};

export default function TransactionsPage({ onSelectTxn }) {
  const { items, loading, error, total, page, pages, fetchAll, cancel, retry, clearError } =
    useTransactionStore();

  const [filters, setFilters] = useState({ status: '', type: '', method: '', dateFrom: '', dateTo: '' });
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTxnId, setSelectedTxnId] = useState(null);

  useEffect(() => {
    const params = { page: currentPage, limit: 10 };
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    fetchAll(params);
  }, [filters, currentPage]);

  if (selectedTxnId) {
    return <TransactionDetailPage txnId={selectedTxnId} onBack={() => setSelectedTxnId(null)} />;
  }

  const handleCancel = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Cancel this transaction?')) await cancel(id);
  };

  const handleRetry = async (id, e) => {
    e.stopPropagation();
    await retry(id);
  };

  const filtered = items.filter(
    (t) =>
      !search ||
      t.referenceCode?.toLowerCase().includes(search.toLowerCase()) ||
      t.recipientId?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="txn-page">
      <div className="txn-page-header">
        <div>
          <h1 className="txn-page-title">Transaction History</h1>
          <p className="txn-page-sub">{total} total transactions</p>
        </div>
        <button
          className="txn-btn-primary"
          onClick={async () => {
            try {
              const response = await analyticsService.exportCsv();
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', `transactions_${Date.now()}.csv`);
              document.body.appendChild(link);
              link.click();
              link.remove();
              window.URL.revokeObjectURL(url);
            } catch (err) {
              console.error('Failed to export CSV:', err);
            }
          }}
        >
          <Download size={15} /> Export CSV
        </button>
      </div>

      <div className="txn-filters">
        <div className="txn-search-wrap">
          <Search size={16} />
          <input
            className="txn-search"
            placeholder="Search by reference or recipient…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select className="txn-filter-sel" value={filters.status}
          onChange={(e) => { setFilters((f) => ({ ...f, status: e.target.value })); setCurrentPage(1); }}>
          <option value="">All Status</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failure">Failed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select className="txn-filter-sel" value={filters.type}
          onChange={(e) => { setFilters((f) => ({ ...f, type: e.target.value })); setCurrentPage(1); }}>
          <option value="">All Types</option>
          <option value="transfer">Transfer</option>
          <option value="topup">Top-up</option>
          <option value="refund">Refund</option>
          <option value="reversal">Reversal</option>
        </select>

        <select className="txn-filter-sel" value={filters.method}
          onChange={(e) => { setFilters((f) => ({ ...f, method: e.target.value })); setCurrentPage(1); }}>
          <option value="">All Methods</option>
          {['BANK_TRANSFER', 'CARD', 'WALLET', 'UPI', 'NEFT', 'RTGS', 'IMPS'].map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <input type="date" className="txn-filter-sel" value={filters.dateFrom}
          onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))} />
        <input type="date" className="txn-filter-sel" value={filters.dateTo}
          onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))} />

        <button className="txn-btn-ghost" onClick={() => { setFilters({ status: '', type: '', method: '', dateFrom: '', dateTo: '' }); setSearch(''); setCurrentPage(1); }}>
          <RefreshCw size={15} /> Reset
        </button>
      </div>

      {error && (
        <div className="txn-error-banner" onClick={clearError}>
          ⚠️ {error} — click to dismiss
        </div>
      )}

      <div className="txn-table-card">
        {loading ? (
          <div className="txn-loading">
            <div className="txn-spinner" />
            <span>Loading transactions…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="txn-empty">No transactions found</div>
        ) : (
          <div className="txn-table-scroll">
            <table className="txn-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Recipient</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((txn) => (
                  <tr key={txn._id} className="txn-row" onClick={() => onSelectTxn?.(txn)}>
                    <td>
                      <code className="txn-ref">{txn.referenceCode}</code>
                    </td>
                    <td>
                      <div className="txn-recipient">
                        <span className="txn-avatar">
                          {txn.recipientId?.name?.[0] || '?'}
                        </span>
                        <div>
                          <div className="txn-recipient-name">{txn.recipientId?.name || '—'}</div>
                          <div className="txn-recipient-bank">{txn.recipientId?.bankName || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="txn-amount">
                      ₹{Number(txn.amount).toLocaleString('en-IN')}
                    </td>
                    <td>
                      <span className="txn-method">
                        {METHOD_ICONS[txn.method] || ''} {txn.method}
                      </span>
                    </td>
                    <td>
                      <span className="txn-type-badge">{txn.type}</span>
                    </td>
                    <td>
                      <span className={`txn-badge ${STATUS_COLORS[txn.status] || ''}`}>
                        {txn.status === 'success' && <CheckCircle2 size={12} />}
                        {txn.status === 'pending' && <Clock size={12} />}
                        {txn.status === 'failure' && <XOctagon size={12} />}
                        {txn.status}
                      </span>
                    </td>
                    <td className="txn-date">
                      {txn.createdAt
                        ? new Date(txn.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td>
                      <div className="txn-actions">
                        <button className="txn-action-btn view" title="View details"
                          onClick={(e) => { e.stopPropagation(); onSelectTxn ? onSelectTxn(txn) : setSelectedTxnId(txn._id); }}>
                          <Eye size={14} />
                        </button>
                        {txn.status === 'pending' && (
                          <button className="txn-action-btn cancel" title="Cancel"
                            onClick={(e) => handleCancel(txn._id, e)}>
                            <XCircle size={14} />
                          </button>
                        )}
                        {txn.status === 'failure' && (
                          <button className="txn-action-btn retry" title="Retry"
                            onClick={(e) => handleRetry(txn._id, e)}>
                            <RotateCcw size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pages > 1 && (
          <div className="txn-pagination">
            <button
              className="txn-page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}>
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`txn-page-btn ${p === currentPage ? 'active' : ''}`}
                onClick={() => setCurrentPage(p)}>
                {p}
              </button>
            ))}
            <button
              className="txn-page-btn"
              disabled={currentPage === pages}
              onClick={() => setCurrentPage((p) => p + 1)}>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
