import PaymentHistory from '../components/PaymentHistory';

const TransactionHistory = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 pr-36">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Audit Trail & Settlements</span>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">Payment History & Settlement Records</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete historical record of all transactions, settlement statuses, and failure codes
          </p>
        </div>
        <PaymentHistory showHeader={false} />
      </div>
    </div>
  );
};

export default TransactionHistory;
