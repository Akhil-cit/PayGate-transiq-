import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, UserPlus, Eye, EyeOff } from 'lucide-react';
import { getApiBaseUrl } from '../api/axiosInstance';
import { useCustomerStore } from '../modules/01-customer/store/useCustomerStore';

export default function LoginPage() {
  const API_BASE = getApiBaseUrl();
  const navigate = useNavigate();
  const { fetchMe } = useCustomerStore();

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: 'arjun@paygate.com',
    phone: '9876543210',
    password: 'Password@123',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isRegister ? `${API_BASE}/auth/register` : `${API_BASE}/auth/login`;
    const payload = isRegister
      ? {
          firstName: form.firstName.trim() || 'Customer',
          lastName: form.lastName.trim() || 'User',
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          password: form.password,
          role: 'customer',
        }
      : {
          email: form.email.trim().toLowerCase(),
          password: form.password,
        };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed.');
      }

      const token = data.data?.token || data.token;
      const user = data.data?.user || data.user;

      if (token) localStorage.setItem('paygate_token', token);
      if (user) localStorage.setItem('paygate_user', JSON.stringify(user));

      try {
        await fetchMe();
      } catch (_) {}

      navigate('/');
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isRegister ? 'Create Account' : 'Customer Sign In'}
          </h1>
          <p className="text-xs text-slate-500">
            {isRegister
              ? 'Enter your details to create a PayGate wallet account'
              : 'Sign in to access your wallet, pockets, and transaction history'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  placeholder="Arjun"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  placeholder="Mehta"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="arjun@paygate.com"
                className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
              <Mail size={16} className="absolute right-3.5 top-3 text-slate-500" />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="9876543210"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-2.5 text-slate-500 hover:text-slate-700 transition cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{isRegister ? 'Create Account & Sign In' : 'Sign In to Account'}</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-indigo-600 hover:underline font-semibold cursor-pointer"
          >
            {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>

          <Link to="/admin/login" className="text-slate-500 hover:text-slate-900 transition">
            Admin Console →
          </Link>
        </div>
      </div>
    </div>
  );
}
