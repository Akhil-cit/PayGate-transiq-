const fs = require('fs');
let code = fs.readFileSync('src/modules/04-transactions/pages/FinancialAnalysisPage.jsx', 'utf8');

const head = code.substring(0, code.indexOf('const CustomTooltip ='));
const tail = code.substring(code.indexOf('export default function FinancialAnalysisPage'));

const tooltip = `
const CustomTooltip = ({ active, payload, label, prefix = '₹', suffix = '' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md border border-slate-100 p-4 rounded-xl shadow-xl shadow-slate-200/50 min-w-[140px]">
        {label && <p className="text-slate-500 text-[11px] uppercase tracking-wider font-bold mb-3 border-b border-slate-100 pb-2">{label}</p>}
        <div className="space-y-2">
          {payload.map((pld, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: pld.color || pld.fill }} />
                <span className="text-slate-600 text-xs font-medium">{pld.name}</span>
              </div>
              <span className="text-slate-900 font-bold text-xs">
                {prefix}{Number(pld.value).toLocaleString('en-IN')}{suffix}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

`;

fs.writeFileSync('src/modules/04-transactions/pages/FinancialAnalysisPage.jsx', head + tooltip + tail);
console.log('Fixed CustomTooltip duplicates');
