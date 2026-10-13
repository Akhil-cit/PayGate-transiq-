import { useEffect } from 'react';
import { useAnalyticsStore } from '../store/analyticsStore';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, Activity,
  Download, Star, Calendar, Zap, AlertTriangle, ArrowUpRight,
  ShieldCheck, WalletCards, RefreshCw
} from 'lucide-react';

const PIE_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f43f5e'];

export default function AnalyticsPage() {
  const { summary, byMethod, byMonth, insights, loading, error, fetchAll, exportCsv } =
    useAnalyticsStore();

  useEffect(() => { fetchAll(); }, []);

  if (loading && !summary) {
    return (
      <div className="txn-page">
        <div className="txn-loading"><div className="txn-spinner" /><span>Loading analytics…</span></div>
      </div>
    );
  }

  const successRate = summary
    ? summary.totalCount > 0
      ? ((summary.successCount / summary.totalCount) * 100).toFixed(1)
      : '0.0'
    : '—';

  return (
    <div className="txn-page insights-page">
      <div className="txn-page-header">
        <div>
          <h1 className="txn-page-title">Financial Analysis & Insights</h1>
          <p className="txn-page-sub">A clear view of your spending patterns and payment health.</p>
        </div>
        <div className="insights-hero-actions">
          <div className="insights-updated"><ShieldCheck size={14} /> Private &amp; secure</div>
          <button className="txn-btn-secondary" onClick={() => fetchAll()}><RefreshCw size={15} /> Refresh</button>
          <button className="txn-btn-primary" onClick={exportCsv}><Download size={15} /> Export CSV</button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-900 via-indigo-700 to-indigo-500 rounded-2xl p-6 text-white grid grid-cols-1 md:grid-cols-3 gap-6 shadow-lg mb-6">
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-indigo-200 mb-2">TOTAL MOVEMENT</span>
          <strong className="block text-3xl font-extrabold mb-1">₹{Number(summary?.totalSent || 0).toLocaleString('en-IN')}</strong>
          <small className="block text-xs text-indigo-200 font-medium">across {summary?.totalCount || 0} transactions</small>
        </div>
        <div className="md:border-l md:border-indigo-500/50 md:pl-6">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-indigo-200 mb-2">Payment health</span>
          <strong className="flex items-center gap-1 text-3xl font-extrabold mb-1">
            {successRate}% <ArrowUpRight size={24} className="text-emerald-400" />
          </strong>
          <small className="block text-xs text-indigo-200 font-medium">successful payments</small>
        </div>
        <div className="md:border-l md:border-indigo-500/50 md:pl-6">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-indigo-200 mb-2">Average payment</span>
          <strong className="block text-3xl font-extrabold mb-1">₹{Number(summary?.avgAmount || 0).toLocaleString('en-IN')}</strong>
          <small className="block text-xs text-indigo-200 font-medium">per transaction</small>
        </div>
      </div>

      {error && <div className="txn-error-banner">⚠️ {error}</div>}

      {/* Summary KPI Cards */}
      <div className="analytics-kpi-grid">
        <KPICard
          icon={DollarSign} color="#6366f1"
          label="Total Sent" value={`₹${Number(summary?.totalSent || 0).toLocaleString('en-IN')}`}
        />
        <KPICard
          icon={Activity} color="#22c55e"
          label="Success Rate" value={`${successRate}%`}
        />
        <KPICard
          icon={TrendingUp} color="#06b6d4"
          label="Successful Transactions" value={summary?.successCount || 0}
        />
        <KPICard
          icon={TrendingDown} color="#ef4444"
          label="Failed Transactions" value={summary?.failedCount || 0}
        />
        <KPICard
          icon={Zap} color="#f59e0b"
          label="Pending" value={summary?.pendingCount || 0}
        />
        <KPICard
          icon={DollarSign} color="#8b5cf6"
          label="Average Transaction" value={`₹${Number(summary?.avgAmount || 0).toLocaleString('en-IN')}`}
        />
        <KPICard
          icon={TrendingUp} color="#22c55e"
          label="Highest Transaction" value={`₹${Number(summary?.highestAmount || 0).toLocaleString('en-IN')}`}
        />
        <KPICard
          icon={TrendingDown} color="#64748b"
          label="Total Transactions" value={summary?.totalCount || 0}
        />
      </div>

      {/* Charts Row */}
      <div className="analytics-charts-grid">
        {/* Monthly Volume Chart */}
        <div className="analytics-chart-card">
          <h2 className="analytics-chart-title">Monthly Transaction Volume</h2>
          {byMonth.length === 0 ? (
            <div className="analytics-no-data">No data yet — make some transactions!</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={byMonth} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8 }}
                  labelStyle={{ color: '#f1f5f9' }}
                  formatter={(v, name) => [`₹${Number(v).toLocaleString('en-IN')}`, name]}
                />
                <Bar dataKey="successAmount" name="Settled" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="totalAmount"   name="Total"   fill="#334155" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Monthly Count Line Chart */}
        <div className="analytics-chart-card">
          <h2 className="analytics-chart-title">Monthly Transaction Count</h2>
          {byMonth.length === 0 ? (
            <div className="analytics-no-data">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={byMonth} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8 }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Line type="monotone" dataKey="successCount" name="Success" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} />
                <Line type="monotone" dataKey="failedCount"  name="Failed"  stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} />
                <Legend wrapperStyle={{ color: '#94a3b8' }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Method Breakdown + Insights */}
      <div className="analytics-bottom-grid">
        {/* Payment Method Breakdown */}
        <div className="analytics-chart-card">
          <h2 className="analytics-chart-title">By Payment Method</h2>
          {byMethod.length === 0 ? (
            <div className="analytics-no-data">No data yet</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={byMethod}
                    dataKey="total"
                    nameKey="_id"
                    cx="50%" cy="50%"
                    outerRadius={90}
                    label={({ _id, percent }) => `${_id} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: '#475569' }}
                  >
                    {byMethod.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8 }}
                    formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Volume']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="analytics-method-list">
                {byMethod.map((m, i) => (
                  <div key={m._id} className="analytics-method-row">
                    <span className="analytics-method-dot" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="analytics-method-name">{m._id}</span>
                    <span className="analytics-method-val">₹{Number(m.total).toLocaleString('en-IN')}</span>
                    <span className="analytics-method-count">{m.count} txns</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Insights Panel */}
        <div className="analytics-insights-card">
          <h2 className="analytics-chart-title">Key Insights</h2>
          {!insights ? (
            <div className="analytics-no-data">No insights yet</div>
          ) : (
            <div className="analytics-insights-list">
              {insights.topRecipient && (
                <InsightItem
                  icon={Star} color="#f59e0b"
                  title="Top Recipient"
                  detail={insights.topRecipient.name}
                  sub={`₹${Number(insights.topRecipient.totalSent).toLocaleString('en-IN')} across ${insights.topRecipient.count} transactions`}
                />
              )}
              {insights.peakSpendDay && (
                <InsightItem
                  icon={Calendar} color="#6366f1"
                  title="Peak Spend Day"
                  detail={insights.peakSpendDay.day}
                  sub={`₹${Number(insights.peakSpendDay.total).toLocaleString('en-IN')} — ${insights.peakSpendDay.count} transactions`}
                />
              )}
              {insights.highestTxn && (
                <InsightItem
                  icon={Zap} color="#22c55e"
                  title="Largest Transaction"
                  detail={`₹${Number(insights.highestTxn.amount).toLocaleString('en-IN')}`}
                  sub={`To ${insights.highestTxn.recipient} · ${insights.highestTxn.referenceCode}`}
                />
              )}
              {insights.unusualActivity && (
                <InsightItem
                  icon={AlertTriangle} color="#ef4444"
                  title="Unusual Activity"
                  detail={`${insights.unusualActivity.count} transactions`}
                  sub={`Above 2× average (₹${Number(insights.unusualActivity.avgThreshold).toLocaleString('en-IN')})`}
                  warning={insights.unusualActivity.count > 0}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KPICard({ icon: Icon, label, value, color }) {
  return (
    <div className="analytics-kpi-card">
      <div className="analytics-kpi-icon" style={{ '--kpi-color': color }}>
        <Icon size={20} color={color} />
      </div>
      <div>
        <p className="analytics-kpi-label">{label}</p>
        <p className="analytics-kpi-value">{value}</p>
      </div>
    </div>
  );
}

function InsightItem({ icon: Icon, color, title, detail, sub, warning }) {
  return (
    <div className={`analytics-insight-item ${warning ? 'analytics-insight-warning' : ''}`}>
      <div className="analytics-insight-icon" style={{ '--insight-color': color }}>
        <Icon size={18} color={color} />
      </div>
      <div>
        <p className="analytics-insight-title">{title}</p>
        <p className="analytics-insight-detail">{detail}</p>
        <p className="analytics-insight-sub">{sub}</p>
      </div>
    </div>
  );
}
