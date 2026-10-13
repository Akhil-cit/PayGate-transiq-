const fs = require('fs');
let code = fs.readFileSync('src/App.css', 'utf8');

const newCSS = `
.mode-switcher {
  display: flex;
  gap: 4px;
  padding: 6px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 99px;
  margin-top: 16px;
  justify-content: center;
  width: 100%;
}

.mode-button {
  border: 0;
  border-radius: 99px;
  padding: 8px 8px;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
  font: inherit;
  font-size: 11px;
  font-weight: 600;
  transition: all 0.2s ease;
  flex: 1;
}

.mode-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #f8fafc;
}

.mode-button.active {
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
`;

const regex = /\.mode-switcher \{[\s\S]*?\.mode-button\.active \{[\s\S]*?\}/;
code = code.replace(regex, newCSS.trim());
fs.writeFileSync('src/App.css', code);
console.log('App.css updated for inline sidebar');
