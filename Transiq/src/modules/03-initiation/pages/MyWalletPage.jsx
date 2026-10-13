import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatINR } from '../utils/format';
import { getApiBaseUrl } from '../../../api/axiosInstance';
import { validateAccountNumber, validatePhone } from '../../../utils/validation';

export default function MyWalletPage() {
  const API_BASE = getApiBaseUrl();
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [dummyAccounts, setDummyAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Add Bank Account Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addStep, setAddStep] = useState(1); // 1 = Enter details, 2 = Enter OTP
  const [accountNumber, setAccountNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [otpNotification, setOtpNotification] = useState('');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('paygate_token');
    return token
      ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
      : { 'Content-Type': 'application/json' };
  };

  useEffect(() => {
    fetchConnectedAccounts();
    fetchDummyAccounts();
  }, []);

  useEffect(() => {
    if (!otpNotification) return undefined;
    const timeoutId = setTimeout(() => setOtpNotification(''), 8000);
    return () => clearTimeout(timeoutId);
  }, [otpNotification]);

  const fetchConnectedAccounts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/accounts`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setConnectedAccounts(Array.isArray(data) ? data : []);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const fetchDummyAccounts = async () => {
    try {
      const res = await fetch(`${API_BASE}/bank/dummy-accounts`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setDummyAccounts(Array.isArray(data) ? data : []);
      }
    } catch {}
  };

  // Step 1: Send OTP to associated phone number
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const accErr = validateAccountNumber(accountNumber);
    if (accErr) {
      setErrorMsg(accErr);
      return;
    }
    const phoneErr = validatePhone(phoneNumber);
    if (phoneErr) {
      setErrorMsg(phoneErr);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/wallet/accounts/add`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          accountNumber: accountNumber.trim(),
          phone: phoneNumber.trim(),
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      const data = contentType.includes('application/json') ? await res.json() : {};

      if (!res.ok) {
        throw new Error(data.message || data.detail || 'Failed to send OTP.');
      }

      setVerificationCode(data.verificationCode || '123456');
      setAddStep(2);
      setOtpNotification(data.verificationCode || '123456');
      setSuccessMsg(`A verification code has been sent to ${phoneNumber}.`);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Connect Account
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setErrorMsg('Please enter the 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/wallet/accounts/verify-otp`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          accountNumber: accountNumber.trim(),
          phone: phoneNumber.trim(),
          otp: otpCode.trim(),
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      const data = contentType.includes('application/json') ? await res.json() : {};

      if (!res.ok) {
        throw new Error(data.message || data.detail || 'Incorrect OTP. Please try again.');
      }

      setSuccessMsg('Bank account verified and connected successfully!');
      setShowAddModal(false);
      setAddStep(1);
      setAccountNumber('');
      setPhoneNumber('');
      setOtpCode('');
      setVerificationCode('');
      fetchConnectedAccounts();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Select an available account to fill the form
  const fillDummyDetails = (acc) => {
    setAccountNumber(acc.accountNumber);
    setPhoneNumber(acc.associatedPhoneNumber);
    setErrorMsg('');
  };

  // Separate accounts into Main Wallet, actual Bank Accounts, and Savings Pockets
  const mainWallet = connectedAccounts.find((a) => a.type === 'WALLET') || {
    id: 'WALLET_PRIMARY',
    name: 'Main Wallet',
    balance: 0,
    number: 'MW-PRIMARY',
    isVerified: true,
    status: 'ACTIVE',
  };

  const bankAccounts = connectedAccounts.filter((a) => a.type !== 'POCKET' && a.type !== 'WALLET');
  const pockets = connectedAccounts.filter((a) => a.type === 'POCKET');

  const totalBankBalance = bankAccounts.reduce((sum, a) => sum + (a.balance || 0), 0);
  const totalCombinedBalance = (mainWallet.balance || 0) + totalBankBalance;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 pr-36">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">PayGate Gateway — Account Management</span>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">My Wallet & Connected Bank Accounts</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage your PayGate digital wallet, linked bank accounts, and balance allocations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/send-money"
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition"
            >
              Send Money →
            </Link>
            <button
              onClick={() => {
                setShowAddModal(true);
                setAddStep(1);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition"
            >
              + Add Bank Account
            </button>
          </div>
        </div>

        {otpNotification && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[120] w-[calc(100%-2rem)] max-w-md rounded-xl border border-blue-200 bg-white px-5 py-4 text-center shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Phone verification code</p>
            <p className="mt-1 text-2xl font-bold tracking-[0.3em] text-slate-900">{otpNotification}</p>
            <p className="mt-1 text-xs text-slate-500">Enter this code to verify your bank account.</p>
            <button
              type="button"
              onClick={() => setOtpNotification('')}
              className="absolute right-3 top-2 text-slate-400 hover:text-slate-700"
              aria-label="Dismiss verification code notification"
            >
              ✕
            </button>
          </div>
        )}

        {/* Global Success / Error Toast Banners */}
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex justify-between items-center">
            <span>✓ {successMsg}</span>
            <button onClick={() => setSuccessMsg('')} className="text-emerald-600 font-bold ml-2">✕</button>
          </div>
        )}

        {errorMsg && !showAddModal && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex justify-between items-center">
            <span>⚠️ {errorMsg}</span>
            <button onClick={() => setErrorMsg('')} className="text-rose-500 font-bold ml-2">✕</button>
          </div>
        )}

        {/* Persistent Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Main Wallet Balance</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{formatINR(mainWallet.balance || 0)}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Primary digital funds</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">Connected Bank Balance</p>
            <p className="text-2xl font-bold text-emerald-600 mt-2">{formatINR(totalBankBalance)}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{bankAccounts.length} Verified bank accounts</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">Total Available Liquidity</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {formatINR(totalCombinedBalance)}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Ready for instant transfer</p>
          </div>
        </div>

        {/* SECTION 1: PAYGATE DIGITAL WALLET HERO CARD */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-7 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                Primary Account
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-1">PayGate Digital Wallet</h2>
              <p className="text-xs text-slate-500">
                Central wallet for peer-to-peer transfers, merchant checkouts, and instant withdrawals
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-md border border-emerald-200">
                ✓ Active & Verified
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white rounded-xl p-6 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Wallet Balance</p>
              <p className="text-3xl font-mono font-bold text-white tracking-tight">{formatINR(mainWallet.balance || 0)}</p>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Account ID: <span className="text-slate-200">{mainWallet.number || 'MW-PRIMARY'}</span>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/send-money"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold border border-white/20 transition flex items-center gap-1.5"
              >
                ↗ Send Money
              </Link>
              <Link
                to="/transactions"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold border border-white/20 transition"
              >
                Passbook
              </Link>
            </div>
          </div>
        </div>

        {/* SECTION 2: CONNECTED BANK ACCOUNTS */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-slate-900">Connected Bank Accounts</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                External bank accounts linked to your PayGate identity for direct deposits and settlements
              </p>
            </div>
            {bankAccounts.length > 0 && (
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md border border-emerald-200">
                {bankAccounts.length} Connected
              </span>
            )}
          </div>

          {bankAccounts.length === 0 ? (
            <div className="p-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">No external bank account is connected</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Add and verify a partner bank account (HDFC, ICICI, SBI) to enable direct NEFT/RTGS banking.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(true);
                  setAddStep(1);
                  setErrorMsg('');
                }}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
              >
                + Add & Verify Bank Account
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bankAccounts.map((acc) => (
                <div
                  key={acc.id || acc.accountNumber}
                  className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition shadow-2xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold text-slate-900">{acc.name || acc.accountHolderName}</p>
                        <p className="text-xs font-mono font-semibold text-slate-500 mt-0.5">
                          {acc.maskedAccountNumber || acc.number || acc.accountNumber}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-200">
                        ✓ Verified
                      </span>
                    </div>
                    <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded uppercase border border-slate-200">
                      {acc.bank || 'Partner Bank'} • {acc.type || 'SAVINGS'}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Available Balance</p>
                      <p className="text-base font-mono font-bold text-slate-900 mt-0.5">{formatINR(acc.balance || 0)}</p>
                    </div>
                    
                  </div>
                </div>
              ))}

              {/* Add New Account Card */}
              <div
                onClick={() => {
                  setShowAddModal(true);
                  setAddStep(1);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="p-5 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 hover:bg-blue-50/40 hover:border-blue-400 transition cursor-pointer flex flex-col items-center justify-center text-center space-y-2 min-h-[140px]"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl">
                  +
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Add New Bank Account</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Link partner account via OTP verification</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: SAVINGS POCKETS OVERVIEW */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">My Savings Pockets</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Targeted savings envelopes separated from your transactional wallet balance
              </p>
            </div>
            <Link
              to="/my-pockets"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Open Pockets Console →
            </Link>
          </div>

          {pockets.length === 0 ? (
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <p className="text-xs text-slate-600">No savings pockets created yet.</p>
              <Link
                to="/my-pockets"
                className="inline-block mt-2 text-xs font-bold text-blue-600 hover:underline"
              >
                Create your first savings pocket in My Pockets →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pockets.map((pkt) => (
                <div key={pkt.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{pkt.name.replace(' (Pocket)', '')}</p>
                      <p className="text-[10px] text-slate-500 uppercase mt-0.5">{pkt.number || 'POCKET'}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      pkt.status === 'LOCKED' ? 'bg-amber-100 text-amber-800' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {pkt.status === 'LOCKED' ? '🔒 Locked' : 'Active'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-semibold">Current Savings</span>
                    <p className="text-lg font-mono font-bold text-slate-900">{formatINR(pkt.balance || 0)}</p>
                  </div>
                  <Link
                    to="/my-pockets"
                    className="block text-center py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-[11px] font-semibold border border-slate-200 transition"
                  >
                    View in My Pockets →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ADD BANK ACCOUNT MODAL (2-STEP OTP FLOW) */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-5">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  {addStep === 1 ? 'Add Bank Account' : 'Verify Phone OTP'}
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium">
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* STEP 1: Enter Bank Account Details */}
              {addStep === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <p className="text-xs text-slate-500">
                    Enter your bank account number and registered phone number to receive a 6-digit verification code.
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Bank Account Number *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BANK10001"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 font-mono font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Associated Phone Number *
                    </label>
                    <div className="flex items-stretch bg-white border border-slate-300 rounded-lg focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 overflow-hidden transition-all">
                      <div className="flex items-center justify-center pl-3 pr-2 border-r border-slate-200 bg-slate-50">
                        <span className="text-xs font-semibold text-slate-500">+91</span>
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. 9876543210"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-3 py-2.5 text-xs bg-transparent focus:outline-none text-slate-900 font-medium"
                      />
                    </div>
                  </div>

                  {/* Available bank accounts */}
                  {dummyAccounts.length > 0 && (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Quick Autofill from Partner Banks:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {dummyAccounts.map((d) => (
                          <button
                            key={d.accountNumber}
                            type="button"
                            onClick={() => fillDummyDetails(d)}
                            className="px-2 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 border border-slate-200 rounded text-[11px] font-medium text-slate-700 transition"
                          >
                            {d.bankName} ({d.accountNumber})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                    >
                      {loading ? 'Processing...' : 'Send Verification OTP →'}
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: Enter OTP Code */}
              {addStep === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="bg-blue-50/70 p-3.5 rounded-lg border border-blue-200 text-xs text-blue-900 space-y-1">
                    <p className="font-bold">A 6-digit code has been sent</p>
                    <p className="text-blue-700">Phone: +91 {phoneNumber} | Account: {accountNumber}</p>
                    {verificationCode && (
                      <p className="text-[11px] text-blue-600 font-mono mt-1">
                        Demo OTP: <strong className="underline">{verificationCode}</strong>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
                      Enter 6-Digit OTP Code *
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="• • • • • •"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-48 text-center tracking-[0.4em] text-xl font-mono py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-slate-900 font-bold mx-auto block"
                    />
                  </div>

                  <div className="flex justify-between pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setAddStep(1)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-semibold"
                    >
                      ← Change Details
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
                    >
                      {loading ? 'Verifying...' : 'Verify OTP & Connect ✓'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        </div>
    </div>
  );
}
