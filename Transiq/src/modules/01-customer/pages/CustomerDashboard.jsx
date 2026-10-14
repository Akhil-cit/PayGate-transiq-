import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Lock, LockOpen, Plus, Target, Trash2, Pencil, ArrowDownToLine, ArrowUpFromLine, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCustomerStore } from '../store/useCustomerStore';
import { usePocketStore } from '../store/usePocketStore';
import { useTransactionStore } from '../../04-transactions/store/transactionStore';
import { getStoredUser } from '../../../services/api';
import { validatePocketName, validatePocketTarget, validateMoveAmount } from '../../../utils/validation';
import AuthVerificationModal from '../../../components/AuthVerificationModal';

const money = (value, currency = 'INR') => {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 2 }).format(Number(value || 0));
  } catch {
    return `${currency} ${Number(value || 0).toFixed(2)}`;
  }
};

export default function CustomerDashboard() {
  const location = useLocation();
  const isPocketsOnly = location.pathname === '/my-pockets';

  const { user: customerData, fetchMe } = useCustomerStore();
  const { items: pockets, fetchAll, create, update, deposit, withdraw, toggleLock, remove, loading, error } = usePocketStore();
  const { items: transactions, fetchAll: fetchTransactions } = useTransactionStore();
  const fallback = getStoredUser();
  const user = customerData?.user || customerData || fallback;

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', targetAmount: '' });
  const [createErrors, setCreateErrors] = useState({});
  const [amounts, setAmounts] = useState({});
  const [moveErrors, setMoveErrors] = useState({});

  // Edit modal state
  const [editingPocket, setEditingPocket] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', targetAmount: '' });
  const [editErrors, setEditErrors] = useState({});

  // Delete confirm modal state
  const [deletingPocket, setDeletingPocket] = useState(null);
  const [message, setMessage] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    fetchMe().catch(() => {});
    fetchAll();
    if (!isPocketsOnly) {
      fetchTransactions({ limit: 5 }).catch(() => {});
    }
  }, [fetchMe, fetchAll, isPocketsOnly, fetchTransactions]);

  const totalSaved = useMemo(() => pockets.reduce((sum, p) => sum + Number(p.currentAmount || 0), 0), [pockets]);
  const totalTarget = useMemo(() => pockets.reduce((sum, p) => sum + Number(p.targetAmount || 0), 0), [pockets]);
  const firstName = user?.firstName || user?.name?.split(' ')[0] || 'User';

  async function handleCreatePocket(e) {
    e.preventDefault();
    setMessage('');

    const nameErr = validatePocketName(form.name);
    const targetErr = validatePocketTarget(form.targetAmount);

    if (nameErr || targetErr) {
      setCreateErrors({ name: nameErr, targetAmount: targetErr });
      return;
    }

    setCreateErrors({});
    const result = await create({
      name: form.name.trim(),
      targetAmount: Number(form.targetAmount || 0),
    });

    if (result.success) {
      setForm({ name: '', targetAmount: '' });
      setShowCreate(false);
      setMessage('Savings pocket created successfully.');
    }
  }

  function openEditModal(pocket) {
    if (pocket.isLocked) {
      setMessage('Cannot edit a locked pocket. Unlock it first.');
      return;
    }
    setEditingPocket(pocket);
    setEditForm({ name: pocket.name, targetAmount: String(pocket.targetAmount) });
    setEditErrors({});
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    const nameErr = validatePocketName(editForm.name);
    const targetErr = validatePocketTarget(editForm.targetAmount);

    if (nameErr || targetErr) {
      setEditErrors({ name: nameErr, targetAmount: targetErr });
      return;
    }

    const result = await update(editingPocket._id, {
      name: editForm.name.trim(),
      targetAmount: Number(editForm.targetAmount || 0),
    });

    if (result.success) {
      setEditingPocket(null);
      setMessage('Pocket updated successfully.');
    }
  }

  async function handleMove(type, pocket) {
    const inputVal = amounts[pocket._id];
    const available = type === 'deposit' ? (customerData?.wallet?.mainBalance ?? 1000000) : pocket.currentAmount;
    const err = validateMoveAmount(inputVal, available, type, pocket.isLocked);

    if (err) {
      setMoveErrors((s) => ({ ...s, [pocket._id]: err }));
      return;
    }

    setMoveErrors((s) => ({ ...s, [pocket._id]: null }));
    const amount = Number(inputVal);
    const result = type === 'deposit' ? await deposit(pocket._id, amount) : await withdraw(pocket._id, amount);

    if (result.success) {
      setAmounts((s) => ({ ...s, [pocket._id]: '' }));
      fetchMe().catch(() => {});
      setMessage(
        type === 'deposit'
          ? `Successfully deposited ${money(amount)} into ${pocket.name}.`
          : `Successfully withdrawn ${money(amount)} from ${pocket.name}.`
      );
    }
  }

  async function handleConfirmDelete() {
    if (!deletingPocket) return;
    const result = await remove(deletingPocket._id);
    if (result.success) {
      fetchMe().catch(() => {});
      setMessage(`Pocket "${deletingPocket.name}" removed.`);
      setDeletingPocket(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 pr-36">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
              {isPocketsOnly ? 'Savings & Goals Management' : 'Customer Account Overview'}
            </span>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">
              {isPocketsOnly ? 'My Savings Pockets' : `Welcome back, ${firstName}`}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {isPocketsOnly
                ? 'Create, fund, and organize dedicated pockets for your financial goals.'
                : 'Manage your daily payments, bank transfers, savings pockets, and security.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ShieldCheck size={15} />
              <span>Verify DB Account</span>
            </button>
            {isPocketsOnly && (
              <button
                onClick={() => setShowCreate((v) => !v)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={15} />
                {showCreate ? 'Close Form' : 'New Pocket'}
              </button>
            )}
          </div>
        </div>

        {/* Payment Auth Verification Modal */}
        <AuthVerificationModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

        {/* Alerts */}
        {(error || message) && (
          <div
            className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between border ${
              error ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            <span>{error || message}</span>
            <button onClick={() => setMessage('')} className="text-slate-400 hover:text-slate-600">
              ✕
            </button>
          </div>
        )}

        {/* Overview Stat Cards - Show only on Dashboard */}
        {!isPocketsOnly && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total in Pockets</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Target size={18} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-2">{money(totalSaved)}</div>
                <p className="text-xs text-slate-500 mt-1">{pockets.length} active savings goal{pockets.length === 1 ? '' : 's'}</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Target Goals Sum</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Sparkles size={18} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-2">{money(totalTarget)}</div>
                <p className="text-xs text-slate-500 mt-1">Total planned target savings</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Quick Actions</span>
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <ArrowRight size={18} />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Link
                    to="/send-money"
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 !text-white hover:bg-slate-800 transition"
                    style={{ color: '#ffffff' }}
                  >
                    Send Money
                  </Link>
                  <Link
                    to="/my-wallet"
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition border border-slate-200"
                  >
                    My Wallet
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white flex flex-col sm:flex-row items-center justify-between shadow-lg">
              <div>
                <h2 className="text-2xl font-bold mb-2">Ready to explore?</h2>
                <p className="text-blue-100 text-sm max-w-md">
                  Your dashboard is fully set up. You can manage your linked bank accounts in your wallet, set aside money in savings pockets, or send funds instantly.
                </p>
              </div>
              <div className="mt-6 sm:mt-0 flex gap-3">
                <Link to="/transactions" className="px-5 py-2.5 bg-slate-900 !text-white hover:bg-slate-800 text-sm font-bold rounded-xl transition shadow-xs">
                  View History
                </Link>
                <Link to="/insights" className="px-5 py-2.5 bg-indigo-900/40 hover:bg-indigo-900/60 !text-white border border-indigo-400/30 text-sm font-bold rounded-xl transition">
                  Analytics
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Create Pocket Form */}
        {showCreate && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Create New Savings Pocket</h3>
            <form onSubmit={handleCreatePocket} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Pocket Name *</label>
                <input
                  required
                  maxLength="60"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Vacation, Laptop, Emergency"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800"
                />
                {createErrors.name && <span className="text-[11px] text-rose-600 mt-1 block">{createErrors.name}</span>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Target Amount (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={form.targetAmount}
                  onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
                  placeholder="e.g. 50000"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800"
                />
                {createErrors.targetAmount && <span className="text-[11px] text-rose-600 mt-1 block">{createErrors.targetAmount}</span>}
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  {loading ? 'Creating...' : 'Confirm Pocket'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Recent Transactions - Show only on Dashboard */}
        {!isPocketsOnly && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Recent Transactions</h2>
                <p className="text-xs text-slate-500 mt-0.5">Your latest account activity and transfers</p>
              </div>
              <Link to="/transactions" className="text-xs font-semibold px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 transition">
                View All
              </Link>
            </div>
            {transactions?.length === 0 ? (
              <div className="py-8 text-center text-slate-500">No recent transactions.</div>
            ) : (
              <div className="space-y-4">
                {transactions?.slice(0, 5).map((txn) => {
                  const isDebit = txn.type === 'debit' || txn.type === 'transfer';
                  return (
                    <div key={txn._id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition border border-transparent hover:border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDebit ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          {isDebit ? <ArrowUpFromLine size={16} /> : <ArrowDownToLine size={16} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{txn.recipientId?.name || 'Wallet Transfer'}</p>
                          <p className="text-xs text-slate-500">{new Date(txn.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${isDebit ? 'text-slate-900' : 'text-emerald-600'}`}>
                          {isDebit ? '-' : '+'}{money(txn.amount)}
                        </p>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">{txn.status}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Pockets Grid - Show only on My Pockets */}
        {isPocketsOnly && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Savings Goals & Pockets</h2>
              <p className="text-xs text-slate-500 mt-0.5">Deposit or withdraw funds anytime or lock for disciplined savings</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
              {pockets.length} Goals
            </span>
          </div>


          {pockets.length === 0 ? (
            <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Target size={32} className="mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-semibold text-slate-700">No pockets created yet</p>
              <p className="text-xs text-slate-400 mt-0.5 mb-4">Organize your goals by creating your first dedicated savings pocket.</p>
              <button
                onClick={() => setShowCreate(true)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition"
              >
                Create Pocket
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {pockets.map((p) => {
                const target = Number(p.targetAmount || 0);
                const current = Number(p.currentAmount || 0);
                const percent = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 100;

                return (
                  <div
                    key={p._id}
                    className="border border-slate-200/80 rounded-2xl p-5 bg-gradient-to-br from-white via-slate-50/50 to-slate-100/50 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900 tracking-tight">{p.name}</h3>
                          <span
                            className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border shadow-2xs ${
                              p.isLocked
                                ? 'bg-amber-500/10 text-amber-700 border-amber-300/50'
                                : 'bg-emerald-500/10 text-emerald-700 border-emerald-300/50'
                            }`}
                          >
                            {p.isLocked ? '🔒 LOCKED' : '⚡ ACTIVE'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">Goal Target: <span className="text-slate-700 font-semibold">{money(target)}</span></p>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-extrabold text-slate-900 tracking-tight">{money(current)}</span>
                        <p className="text-[11px] font-bold text-blue-600 tracking-wide mt-0.5">{percent}% Achieved</p>
                      </div>
                    </div>

                    {/* CRED / Razorpay Style Progress Meter */}
                    <div className="space-y-1">
                      <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden p-0.5">
                        <div
                          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 h-1.5 rounded-full transition-all duration-500 shadow-xs"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Deposit / Withdraw Controls */}
                    <div className="flex flex-wrap sm:flex-nowrap gap-2.5 items-center pt-2">
                      <div className="relative flex-1 min-w-[130px]">
                        <input
                          type="number"
                          min="1"
                          placeholder="Amount (₹)"
                          value={amounts[p._id] || ''}
                          onChange={(e) => setAmounts({ ...amounts, [p._id]: e.target.value })}
                          disabled={p.isLocked}
                          className="w-full px-3.5 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition placeholder:text-slate-400 placeholder:text-xs"
                        />
                      </div>
                      <button
                        onClick={() => handleMove('deposit', p)}
                        disabled={p.isLocked}
                        className="flex-shrink-0 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                      >
                        <ArrowDownToLine size={13} /> Deposit
                      </button>
                      <button
                        onClick={() => handleMove('withdraw', p)}
                        disabled={p.isLocked || current <= 0}
                        className="flex-shrink-0 px-3.5 py-2 bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                      >
                        <ArrowUpFromLine size={13} /> Withdraw
                      </button>
                    </div>
                    {moveErrors[p._id] && <p className="text-[11px] font-semibold text-rose-600">{moveErrors[p._id]}</p>}

                    {/* Footer Actions */}
                    <div className="flex justify-between items-center pt-3 border-t border-slate-200/60 text-xs text-slate-500">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleLock(p._id)}
                          className="hover:text-slate-900 inline-flex items-center gap-1 transition cursor-pointer"
                        >
                          {p.isLocked ? <Lock size={13} className="text-amber-600" /> : <LockOpen size={13} />}
                          <span>{p.isLocked ? 'Unlock' : 'Lock'}</span>
                        </button>
                        <button
                          onClick={() => openEditModal(p)}
                          disabled={p.isLocked}
                          className="hover:text-slate-900 disabled:opacity-40 inline-flex items-center gap-1 transition cursor-pointer"
                        >
                          <Pencil size={13} /> Edit
                        </button>
                      </div>
                      <button
                        onClick={() => setDeletingPocket(p)}
                        className="text-rose-600 hover:text-rose-700 inline-flex items-center gap-1 transition cursor-pointer"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        )}

        {/* Edit Modal */}
        {editingPocket && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-slate-900">Edit Pocket: {editingPocket.name}</h3>
              <form onSubmit={handleSaveEdit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Pocket Name</label>
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                  {editErrors.name && <span className="text-[11px] text-rose-600">{editErrors.name}</span>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Target Amount (₹)</label>
                  <input
                    type="number"
                    value={editForm.targetAmount}
                    onChange={(e) => setEditForm({ ...editForm, targetAmount: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                  {editErrors.targetAmount && <span className="text-[11px] text-rose-600">{editErrors.targetAmount}</span>}
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingPocket(null)}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingPocket && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl border border-slate-200 max-w-sm w-full p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-3 text-rose-600">
                <AlertCircle size={24} />
                <h3 className="text-base font-bold text-slate-900">Delete Pocket?</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to delete <strong>{deletingPocket.name}</strong>? Any remaining funds of{' '}
                <strong>{money(deletingPocket.currentAmount)}</strong> will be returned to your main wallet.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingPocket(null)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 transition"
                >
                  Delete & Return Funds
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
