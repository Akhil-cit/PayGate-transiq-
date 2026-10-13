const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminLoginPage.jsx', 'utf8');

code = code.replace('ShieldCheck, Lock, Mail, ArrowRight', 'ShieldCheck, Lock, Mail, ArrowRight, Eye, EyeOff');

code = code.replace(
  'const [loading, setLoading] = useState(false);',
  'const [loading, setLoading] = useState(false);\n  const [showPassword, setShowPassword] = useState(false);'
);

const oldInput = `              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
              />
              <Lock size={16} className="absolute right-3.5 top-3 text-slate-600" />`;

const newInput = `              <input
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
              </button>`;

code = code.replace(oldInput, newInput);

code = code.replace(/bg-amber-500/g, 'bg-indigo-600');
code = code.replace(/text-amber-500/g, 'text-indigo-600');
code = code.replace(/bg-amber-50/g, 'bg-indigo-50');
code = code.replace(/border-amber-200/g, 'border-indigo-200');
code = code.replace(/text-amber-700/g, 'text-indigo-700');
code = code.replace(/focus:border-amber-500/g, 'focus:border-indigo-500');
code = code.replace(/focus:ring-amber-500/g, 'focus:ring-indigo-500');
code = code.replace(/hover:bg-amber-400/g, 'hover:bg-indigo-700');
code = code.replace(/shadow-amber-500\/20/g, 'shadow-indigo-600/25');
code = code.replace(/text-slate-600/g, 'text-slate-500');

fs.writeFileSync('src/pages/AdminLoginPage.jsx', code);
console.log('AdminLoginPage updated');
