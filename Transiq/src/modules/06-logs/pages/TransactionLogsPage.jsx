import LogViewer from '../components/LogViewer';

const TransactionLogsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 pr-36">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Audit Stream</span>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">Transaction Logs Stream</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Inspect raw event payloads, bank authorization references, and lifecycle execution timestamps
          </p>
        </div>
        <LogViewer />
      </div>
    </div>
  );
};

export default TransactionLogsPage;
