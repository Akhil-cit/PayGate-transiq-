const fs = require('fs');
let code = fs.readFileSync('src/App.css', 'utf8');

const newCSS = `
.mode-switcher {
  position: fixed;
  bottom: 24px;
  right: 24px;
  top: auto;
  z-index: 50;
  display: flex;
  gap: 4px;
  padding: 6px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 99px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.mode-button {
  border: 0;
  border-radius: 99px;
  padding: 8px 16px;
  background: transparent;
  color: #475569;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.mode-button:hover {
  background: rgba(255, 255, 255, 0.5);
  color: #1e293b;
}

.mode-button.active {
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
`;

const regex = /\.mode-switcher \{[\s\S]*?\.mode-button\.active \{[\s\S]*?\}/;
code = code.replace(regex, newCSS.trim());

fs.writeFileSync('src/App.css', code);
console.log('App.css updated');
