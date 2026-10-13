import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { getApiBaseUrl } from '../api/axiosInstance';

export default function AdminLoginPage() {
  const API_BASE = getApiBaseUrl();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: 'admin@paygate.internal', password: 'Password@123' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Admin authentication failed.');
      }

      const token = data.data?.token || data.token;
      const user = data.data?.user || data.user;

      if (token) localStorage.setItem('paygate_token', token);
      if (user) localStorage.setItem('paygate_user', JSON.stringify(user));

      navigate('/admin/monitoring');
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/25">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Operations Console</h1>
          <p className="text-xs text-slate-500">
            Restricted access portal for operations, logs monitoring, and system telemetry
          </p>
        </div>

        {/* Security Note */}
        <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-700 flex items-center gap-2">
          <ShieldCheck size={16} className="shrink-0 text-indigo-600" />
          <span>Customer accounts cannot access this administrative portal.</span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Admin Email *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@paygate.internal"
                className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
              <Mail size={16} className="absolute right-3.5 top-3 text-slate-500" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
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
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>Verifying Admin Credentials...</span>
            ) : (
              <>
                <span>Enter Admin Console</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="pt-2 text-center border-t border-slate-200">
          <Link to="/" className="text-xs text-slate-500 hover:text-slate-900 transition">
            ← Back to Customer Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
