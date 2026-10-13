const fs = require('fs');
let code = fs.readFileSync('src/modules/04-transactions/pages/InsightsPage.jsx', 'utf8');

const startIdx = code.indexOf('      <div className="bg-gradient-to-r');
const endIdx = code.indexOf('      {error &&');

if (startIdx > -1 && endIdx > -1) {
  code = code.substring(0, startIdx) + code.substring(endIdx);
  fs.writeFileSync('src/modules/04-transactions/pages/InsightsPage.jsx', code);
  console.log('done');
} else {
  console.log('Not found');
}
