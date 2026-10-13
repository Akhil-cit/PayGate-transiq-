import { useEffect } from 'react';
import { useAnalyticsStore } from '../store/analyticsStore';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, Activity,
  Download, Star, Calendar, Zap, AlertTriangle, ArrowUpRight,
  ShieldCheck, WalletCards, RefreshCw
} from 'lucide-react';

const PIE_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f43f5e'];


const CustomTooltip = ({ active, payload, label, prefix = '₹', suffix = '' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md border border-slate-100 p-4 rounded-xl shadow-xl shadow-slate-200/50 min-w-[140px]">
        {label && <p className="text-slate-500 text-[11px] uppercase tracking-wider font-bold mb-3 border-b border-slate-100 pb-2">{label}</p>}
        <div className="space-y-2">
          {payload.map((pld, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: pld.color || pld.fill }} />
                <span className="text-slate-600 text-xs font-medium">{pld.name}</span>
              </div>
              <span className="text-slate-900 font-bold text-xs">
                {prefix}{Number(pld.value).toLocaleString('en-IN')}{suffix}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function FinancialAnalysisPage() {
  const { summary, byMethod, byMonth, loading, error, fetchAll, exportCsv } =
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
          <h1 className="txn-page-title">Financial Analysis</h1>
          <p className="txn-page-sub">A clear view of your spending patterns and payment health.</p>
        </div>
        <div className="insights-hero-actions">
          <div className="insights-updated"><ShieldCheck size={14} /> Private &amp; secure</div>
          <button className="txn-btn-ghost" onClick={() => fetchAll()}><RefreshCw size={15} /> Refresh</button>
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
                <defs>
                  <linearGradient id="colorSettled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0.7}/>
                  </linearGradient>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#cbd5e1" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} dx={-10}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }} />
                <Bar dataKey="successAmount" name="Settled" fill="url(#colorSettled)" radius={[6, 6, 0, 0]} barSize={36} />
                <Bar dataKey="totalAmount"   name="Total"   fill="url(#colorTotal)" radius={[6, 6, 0, 0]} barSize={36} />
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
              <AreaChart data={byMonth} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip content={<CustomTooltip prefix="" />} />
                <Area type="monotone" dataKey="successCount" name="Success" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSuccess)" activeDot={{ r: 6, strokeWidth: 0 }} />
                <Area type="monotone" dataKey="failedCount"  name="Failed"  stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorFailed)" activeDot={{ r: 6, strokeWidth: 0 }} />
                <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 500, color: '#475569', paddingTop: '20px' }} iconType="circle" />
              </AreaChart>
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
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Success', value: summary?.successCount || 0, color: '#10b981' },
                      { name: 'Failed', value: summary?.failedCount || 0, color: '#f43f5e' },
                      { name: 'Pending', value: summary?.pendingCount || 0, color: '#f59e0b' }
                    ].filter(d => d.value > 0)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%" cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={4}
                    stroke="none"
                    label={false}
                  >
                    { [
                      { name: 'Success', value: summary?.successCount || 0, color: '#10b981' },
                      { name: 'Failed', value: summary?.failedCount || 0, color: '#f43f5e' },
                      { name: 'Pending', value: summary?.pendingCount || 0, color: '#f59e0b' }
                    ].filter(d => d.value > 0).map((entry, i) => (
                      <Cell key={i} fill={entry.color} className="hover:opacity-80 transition-opacity outline-none" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip prefix="" suffix=" txns" />} />
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

        {/* Transaction Status Breakdown */}
        <div className="analytics-chart-card">
          <h2 className="analytics-chart-title">Transaction Status</h2>
          {!summary || summary.totalCount === 0 ? (
            <div className="analytics-no-data">No data yet</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Success', value: summary?.successCount || 0, color: '#10b981' },
                      { name: 'Failed', value: summary?.failedCount || 0, color: '#f43f5e' },
                      { name: 'Pending', value: summary?.pendingCount || 0, color: '#f59e0b' }
                    ].filter(d => d.value > 0)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%" cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={4}
                    stroke="none"
                    label={false}
                  >
                    { [
                      { name: 'Success', value: summary?.successCount || 0, color: '#10b981' },
                      { name: 'Failed', value: summary?.failedCount || 0, color: '#f43f5e' },
                      { name: 'Pending', value: summary?.pendingCount || 0, color: '#f59e0b' }
                    ].filter(d => d.value > 0).map((entry, i) => (
                      <Cell key={i} fill={entry.color} className="hover:opacity-80 transition-opacity outline-none" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip prefix="" suffix=" txns" />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="analytics-method-list">
                {[
                  { name: 'Success', value: summary?.successCount || 0, color: '#22c55e' },
                  { name: 'Failed', value: summary?.failedCount || 0, color: '#ef4444' },
                  { name: 'Pending', value: summary?.pendingCount || 0, color: '#f59e0b' }
                ].filter(d => d.value > 0).map((m, i) => (
                  <div key={m.name} className="analytics-method-row">
                    <span className="analytics-method-dot" style={{ background: m.color }} />
                    <span className="analytics-method-name">{m.name}</span>
                    <span className="analytics-method-val">{m.value} txns</span>
                    <span className="analytics-method-count">{((m.value / summary.totalCount) * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </>
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
