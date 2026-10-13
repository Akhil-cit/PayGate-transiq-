import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import customerRoutes from './routes/customers.js';
import walletRoutes from './routes/wallets.js';
import pocketRoutes from './routes/pockets.js';
import recipientRoutes from './routes/recipients.js';
import transactionRoutes from './routes/transactions.js';
import analyticsRoutes from './routes/analytics.js';
import securityRoutes from './routes/security.js';
import paymentRoutes from './routes/payment.js';
import accountRoutes from './routes/accounts.js';
import bankRoutes from './routes/bank.js';

const app = express();

// ── DB Connection ─────────────────────────────────────────────────────────────
connectDB();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get('/', (req, res) => res.send('<h1>PayGate API Backend is Running 🚀</h1><p>Access <a href="/api/health">/api/health</a> for server status.</p>'));

// ── Real System Health & Telemetry ─────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  const start = Date.now();
  let dbStatus = 'Disconnected';
  let dbPingMs = null;

  try {
    if (mongoose.connection.readyState === 1) {
      dbStatus = 'Connected';
      const pingStart = Date.now();
      await mongoose.connection.db.admin().ping();
      dbPingMs = Date.now() - pingStart;
    }
  } catch (err) {
    dbStatus = 'Error: ' + err.message;
  }

  const memoryUsageMB = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
  const uptimeSeconds = Math.floor(process.uptime());
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = uptimeSeconds % 60;
  const uptimeStr = `${hours}h ${minutes}m ${seconds}s`;

  res.json({
    success: true,
    data: {
      status: dbStatus === 'Connected' ? 'Operational' : 'Degraded',
      database: dbStatus,
      dbPingMs: dbPingMs !== null ? `${dbPingMs} ms` : 'N/A',
      serverLatency: `${Date.now() - start} ms`,
      memoryHeapUsed: `${memoryUsageMB} MB`,
      uptime: uptimeStr,
      nodeVersion: process.version,
    },
    timestamp: new Date(),
  });
});

// ── Routes — Unified Modules ──────────────────────────────────────────────────
app.use('/api/auth', authRoutes); // Auth (All modules)
app.use('/api/admin', adminRoutes); // Module 6 — Admin Logs & Monitoring
app.use('/api/customers', customerRoutes); // Module 1 — Customer Profile & Dashboard
app.use('/api/wallets', walletRoutes); // Module 1 — Wallet
app.use('/api/pockets', pocketRoutes); // Module 1 — Savings Pockets
app.use('/api/recipients', recipientRoutes); // Module 2 — Recipients / Participants
app.use('/api/transactions', transactionRoutes); // Module 4 — Transactions
app.use('/api/analytics', analyticsRoutes); // Module 4 — Financial Analysis & Insights
app.use('/api/security', securityRoutes); // Module 5 — Security
app.use('/api/payment', paymentRoutes); // Module 3 — Send Money Initiation Flow
app.use('/api/accounts', accountRoutes); // Module 3 — Accounts
app.use('/api/bank', bankRoutes); // Module 3 — Bank Integration
app.use('/api/wallet', bankRoutes); // Module 3 — /api/wallet/accounts/...

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
export { app };
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => console.log(`🚀 PayGate / Transiq Unified API running on http://localhost:${PORT}`));
}
