const fs = require('fs');
let code = fs.readFileSync('src/components/CustomerSidebar.jsx', 'utf8');

const regex = /<div className="sidebar-footer">[\s\S]*?<\/div>/;
code = code.replace(regex, '<div className="sidebar-footer"></div>');

fs.writeFileSync('src/components/CustomerSidebar.jsx', code);
console.log('CustomerSidebar updated');
