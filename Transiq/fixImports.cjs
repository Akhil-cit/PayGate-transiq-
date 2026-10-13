const fs = require('fs');
let code = fs.readFileSync('src/modules/04-transactions/pages/FinancialAnalysisPage.jsx', 'utf8');

const badImport = `import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';`;

const goodImport = `import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';`;

code = code.replace(badImport, goodImport);

fs.writeFileSync('src/modules/04-transactions/pages/FinancialAnalysisPage.jsx', code);
console.log('Imports fixed.');
