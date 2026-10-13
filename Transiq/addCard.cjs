const fs = require('fs');
let code = fs.readFileSync('src/modules/04-transactions/pages/FinancialAnalysisPage.jsx', 'utf8');

const statusCardHtml = `
        {/* Transaction Status Breakdown */}
        <div className="analytics-chart-card">
          <h2 className="analytics-chart-title">Transaction Status</h2>
          {!summary || summary.totalCount === 0 ? (
            <div className="analytics-no-data">No data yet</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
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
                </PieChart>
              </ResponsiveContainer>
              <div className="analytics-method-list">
                {[
                  { name: 'Success', value: summary?.successCount || 0, color: '#22c55e' },
                  { name: 'Failed', value: summary?.failedCount || 0, color: '#ef4444' },
                  { name: 'Pending', value: summary?.pendingCount || 0, color: '#f59e0b' }
                ].filter(d => d.value > 0).map((m, i) => (
                  <div key={m.name} className="analytics-method-row">
                    <span className="analytics-method-dot" style={{ background: m.color }} />
                    <span className="analytics-method-name">{m.name}</span>
                    <span className="analytics-method-val">{m.value} txns</span>
                    <span className="analytics-method-count">{((m.value / summary.totalCount) * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
`;

const searchStr = '        </div>\r\n      </div>\r\n    </div>';
let idx = code.indexOf(searchStr);

if (idx === -1) {
  const unixSearchStr = '        </div>\n      </div>\n    </div>';
  idx = code.indexOf(unixSearchStr);
}

if (idx > -1) {
  code = code.substring(0, idx) + '        </div>\n' + statusCardHtml + '\n      </div>\n    </div>' + code.substring(idx + searchStr.length);
  fs.writeFileSync('src/modules/04-transactions/pages/FinancialAnalysisPage.jsx', code);
  console.log('Successfully injected Transaction Status card.');
} else {
  console.log('Could not find injection point!');
}
