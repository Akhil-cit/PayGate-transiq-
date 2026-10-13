const fs = require('fs');
let code = fs.readFileSync('src/modules/04-transactions/transactions.css', 'utf8');

const cssToAdd = `
.insights-hero-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.insights-updated {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
}
`;

const searchStr = '.txn-filters {';
const idx = code.indexOf(searchStr);

if (idx > -1) {
  code = code.substring(0, idx) + cssToAdd + '\n' + code.substring(idx);
  fs.writeFileSync('src/modules/04-transactions/transactions.css', code);
  console.log('done');
} else {
  console.log('not found');
}
