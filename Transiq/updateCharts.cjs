const fs = require('fs');

let code = fs.readFileSync('src/modules/04-transactions/pages/FinancialAnalysisPage.jsx', 'utf8');

code = code.replace(
  'LineChart, Line, PieChart, Pie, Cell, Legend',
  'AreaChart, Area, PieChart, Pie, Cell, Legend'
);

const customTooltipCode = `
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

code = code.replace(
  'const PIE_COLORS = [\'#6366f1\', \'#22c55e\', \'#f59e0b\', \'#ef4444\', \'#8b5cf6\', \'#06b6d4\', \'#f43f5e\'];',
  'const PIE_COLORS = [\'#6366f1\', \'#22c55e\', \'#f59e0b\', \'#ef4444\', \'#8b5cf6\', \'#06b6d4\', \'#f43f5e\'];\n' + customTooltipCode
);

const oldBarChart = `              <BarChart data={byMonth} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(v) => \`₹\${(v / 1000).toFixed(0)}k\`} />
                <Tooltip
                  contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8 }}
                  labelStyle={{ color: '#f1f5f9' }}
                  formatter={(v, name) => [\`₹\${Number(v).toLocaleString('en-IN')}\`, name]}
                />
                <Bar dataKey="successAmount" name="Settled" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="totalAmount"   name="Total"   fill="#334155" radius={[4, 4, 0, 0]} />
              </BarChart>`;

const newBarChart = `              <BarChart data={byMonth} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSettled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0.7}/>
                  </linearGradient>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#cbd5e1" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} dx={-10}
                  tickFormatter={(v) => \`₹\${(v / 1000).toFixed(0)}k\`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }} />
                <Bar dataKey="successAmount" name="Settled" fill="url(#colorSettled)" radius={[6, 6, 0, 0]} barSize={36} />
                <Bar dataKey="totalAmount"   name="Total"   fill="url(#colorTotal)" radius={[6, 6, 0, 0]} barSize={36} />
              </BarChart>`;

code = code.replace(oldBarChart, newBarChart);

const oldLineChart = `              <LineChart data={byMonth} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8 }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Line type="monotone" dataKey="successCount" name="Success" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} />
                <Line type="monotone" dataKey="failedCount"  name="Failed"  stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} />
                <Legend wrapperStyle={{ color: '#94a3b8' }} />
              </LineChart>`;

const newAreaChart = `              <AreaChart data={byMonth} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip content={<CustomTooltip prefix="" />} />
                <Area type="monotone" dataKey="successCount" name="Success" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSuccess)" activeDot={{ r: 6, strokeWidth: 0 }} />
                <Area type="monotone" dataKey="failedCount"  name="Failed"  stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorFailed)" activeDot={{ r: 6, strokeWidth: 0 }} />
                <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 500, color: '#475569', paddingTop: '20px' }} iconType="circle" />
              </AreaChart>`;

code = code.replace(oldLineChart, newAreaChart);

const oldPie1 = `                <PieChart>
                  <Pie
                    data={byMethod}
                    dataKey="total"
                    nameKey="_id"
                    cx="50%" cy="50%"
                    outerRadius={75}
                    label={({ _id, percent }) => \`\${_id} \${(percent * 100).toFixed(0)}%\`}
                    labelLine={{ stroke: '#475569' }}
                  >
                    {byMethod.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8 }}
                    formatter={(v) => [\`₹\${Number(v).toLocaleString('en-IN')}\`, 'Volume']}
                  />
                </PieChart>`;

const newPie1 = `                <PieChart>
                  <Pie
                    data={byMethod}
                    dataKey="total"
                    nameKey="_id"
                    cx="50%" cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={4}
                    stroke="none"
                    label={false}
                  >
                    {byMethod.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} className="hover:opacity-80 transition-opacity outline-none" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip suffix=" Volume" />} />
                </PieChart>`;

code = code.replace(oldPie1, newPie1);

const oldPie2 = `                <PieChart>
                  <Pie
                    data={[
                      { name: 'Success', value: summary?.successCount || 0, color: '#22c55e' },
                      { name: 'Failed', value: summary?.failedCount || 0, color: '#ef4444' },
                      { name: 'Pending', value: summary?.pendingCount || 0, color: '#f59e0b' }
                    ].filter(d => d.value > 0)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%" cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    label={({ name, percent }) => \`\${name} \${(percent * 100).toFixed(0)}%\`}
                    labelLine={{ stroke: '#475569' }}
                  >
                    { [
                      { name: 'Success', value: summary?.successCount || 0, color: '#22c55e' },
                      { name: 'Failed', value: summary?.failedCount || 0, color: '#ef4444' },
                      { name: 'Pending', value: summary?.pendingCount || 0, color: '#f59e0b' }
                    ].filter(d => d.value > 0).map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8 }}
                    formatter={(v) => [v, 'Transactions']}
                  />
                </PieChart>`;

const newPie2 = `                <PieChart>
                  <Pie
                    data={[
                      { name: 'Success', value: summary?.successCount || 0, color: '#10b981' },
                      { name: 'Failed', value: summary?.failedCount || 0, color: '#f43f5e' },
                      { name: 'Pending', value: summary?.pendingCount || 0, color: '#f59e0b' }
                    ].filter(d => d.value > 0)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%" cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={4}
                    stroke="none"
                    label={false}
                  >
                    { [
                      { name: 'Success', value: summary?.successCount || 0, color: '#10b981' },
                      { name: 'Failed', value: summary?.failedCount || 0, color: '#f43f5e' },
                      { name: 'Pending', value: summary?.pendingCount || 0, color: '#f59e0b' }
                    ].filter(d => d.value > 0).map((entry, i) => (
                      <Cell key={i} fill={entry.color} className="hover:opacity-80 transition-opacity outline-none" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip prefix="" suffix=" txns" />} />
                </PieChart>`;

code = code.replace(oldPie2, newPie2);

fs.writeFileSync('src/modules/04-transactions/pages/FinancialAnalysisPage.jsx', code);
console.log('Upgraded visualizations in FinancialAnalysisPage');
