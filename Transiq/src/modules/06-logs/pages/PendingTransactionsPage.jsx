import PendingTransactionMonitor from '../components/PendingTransactionMonitor';

const PendingTransactionsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 pr-36">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Clearing & Settlement</span>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">Pending Transactions Monitor</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time tracking of in-flight payments, clearing stages, and automated timeout thresholds
          </p>
        </div>
        <PendingTransactionMonitor showHeader={false} />
      </div>
    </div>
  );
};

export default PendingTransactionsPage;
