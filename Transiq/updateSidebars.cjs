const fs = require('fs');

function addModeSwitcher(file) {
  let code = fs.readFileSync(file, 'utf8');
  if (!code.includes('ModeSwitcher')) {
    code = code.replace("import './Sidebar.css';", "import './Sidebar.css';\nimport ModeSwitcher from './ModeSwitcher';");
    code = code.replace('<div className="sidebar-footer"></div>', '<div className="sidebar-footer">\n        <ModeSwitcher />\n      </div>');
    code = code.replace('<p className="text-xs text-slate-400"></p>\n      </div>', '<p className="text-xs text-slate-400"></p>\n        <ModeSwitcher />\n      </div>'); // For AdminSidebar
    fs.writeFileSync(file, code);
    console.log(`Updated ${file}`);
  }
}

addModeSwitcher('src/components/CustomerSidebar.jsx');
addModeSwitcher('src/components/AdminSidebar.jsx');
