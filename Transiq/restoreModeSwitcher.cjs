const fs = require('fs');

let cSidebar = fs.readFileSync('src/components/CustomerSidebar.jsx', 'utf8');
cSidebar = cSidebar.replace("import ModeSwitcher from './ModeSwitcher';\n", '');
cSidebar = cSidebar.replace(/\n\s*<ModeSwitcher \/>\n\s*<\/div>/, '\n      </div>');
fs.writeFileSync('src/components/CustomerSidebar.jsx', cSidebar);

let aSidebar = fs.readFileSync('src/components/AdminSidebar.jsx', 'utf8');
aSidebar = aSidebar.replace("import ModeSwitcher from './ModeSwitcher';\n", '');
aSidebar = aSidebar.replace(/\n\s*<ModeSwitcher \/>\n\s*<\/div>/, '\n      </div>');
fs.writeFileSync('src/components/AdminSidebar.jsx', aSidebar);

let appJsx = fs.readFileSync('src/App.jsx', 'utf8');
if (!appJsx.includes('<ModeSwitcher />')) {
  appJsx = appJsx.replace("import CustomerSidebar from './components/CustomerSidebar';", "import CustomerSidebar from './components/CustomerSidebar';\nimport ModeSwitcher from './components/ModeSwitcher';");
  appJsx = appJsx.replace('<div className="app">', '<div className="app">\n      <ModeSwitcher />');
  fs.writeFileSync('src/App.jsx', appJsx);
}

console.log('Restored ModeSwitcher to App.jsx');
