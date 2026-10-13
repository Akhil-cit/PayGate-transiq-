import React, { useState } from 'react';
import { ShieldCheck, UserCheck, UserPlus, AlertCircle, ArrowRight, X, Lock } from 'lucide-react';
import { getApiBaseUrl } from '../api/axiosInstance';
import { useCustomerStore } from '../modules/01-customer/store/useCustomerStore';

export default function AuthVerificationModal({ isOpen, onClose }) {
  const API_BASE = getApiBaseUrl();
  const { fetchMe } = useCustomerStore();

  const [identifier, setIdentifier] = useState('Arjun Mehta');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [userFound, setUserFound] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);

  // Sign up form
  const [regForm, setRegForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });

  if (!isOpen) return null;

  const handleVerify = async (e) => {
    e.preventDefault();
    setStatusMsg('');
    setUserFound(null);
    setShowSignUp(false);

    if (!identifier.trim()) {
      setStatusMsg('Please enter a name, email, or phone number to verify.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/verify-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.exists) {
        setUserFound(data.data);
        setStatusMsg(data.message);
      } else {
        setShowSignUp(true);
        setStatusMsg(data.message);
        setRegForm((s) => ({
          ...s,
          firstName: identifier.trim().split(' ')[0] || '',
          email: identifier.includes('@') ? identifier.trim() : '',
          phone: /^\d+$/.test(identifier.trim()) ? identifier.trim() : '',
        }));
      }
    } catch (err) {
      setLoading(false);
      setStatusMsg('Verification request failed. Please check network connection.');
    }
  };

  const handleSelectUser = async (u) => {
    // Save user info and trigger fresh DB fetch
    localStorage.setItem(
      'paygate_user',
      JSON.stringify({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        phone: u.phone,
        role: u.role || 'customer',
      })
    );
    try {
      await fetchMe();
    } catch (_) {}
    onClose();
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setStatusMsg('');

    if (!regForm.firstName || !regForm.email || !regForm.phone || !regForm.password) {
      setStatusMsg('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: regForm.firstName.trim(),
          lastName: regForm.lastName.trim() || 'User',
          email: regForm.email.trim(),
          phone: regForm.phone.trim(),
          password: regForm.password,
          role: 'customer',
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Sign up failed.');
      }

      if (data.data?.token) {
        localStorage.setItem('paygate_token', data.data.token);
      }
      if (data.data?.user) {
        localStorage.setItem('paygate_user', JSON.stringify(data.data.user));
      }

      try {
        await fetchMe();
      } catch (_) {}
      onClose();
    } catch (err) {
      setLoading(false);
      setStatusMsg(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Payment Gateway Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">
                Payment Auth Gateway
              </div>
              <h2 className="text-base font-bold tracking-tight">Database User Verification</h2>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {!showSignUp ? (
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  User Credentials (Name, Email, or Mobile Number)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. Arjun Mehta or arjun@paygate.com"
                    className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <Lock size={15} className="absolute right-3 top-3 text-slate-400" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Verifies existence directly against MongoDB database.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Verifying database...</span>
                ) : (
                  <>
                    <span>Verify & Search DB</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Sign Up Form when user not found */
            <form onSubmit={handleSignUp} className="space-y-3">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-medium text-amber-900 flex items-center gap-2">
                <AlertCircle size={16} className="text-amber-600 shrink-0" />
                <span>User not found in DB. Complete quick registration to proceed.</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={regForm.firstName}
                    onChange={(e) => setRegForm({ ...regForm, firstName: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={regForm.lastName}
                    onChange={(e) => setRegForm({ ...regForm, lastName: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  placeholder="user@paygate.com"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  value={regForm.phone}
                  onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                  placeholder="9876543210"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={regForm.password}
                  onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                  placeholder="Min 8 characters"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowSignUp(false)}
                  className="w-1/3 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <UserPlus size={14} />
                  <span>{loading ? 'Creating...' : 'Sign Up & Continue'}</span>
                </button>
              </div>
            </form>
          )}

          {/* User Found Result */}
          {userFound && !showSignUp && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <UserCheck size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-900">
                    {userFound.firstName} {userFound.lastName}
                  </h4>
                  <p className="text-[11px] text-emerald-700 mt-0.5">{userFound.email} • {userFound.phone}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-200 text-emerald-800 rounded-full">
                    Database Verified ({userFound.role})
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectUser(userFound)}
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Authenticate & Access Wallet</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* Status Alert */}
          {statusMsg && !userFound && !showSignUp && (
            <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-center gap-2">
              <AlertCircle size={15} className="text-slate-500 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
