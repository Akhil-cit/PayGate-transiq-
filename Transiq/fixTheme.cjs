const fs = require('fs');

function processFile(path, replaceRules) {
  let code = fs.readFileSync(path, 'utf8');
  for (const [search, replace] of replaceRules) {
    code = code.replace(new RegExp(search, 'g'), replace);
  }
  fs.writeFileSync(path, code);
  console.log(`Updated ${path}`);
}

const loginRules = [
  ['bg-slate-900', 'bg-slate-50'],
  ['bg-slate-800', 'bg-white'],
  ['border-slate-700', 'border-slate-200'],
  ['text-white', 'text-slate-900'],
  ['text-slate-400', 'text-slate-500'],
  ['bg-slate-900/50', 'bg-slate-50'],
  ['text-slate-300', 'text-slate-700'],
  ['focus:ring-blue-500/50', 'focus:ring-indigo-500/20'],
  ['bg-red-500/10', 'bg-rose-50'],
  ['border-red-500/20', 'border-rose-200'],
  ['text-red-400', 'text-rose-600'],
  ['hover:bg-slate-700', 'hover:bg-slate-100'],
  ['bg-blue-600', 'bg-indigo-600'],
  ['hover:bg-blue-700', 'hover:bg-indigo-700'],
  ['text-blue-400', 'text-indigo-600'],
  ['hover:text-blue-300', 'hover:text-indigo-700'],
  ['text-slate-900 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20', 'text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20'],
  ['py-2.5 bg-indigo-600 text-slate-900 font-semibold', 'py-2.5 bg-indigo-600 text-white font-semibold']
];

processFile('src/pages/LoginPage.jsx', loginRules);

const adminRules = [
  ['bg-slate-950', 'bg-slate-50'],
  ['bg-slate-900', 'bg-white'],
  ['border-slate-800', 'border-slate-200'],
  ['text-white', 'text-slate-900'],
  ['text-slate-400', 'text-slate-500'],
  ['bg-slate-950/50', 'bg-slate-50'],
  ['text-slate-300', 'text-slate-700'],
  ['focus:ring-amber-500/50', 'focus:ring-amber-500/20'],
  ['bg-red-500/10', 'bg-rose-50'],
  ['border-red-500/20', 'border-rose-200'],
  ['text-red-400', 'text-rose-600'],
  ['bg-amber-500/10', 'bg-amber-50'],
  ['border-amber-500/30', 'border-amber-200'],
  ['text-amber-400', 'text-amber-700'],
  ['text-slate-950', 'text-white'], // Wait, if background of icon is amber-500, white icon is fine.
  ['py-2.5 bg-amber-500 text-slate-900 font-semibold', 'py-2.5 bg-amber-500 text-white font-semibold']
];

processFile('src/pages/AdminLoginPage.jsx', adminRules);
