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

export default function InsightsPage() {
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
          <h1 className="txn-page-title">Smart Insights</h1>
          <p className="txn-page-sub">AI-driven insights and key metrics about your spending behavior.</p>
        </div>
        <div className="insights-hero-actions">
          <div className="insights-updated"><ShieldCheck size={14} /> Private &amp; secure</div>
          <button className="txn-btn-ghost" onClick={() => fetchAll()}><RefreshCw size={15} /> Refresh</button>
          <button className="txn-btn-primary" onClick={exportCsv}><Download size={15} /> Export CSV</button>
        </div>
      </div>

      {error && <div className="txn-error-banner">⚠️ {error}</div>}

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
