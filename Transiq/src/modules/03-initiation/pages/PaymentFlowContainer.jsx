import React, { useState, useEffect } from 'react';
import FlowPipeline from '../components/FlowPipeline';
import { formatINR } from '../utils/format';
import { getApiBaseUrl } from '../../../api/axiosInstance';

export default function PaymentFlowContainer() {
  const API_BASE = getApiBaseUrl();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Background Transaction ID Generation
  const [transactionId, setTransactionId] = useState('');
  const [createdAt, setCreatedAt] = useState('');

  // Step 1: Accounts
  const [accounts, setAccounts] = useState([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [selectedAccountId, setSelectedAccountId] = useState('');

  // Step 2: Recipients
  const [recipients, setRecipients] = useState([]);
  const [recipientsLoading, setRecipientsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRecipientId, setSelectedRecipientId] = useState('');

  // Step 3: Payment Details
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('Groceries');
  const [remarks, setRemarks] = useState('');

  // Step 5: PIN Authorization
  const [pin, setPin] = useState('');
  const [isFailed, setIsFailed] = useState(false);

  // Step 6: Final Result Transaction Object
  const [finalTransaction, setFinalTransaction] = useState(null);

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);
  const visibleRecipients = searchQuery.trim() ? searchResults : recipients;
  const selectedRecipient = recipients.concat(searchResults).find((r) => r.id === selectedRecipientId);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('paygate_token');
    return token
      ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
      : { 'Content-Type': 'application/json' };
  };

  // Background Transaction ID initialization
  const initTransaction = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`${API_BASE}/payment/initiate`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setTransactionId(data.transactionId);
        setCreatedAt(data.createdAt);
      } else {
        throw new Error('API offline');
      }
    } catch {
      const now = new Date();
      const dateStr = now.getFullYear().toString() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
      const rand = Math.floor(100000 + Math.random() * 900000);
      const newTxnId = `TXN-${dateStr}-${rand}`;
      setTransactionId(newTxnId);
      setCreatedAt(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today');
    } finally {
      setCurrentStep(1);
      setIsFailed(false);
      setFinalTransaction(null);
      setPin('');
      setLoading(false);
    }
  };

  useEffect(() => {
    initTransaction();
    fetchAccounts();
    fetchRecipients();
  }, []);

  const fetchAccounts = async () => {
    setAccountsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/accounts`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        const arr = Array.isArray(data) ? data : (data.data || []);
        const normalized = arr.map(a => ({ ...a, id: a.id || a._id }));
        setAccounts(normalized);
        if (normalized.length > 0) {
          setSelectedAccountId(normalized[0].id);
        }
      } else {
        setAccounts([]);
      }
    } catch {
      setAccounts([]);
    } finally {
      setAccountsLoading(false);
    }
  };

  const fetchRecipients = async () => {
    setRecipientsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/recipients`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        const arr = Array.isArray(data) ? data : (data.data || []);
        const normalized = arr.map(r => ({
          ...r,
          id: r.id || r._id,
          bank: r.bank || r.bankName,
          account: r.account || r.accountNumber,
          ifsc: r.ifsc || r.ifscCode,
          phone: r.phone || '',
          quickAccess: r.isFavorite ?? true,
        }));
        setRecipients(normalized);
        if (normalized.length > 0 && !selectedRecipientId) {
          setSelectedRecipientId(normalized[0].id);
        }
      } else {
        setRecipients([]);
      }
    } catch {
      setRecipients([]);
    } finally {
      setRecipientsLoading(false);
    }
  };

  const handleSearchRecipient = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/recipients/search?q=${encodeURIComponent(query)}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setSearchResults(await res.json());
        return;
      }
    } catch {}

    const q = query.toLowerCase().trim();
    const filtered = recipients.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.bank.toLowerCase().includes(q) ||
        r.account.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q)
    );
    setSearchResults(filtered);
  };

  // Step 1 Submission
  const handleAccountSubmit = () => {
    setErrorMsg('');
    if (!accounts || accounts.length === 0) {
      setErrorMsg('No verified bank account is available. Connect a bank account from My Wallet to continue.');
      return;
    }
    if (!selectedAccountId) {
      setErrorMsg('Please select a source account or wallet.');
      return;
    }
    setCurrentStep(2);
  };

  // Step 2 Submission
  const handleRecipientSubmit = () => {
    setErrorMsg('');
    if (!selectedRecipientId) {
      setErrorMsg('Please select or verify a recipient (Mobile, QR, or Directory).');
      return;
    }
    setCurrentStep(3);
  };

  // Step 3 Submission
  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const numAmt = Number(amount);

    if (!numAmt || numAmt <= 0) {
      setErrorMsg('Please enter a valid amount greater than ₹0.');
      return;
    }

    if (!selectedAccount || numAmt > selectedAccount.balance) {
      setErrorMsg(`Insufficient balance. Available balance is ${formatINR(selectedAccount?.balance || 0)}.`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/payment/validate-details`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          transactionId,
          amount,
          purpose,
          accountId: selectedAccountId,
          recipientId: selectedRecipientId,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Validation failed. Please verify amount and account balance.');
      }
      setCurrentStep(4);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 4 Submission
  const handleReviewConfirm = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await fetch(`${API_BASE}/payment/confirm`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ transactionId }),
      });
    } catch {}
    setLoading(false);
    setPin('');
    setCurrentStep(5);
  };

  // Step 5 Submission
  const handleAuthorizePin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!pin || pin.length < 4) {
      setErrorMsg('Please enter your 4-digit Security PIN.');
      return;
    }

    setLoading(true);
    let isSuccess = false;
    let failureReason = '';

    try {
      const res = await fetch(`${API_BASE}/payment/authorize-pin`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          transactionId,
          pin,
          amount,
          accountId: selectedAccountId,
          recipientId: selectedRecipientId,
          purpose,
          remarks,
        }),
      });
      const data = await res.json();
      isSuccess = data.status === 'SUCCESSFUL';
      failureReason = data.reason || '';
    } catch (networkErr) {
      isSuccess = false;
      failureReason = networkErr.message || 'Payment processing failed. Server unreachable.';
    }

    setLoading(false);

    if (isSuccess) {
      setIsFailed(false);
      setFinalTransaction({
        transactionId,
        amount: Number(amount),
        accountName: selectedAccount?.name,
        recipientName: selectedRecipient?.name,
        recipientBank: selectedRecipient?.bank,
        purpose,
        completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
      });
      setCurrentStep(6);
      fetchAccounts();
    } else {
      setIsFailed(true);
      setErrorMsg(failureReason || 'Incorrect Security PIN');
      setCurrentStep(6);
    }
  };

  const handleTryAgain = async () => {
    setPin('');
    setIsFailed(false);
    setErrorMsg('');
    try {
      const res = await fetch(`${API_BASE}/payment/retry`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ transactionId }),
      });
      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.detail || 'Retry initialization failed.');
      }
    } catch {}
    setCurrentStep(5);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Header displaying Transaction ID */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 pr-36">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">PayGate Gateway</span>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">Send Money — Payment Initiation</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Active Transaction Reference: <span className="font-mono font-bold text-blue-600">{transactionId || 'Generating...'}</span>
            </p>
          </div>
          <button
            onClick={initTransaction}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer border border-slate-200 transition"
          >
            🔄 New Transaction ID
          </button>
        </div>

        {/* Persistent 6-Step Flow Pipeline */}
        <FlowPipeline currentStep={currentStep} isFailed={isFailed} />

        {/* Global Inline Error Alert */}
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center justify-between">
            <span>⚠️ {errorMsg}</span>
            <button onClick={() => setErrorMsg('')} className="text-rose-500 font-bold ml-2">✕</button>
          </div>
        )}

        {/* DYNAMIC STEP CONTENT AREA matching FlowPipeline */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-2xs">

          {/* STEP 1: SELECT SOURCE ACCOUNT / WALLET */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
                <div>
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Step 1 of 6</span>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">Select Source Account / Wallet</h2>
                  <p className="text-xs text-slate-500">Choose the funding source for Transaction {transactionId}</p>
                </div>
                <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
                  {transactionId}
                </span>
              </div>

              {accounts.length === 0 ? (
                <div className="p-8 text-center bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-amber-800 space-y-2">
                  <p className="font-bold text-sm text-slate-900">No bank account is connected.</p>
                  <p>No verified bank account is available. Add and verify a bank account from <strong>My Wallet</strong> to continue.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {accounts.map((acc) => {
                    const isSelected = selectedAccountId === acc.id;
                    return (
                      <div
                        key={acc.id}
                        onClick={() => setSelectedAccountId(acc.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                            : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-bold text-slate-900">{acc.name}</p>
                            <p className="text-xs font-mono text-slate-500 mt-0.5">{acc.number || acc.maskedAccountNumber}</p>
                            <span className="inline-block mt-2 px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-semibold rounded uppercase">
                              {acc.bank}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-[11px] text-slate-400 font-semibold uppercase">Available Balance</p>
                            <p className="text-base font-mono font-bold text-slate-900">{formatINR(acc.balance)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  onClick={handleAccountSubmit}
                  disabled={accounts.length === 0}
                  className={`px-6 py-2.5 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs ${
                    accounts.length === 0 ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  Next: Select Recipient →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SELECT RECIPIENT */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
                <div>
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Step 2 of 6</span>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">Select Recipient</h2>
                  <p className="text-xs text-slate-500">Pick a recipient from your saved beneficiaries directory</p>
                </div>
                <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
                  {transactionId}
                </span>
              </div>

              <div className="space-y-4">
                {/* Search Directory Input */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Search Saved Beneficiaries Directory
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Search by name, bank, account number, or mobile..."
                        value={searchQuery}
                        onChange={(e) => handleSearchRecipient(e.target.value)}
                        className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => handleSearchRecipient('')}
                          className="px-3 py-2 bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {/* RECIPIENTS DISPLAY GRID */}
                  <div>
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                      {searchQuery ? `Search Results (${searchResults.length})` : 'All Saved Beneficiaries'}
                    </p>

                    {visibleRecipients.length === 0 ? (
                      <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
                        No saved recipients found matching "{searchQuery}".
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {visibleRecipients.map((rec) => {
                          const isSelected = selectedRecipientId === rec.id;
                          return (
                            <div
                              key={rec.id}
                              onClick={() => setSelectedRecipientId(rec.id)}
                              className={`p-3.5 rounded-xl border-2 cursor-pointer transition ${
                                isSelected
                                  ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                                  : 'border-slate-200 bg-white hover:border-slate-300'
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-xs font-bold text-slate-900">{rec.name}</p>
                                  <p className="text-[11px] text-slate-600 mt-0.5">{rec.bank}</p>
                                  <p className="text-[11px] font-mono text-slate-400">{rec.account}</p>
                                </div>
                                <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-mono">
                                  {rec.ifsc}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

              {/* Step 2 Bottom Navigation */}
              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-semibold"
                >
                  ← Back to Step 1
                </button>
                <button
                  onClick={handleRecipientSubmit}
                  disabled={!selectedRecipientId}
                  className={`px-5 py-2.5 rounded-lg text-xs font-semibold cursor-pointer shadow-xs ${
                    selectedRecipientId
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Next: Enter Payment Details →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ENTER PAYMENT DETAILS */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
                <div>
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Step 3 of 6</span>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">Enter Payment Details</h2>
                  <p className="text-xs text-slate-500">Specify payment amount and optional purpose or remarks</p>
                </div>
                <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
                  {transactionId}
                </span>
              </div>

              <form onSubmit={handleDetailsSubmit} className="max-w-xl mx-auto space-y-4">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-semibold">From Source Account:</span>
                    <p className="font-bold text-slate-800 mt-0.5">{selectedAccount?.name}</p>
                    <p className="font-mono text-emerald-600 font-bold">{formatINR(selectedAccount?.balance || 0)}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-semibold">To Recipient:</span>
                    <p className="font-bold text-slate-800 mt-0.5">{selectedRecipient?.name}</p>
                    <p className="text-slate-500">{selectedRecipient?.bank || 'UPI'} ({selectedRecipient?.account || selectedRecipient?.phone})</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Payment Amount (₹) *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category / Purpose (Optional)
                  </label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800 cursor-pointer"
                  >
                    {["Groceries", "Education", "Rent", "Shopping", "Personal", "Bills", "Health", "Other"].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Remarks / Note (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Monthly transfer"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800"
                  />
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-semibold"
                  >
                    ← Back to Step 2
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
                  >
                    {loading ? 'Validating...' : 'Next: Review & Confirm →'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 4: REVIEW & CONFIRM TRANSACTION */}
          {currentStep === 4 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="border-b border-slate-100 pb-4 text-center">
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Step 4 of 6</span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">Review & Confirm Transaction</h2>
                <p className="text-xs text-slate-500">
                  Verify transaction details before confirming. You can edit without losing your Transaction ID.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <span className="text-xs text-slate-500 font-semibold uppercase">Transaction ID</span>
                  <span className="font-mono font-bold text-blue-600 text-sm">{transactionId}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-slate-400 font-semibold uppercase text-[10px]">From Source Account</span>
                    <p className="font-bold text-slate-800 mt-1">{selectedAccount?.name}</p>
                    <p className="font-mono text-slate-500">{selectedAccount?.number}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold uppercase text-[10px]">To Recipient</span>
                    <p className="font-bold text-slate-800 mt-1">{selectedRecipient?.name}</p>
                    <p className="text-slate-500">{selectedRecipient?.bank} ({selectedRecipient?.account || selectedRecipient?.phone})</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Payment Amount:</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">{formatINR(Number(amount))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Purpose:</span>
                    <span className="font-semibold text-slate-800">{purpose}</span>
                  </div>
                  {remarks && (
                    <div className="flex justify-between">
                      <span>Remarks:</span>
                      <span className="italic text-slate-700">{remarks}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Transaction Fee:</span>
                    <span className="font-mono text-emerald-600 font-semibold">₹0.00 (Free)</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                    <span>Total Amount:</span>
                    <span className="font-mono text-blue-700">{formatINR(Number(amount))}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs cursor-pointer"
                >
                  ✏️ Edit Details (Keep TXN ID)
                </button>
                <button
                  onClick={handleReviewConfirm}
                  disabled={loading}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs shadow-xs cursor-pointer"
                >
                  {loading ? 'Confirming...' : 'Confirm & Proceed to PIN →'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: SECURITY PIN ENTRY */}
          {currentStep === 5 && (
            <div className="space-y-6 max-w-md mx-auto text-center py-4">
              <div>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Step 5 of 6</span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">Enter Security PIN</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Authorize transaction {transactionId} for {formatINR(Number(amount))}
                </p>
              </div>

              <form onSubmit={handleAuthorizePin} className="space-y-5 bg-slate-50 p-6 rounded-xl border border-slate-200">
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-slate-800">{selectedRecipient?.name}</p>
                  <p className="text-slate-500">{selectedRecipient?.bank}</p>
                  <p className="font-mono text-base font-bold text-blue-700 mt-1">{formatINR(Number(amount))}</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    4-Digit Security PIN
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="• • • •"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-40 text-center tracking-[0.5em] text-xl font-mono py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-slate-900 font-bold mx-auto block"
                  />
                  <p className="text-[10px] text-slate-400 mt-2 font-mono">Demo PIN: 1234</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs tracking-wide transition shadow-xs cursor-pointer"
                >
                  {loading ? 'Authorizing PIN...' : 'Verify & Authorize Payment ✓'}
                </button>
              </form>
            </div>
          )}

          {/* STEP 6: RESULT (SUCCESSFUL OR FAILED WITH TRY AGAIN) */}
          {currentStep === 6 && (
            <div className="space-y-6 max-w-lg mx-auto text-center py-6">

              {/* SUCCESS SCREEN */}
              {!isFailed ? (
                <div className="space-y-5">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold mx-auto text-3xl">
                    ✓
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Step 6 of 6</span>
                    <h2 className="text-2xl font-bold text-slate-900 mt-1">Transaction Successful</h2>
                    <p className="text-xs text-slate-500 mt-1">Your payment has been successfully completed.</p>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-left text-xs space-y-2.5">
                    <div className="flex justify-between pb-2 border-b border-slate-200">
                      <span className="text-slate-500">Transaction ID:</span>
                      <span className="font-mono font-bold text-blue-600">{transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Amount Paid:</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">{formatINR(Number(amount))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">From Source:</span>
                      <span className="font-semibold text-slate-800">{selectedAccount?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">To Recipient:</span>
                      <span className="font-semibold text-slate-800">{selectedRecipient?.name} ({selectedRecipient?.bank})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status:</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">SUCCESSFUL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Timestamp:</span>
                      <span className="font-mono text-slate-600">{finalTransaction?.completedAt || 'Today'}</span>
                    </div>
                  </div>

                  <button
                    onClick={initTransaction}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs tracking-wide transition shadow-xs cursor-pointer"
                  >
                    + Initiate Another Payment
                  </button>
                </div>
              ) : (
                /* FAILURE SCREEN */
                <div className="space-y-5">
                  <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold mx-auto text-3xl">
                    ✕
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Step 6 of 6</span>
                    <h2 className="text-2xl font-bold text-slate-900 mt-1">Transaction Failed</h2>
                    <p className="text-xs text-rose-600 font-semibold mt-1">
                      Reason: Incorrect Security PIN
                    </p>
                  </div>

                  <div className="bg-rose-50/50 p-6 rounded-xl border border-rose-200 text-left text-xs space-y-2.5">
                    <div className="flex justify-between pb-2 border-b border-rose-200">
                      <span className="text-slate-500">Retained Transaction ID:</span>
                      <span className="font-mono font-bold text-slate-900">{transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Attempted Amount:</span>
                      <span className="font-mono font-bold text-slate-900">{formatINR(Number(amount))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Target Recipient:</span>
                      <span className="font-semibold text-slate-800">{selectedRecipient?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status:</span>
                      <span className="px-2 py-0.5 bg-rose-200 text-rose-900 font-bold rounded">FAILED</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleTryAgain}
                      className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs tracking-wide transition shadow-xs cursor-pointer"
                    >
                      🔄 Try Again
                    </button>
                    <button
                      onClick={initTransaction}
                      className="py-3 px-4 bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs cursor-pointer"
                    >
                      New Payment
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
