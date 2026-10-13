import ErrorLogViewer from '../components/ErrorLogViewer';

const ErrorLogsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 pr-36">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">Exception Tracking</span>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">System Error Logs & Exceptions</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit trail for failed payments, bank connector disconnects, network timeouts, and validation errors
          </p>
        </div>
        <ErrorLogViewer showHeader={false} />
      </div>
    </div>
  );
};

export default ErrorLogsPage;
