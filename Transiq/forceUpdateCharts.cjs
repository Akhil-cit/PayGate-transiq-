const fs = require('fs');
let code = fs.readFileSync('src/modules/04-transactions/pages/FinancialAnalysisPage.jsx', 'utf8');

const updatedCode = code
  .replace(/<BarChart[\s\S]*?<\/BarChart>/m, `<BarChart data={byMonth} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
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
              </BarChart>`)
  .replace(/<LineChart[\s\S]*?<\/LineChart>/m, `<AreaChart data={byMonth} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
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
              </AreaChart>`);

const pie1Replace = `<PieChart>
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

const pie2Replace = `<PieChart>
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

let finalCode = updatedCode.replace(/<PieChart>[\s\S]*?<\/PieChart>/m, pie1Replace);
finalCode = finalCode.replace(/<PieChart>[\s\S]*?<\/PieChart>/m, pie2Replace);

fs.writeFileSync('src/modules/04-transactions/pages/FinancialAnalysisPage.jsx', finalCode);
console.log('Successfully replaced ALL charts in FinancialAnalysisPage via script file');
