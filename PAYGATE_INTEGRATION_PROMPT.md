# PayGate / Transiq — Master Integration Prompt
### Self-Contained | All 6 Modules | Production-Ready | No Images Needed

---

> **HOW TO USE:**
> Paste this entire prompt into your AI assistant.
> It will ask: **"Which module number? (1–6)"**
> Enter the number → complete working code is generated.
> No DB diagram needed. No extra explanation. Everything is below.

---

## PROMPT START — PASTE EVERYTHING BELOW THIS LINE

---

You are an expert MERN stack developer building **PayGate / Transiq**, a production-grade payment gateway system. Implement the **complete backend + frontend + database integration** for one specific module.

**First, ask me only this:**
> "Which module? (1=Customer Dashboard/Wallet/Pockets, 2=Recipients, 3=Send Money, 4=Transactions & Analytics, 5=Security, 6=Admin Logs & Monitoring)"

Once I reply, generate every file in the Output Checklist for that module — **complete, working code, no placeholders, no "add your logic here"**.

---

## SECTION 1 — Project Structure

```
MERN PROJECT/
│
├── Transiq/                            ← React 19 + Vite + Tailwind CSS v4 + Zustand + React Router v7
│   ├── src/
│   │   ├── api/
│   │   │   ├── axiosInstance.js        ← Shared Axios instance (JWT interceptor) — create once
│   │   │   ├── authService.js          ← Login/Register
│   │   │   ├── customerService.js      ← Module 1
│   │   │   ├── recipientService.js     ← Module 2
│   │   │   ├── transactionService.js   ← Module 3 & 4
│   │   │   ├── securityService.js      ← Module 5
│   │   │   └── adminService.js         ← Module 6
│   │   ├── modules/
│   │   │   ├── 01-customer/            store/, components/, pages/
│   │   │   ├── 02-recipients/
│   │   │   ├── 03-initiation/
│   │   │   ├── 04-transactions/
│   │   │   ├── 05-security/
│   │   │   └── 06-logs/
│   │   └── App.jsx                     ← All 6 modules' routes mounted here
│   └── .env                            ← VITE_API_BASE_URL=http://localhost:5000/api
│
└── transiq-api/                        ← Node.js + Express (ONE server for ALL 6 modules)
    ├── config/
    │   └── db.js                       ← Single Mongoose connection (created once, shared by all)
    ├── models/                         ← All 6 Mongoose models live here — imported by any controller
    │   ├── User.js
    │   ├── Wallet.js
    │   ├── Pocket.js
    │   ├── Receipt.js
    │   ├── Transaction.js
    │   └── ErrorLog.js
    ├── routes/
    │   ├── auth.js
    │   ├── customers.js
    │   ├── wallets.js
    │   ├── pockets.js
    │   ├── recipients.js
    │   ├── transactions.js
    │   ├── security.js
    │   └── admin.js
    ├── controllers/
    │   ├── authController.js
    │   ├── customerController.js
    │   ├── walletController.js
    │   ├── pocketController.js
    │   ├── recipientController.js
    │   ├── transactionController.js
    │   ├── securityController.js
    │   └── adminController.js
    ├── middleware/
    │   ├── auth.js                     ← JWT verify + attach req.user
    │   ├── adminOnly.js                ← role === 'admin' guard
    │   └── validate.js                 ← express-validator error handler
    ├── server.js                       ← Mounts ALL routes (add new routes as modules are built)
    └── .env
```

### Cross-Module Architecture (How all modules connect as one project)

All 6 modules share:
- **One MongoDB database** (`paygate_db`) — one `mongoose.connect()` in `config/db.js`
- **One set of Mongoose models** in `models/` — every controller imports from here, no duplication
- **One Express server** (`server.js`) — all module routes mounted together
- **One React app** (`Transiq/`) — all module pages in React Router, one `axiosInstance.js`

Build modules 1–6 in any order. Each adds its own routes, controllers, and service file. At the end, one `npm start` in `transiq-api/` and one `npm run dev` in `Transiq/` runs the entire production system.

---

## SECTION 2 — Environment Variables

**`transiq-api/.env`**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/paygate_db
JWT_SECRET=paygate_super_secret_jwt_key_2024
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
NODE_ENV=development
```

**`Transiq/.env`**
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## SECTION 3 — Complete Database Design (Exact Schema — Source of Truth)

Based on the project's official DB design. Use these exact field names, types, and enums in all Mongoose models.

---

### MODEL 1: User (`models/User.js`) → collection: `users`

```
Indexes: email (unique), role, isActive
Relationships: superUserIdBy → users._id (self-ref, for admin-created accounts)
```

| Field | Type | Constraints |
|-------|------|-------------|
| _id | ObjectId | PK (auto) |
| firstName | String | required, trim |
| lastName | String | required, trim |
| email | String | required, unique, indexed, lowercase |
| password | String | required, bcrypt salt:12, min 8 chars |
| phone | String | required, unique, indexed |
| role | String | enum: ['customer', 'admin'], default: 'customer', indexed |
| isActive | Boolean | default: true (freeze flag), indexed |
| superUserIdBy | ObjectId | ref: 'User' (which admin created/manages this user) |
| __v | Number | version key (Mongoose default) |

**Mongoose hooks on User:**
- `pre('save')`: if `password` modified → `bcrypt.hash(this.password, 12)` → assign back
- `pre('findOneAndUpdate')`: if `password` in update → hash it before saving
- `post('save')`: auto-create a Wallet document for new users (status: active, mainBalance: 0)

**Instance methods:**
- `UserSchema.methods.comparePassword = async (candidate) => bcrypt.compare(candidate, this.password)`

---

### MODEL 2: Wallet (`models/Wallet.js`) → collection: `wallets`

```
Indexes: userId (unique — one wallet per user), isFrozen, currency
Relationships: userId → users._id
```

| Field | Type | Constraints |
|-------|------|-------------|
| _id | ObjectId | PK (auto) |
| userId | ObjectId | ref: 'User', required, unique, indexed |
| mainBalance | Number | default: 0, min: 0 |
| currency | String | enum: ['INR', 'USD', 'EUR', 'BTC'], default: 'INR' |
| isFrozen | Boolean | default: false, indexed |
| __v | Number | version key |

**Compound index:** `{ userId: 1 }` (enforce one wallet per user)

**Mongoose hooks on Wallet:**
- `pre('save')`: if `isFrozen` → reject any balance change (throw error)

---

### MODEL 3: Pocket (`models/Pocket.js`) → collection: `pockets`

```
Indexes: walletId, userId, isLocked
Relationships: walletId → wallets._id, userId → users._id
```

| Field | Type | Constraints |
|-------|------|-------------|
| _id | ObjectId | PK (auto) |
| walletId | ObjectId | ref: 'Wallet', required, indexed |
| userId | ObjectId | ref: 'User', required, indexed |
| name | String | required, trim |
| currentAmount | Number | default: 0, min: 0 |
| targetAmount | Number | default: 0, min: 0 |
| isLocked | Boolean | default: false, indexed |

**Mongoose hooks on Pocket:**
- `pre('save')`: if `isLocked && currentAmount changed` → throw error (locked pockets can't be withdrawn from)

---

### MODEL 4: Receipt (`models/Receipt.js`) → collection: `receipts`  *(= Recipients in UI)*

```
Indexes: userId, accountNumber (unique per userId), isFavorite
Relationships: userId → users._id
```

| Field | Type | Constraints |
|-------|------|-------------|
| _id | ObjectId | PK (auto) |
| userId | ObjectId | ref: 'User', required, indexed |
| accountNumber | String | required, indexed |
| referenceCode | String | regex validated (alphanumeric, auto-generated: RCP-XXXX) |
| accountType | String | enum: ['savings', 'current', 'nri', 'ewa'], default: 'savings' |
| isFavorite | Boolean | default: false, indexed |
| name | String | required (recipient display name) |
| bankName | String | required |
| ifscCode | String | required |
| phone | String | |
| email | String | lowercase |

**Compound index:** `{ userId: 1, accountNumber: 1 }` (unique — same account can't be added twice by same user)

**Mongoose hooks on Receipt:**
- `pre('save')`: auto-generate `referenceCode` = `'RCP-' + nanoid(8).toUpperCase()` if not set

---

### MODEL 5: Transaction (`models/Transaction.js`) → collection: `transactions`

```
Indexes: senderWalletId, recipientId, referenceCode (unique), status, type, originalTransactionId
Relationships:
  senderWalletId → wallets._id
  recipientId    → receipts._id
  originalTransactionId → transactions._id (for refunds/reversals, self-ref)
  resolvedBy → users._id
```

| Field | Type | Constraints |
|-------|------|-------------|
| _id | ObjectId | PK (auto) |
| senderWalletId | ObjectId | ref: 'Wallet', required, indexed |
| recipientId | ObjectId | ref: 'Receipt', required, indexed |
| originalTransactionId | ObjectId | ref: 'Transaction' (populated for refund/reversal chains) |
| referenceCode | String | unique, indexed, auto-generated: 'TXN-XXXX' |
| amount | Number | required, min: 0.1 |
| status | String | enum: ['pending', 'success', 'failure'], default: 'pending', indexed |
| type | String | enum: ['enquiry', 'refund', 'reversal', 'transfer', 'topup'], default: 'transfer', indexed |
| method | String | enum: ['BANK_TRANSFER', 'CARD', 'WALLET', 'UPI', 'NEFT', 'RTGS', 'IMPS'], required |
| description | String | default: '' |
| failureReason | String | default: '' |
| resolvedBy | ObjectId | ref: 'User' |
| __v | Number | version key |

**Compound indexes:**
- `{ senderWalletId: 1, status: 1 }`
- `{ status: 1, createdAt: -1 }`
- `{ type: 1, status: 1 }`

**Mongoose hooks on Transaction:**
- `pre('save')`: auto-generate `referenceCode` = `'TXN-' + Date.now() + Math.random().toString(36).slice(2,6).toUpperCase()` if not set
- `post('save')`: if `status === 'success'` → deduct `amount` from `senderWalletId.mainBalance` using atomic `$inc`
- `post('save')`: if `status === 'failure'` → auto-create an `ErrorLog` document with severity based on failure reason

---

### MODEL 6: ErrorLog (`models/ErrorLog.js`) → collection: `errorlogs`

```
Indexes: transactionId, errorCode, severity, resolved
Relationships: transactionId → transactions._id, resolvedBy → users._id
```

| Field | Type | Constraints |
|-------|------|-------------|
| _id | ObjectId | PK (auto) |
| errorId | String | unique, indexed, auto-generated: 'ERR-XXXX' |
| transactionId | ObjectId | ref: 'Transaction', indexed |
| errorCode | String | enum: ['INSUFFICIENT_FUNDS', 'BANK_TIMEOUT', 'INVALID_ACCOUNT', 'DUPLICATE_TXN', 'NETWORK_ERROR', 'AUTH_FAILED', 'LIMIT_EXCEEDED', 'FROZEN_WALLET'], required, indexed |
| severity | String | enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'], required, indexed |
| message | String | required |
| resolved | Boolean | default: false, indexed |
| resolvedBy | ObjectId | ref: 'User' |
| resolvedAt | Date | |
| resolutionNotes | String | default: '' |
| stackTrace | String | |

**Compound index:** `{ resolved: 1, severity: 1 }`

**Mongoose hooks on ErrorLog:**
- `pre('save')`: auto-generate `errorId` = `'ERR-' + Date.now().toString(36).toUpperCase()` if not set

---

## SECTION 4 — Timestamps

Enable `{ timestamps: true }` on **every** schema. This auto-adds `createdAt` and `updatedAt` to all documents.

---

## SECTION 5 — config/db.js (create once, used by all modules)

```js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // MongoDB auto-creates paygate_db and all collections on first write
    });
    console.log(`MongoDB connected: ${conn.connection.host} | DB: ${conn.connection.name}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

---

## SECTION 6 — server.js (mount ALL module routes here, add as modules are built)

```js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Mount routes — all modules share one server
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/customers',    require('./routes/customers'));   // Module 1
app.use('/api/wallets',      require('./routes/wallets'));     // Module 1
app.use('/api/pockets',      require('./routes/pockets'));     // Module 1
app.use('/api/recipients',   require('./routes/recipients'));  // Module 2
app.use('/api/transactions', require('./routes/transactions'));// Module 3 & 4
app.use('/api/analytics',    require('./routes/analytics'));   // Module 4
app.use('/api/security',     require('./routes/security'));    // Module 5
app.use('/api/admin',        require('./routes/admin'));       // Module 6

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server error' });
});

app.listen(process.env.PORT || 5000, () =>
  console.log(`PayGate API running on port ${process.env.PORT || 5000}`)
);
```

---

## SECTION 7 — Axios Instance (create once, all modules use it)

**`Transiq/src/api/axiosInstance.js`**
```js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('paygate_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('paygate_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## SECTION 8 — JWT Auth Middleware (used by all protected routes)

**`transiq-api/middleware/auth.js`**
```js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user || !req.user.isActive)
      return res.status(401).json({ success: false, message: 'Account inactive or not found' });
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
```

**`transiq-api/middleware/adminOnly.js`**
```js
module.exports = (req, res, next) => {
  if (req.user?.role !== 'admin')
    return res.status(403).json({ success: false, message: 'Admin access required' });
  next();
};
```

---

## SECTION 9 — Complete API Endpoint Map (All Modules)

### Module 1 — Customer Dashboard / Wallet / Pockets
```
POST   /api/auth/register            → Create User + auto-create Wallet
POST   /api/auth/login               → Verify password, return JWT
GET    /api/customers/me             → Profile (populate wallet + pockets)   [AUTH]
PUT    /api/customers/me             → Update firstName, lastName, phone      [AUTH]
GET    /api/customers/me/dashboard   → { user, wallet, pockets, recentTxns } [AUTH]
GET    /api/wallets/me               → Get my wallet (mainBalance, currency)  [AUTH]
PUT    /api/wallets/me/currency      → Change wallet currency                 [AUTH]
GET    /api/pockets                  → List all my pockets                    [AUTH]
POST   /api/pockets                  → Create pocket {name, targetAmount}     [AUTH]
PUT    /api/pockets/:id              → Update pocket name/targetAmount        [AUTH]
PATCH  /api/pockets/:id/deposit      → Move {amount} from wallet into pocket  [AUTH]
PATCH  /api/pockets/:id/withdraw     → Move {amount} from pocket to wallet    [AUTH]
PATCH  /api/pockets/:id/lock         → Lock/unlock pocket                     [AUTH]
DELETE /api/pockets/:id              → Delete pocket (funds return to wallet) [AUTH]
```

### Module 2 — Recipients
```
GET    /api/recipients               → All my receipts                        [AUTH]
POST   /api/recipients               → Add new receipt {name,accountNumber,bankName,ifscCode,accountType} [AUTH]
GET    /api/recipients/:id           → Single receipt detail                  [AUTH]
PUT    /api/recipients/:id           → Update receipt                         [AUTH]
DELETE /api/recipients/:id           → Remove receipt                         [AUTH]
PATCH  /api/recipients/:id/favourite → Toggle isFavorite                      [AUTH]
```

### Module 3 — Send Money (Initiation)
```
POST   /api/transactions             → Initiate transfer {recipientId, amount, method, description} [AUTH]
GET    /api/transactions/:id         → Get single transaction status + timeline [AUTH]
PATCH  /api/transactions/:id/cancel  → Cancel a pending transaction           [AUTH]
POST   /api/transactions/validate    → Pre-flight check (balance, frozen wallet, limits) [AUTH]
```

### Module 4 — Transactions / Financial Analysis / Insights
```
GET    /api/transactions             → All my txns: ?status=&type=&method=&dateFrom=&dateTo=&page=&limit= [AUTH]
GET    /api/transactions/:id         → Full detail                            [AUTH]
PATCH  /api/transactions/:id/retry   → Retry failed transaction               [AUTH]
GET    /api/analytics/summary        → { totalSent, totalReceived, successCount, failedCount, netFlow } [AUTH]
GET    /api/analytics/by-method      → Breakdown by method (BANK_TRANSFER/CARD/UPI etc.)               [AUTH]
GET    /api/analytics/by-month       → Monthly aggregation for charts         [AUTH]
GET    /api/analytics/insights       → { topRecipient, peakSpendDay, highestTxn, unusualActivity }     [AUTH]
GET    /api/analytics/export         → Download CSV of all transactions        [AUTH]
```

### Module 5 — Security
```
PUT    /api/security/password        → Change password {oldPassword, newPassword} [AUTH]
GET    /api/security/activity        → My audit log (login history, transfers, changes) [AUTH]
PATCH  /api/security/freeze          → Freeze/unfreeze my own wallet          [AUTH]
DELETE /api/security/account         → Deactivate account (sets isActive: false) [AUTH]
```

### Module 6 — Admin Logs & Monitoring
```
GET    /api/admin/stats              → { totalTxns, totalVolume, successRate, failedCount, pendingCount, unresolvedErrors } [AUTH+ADMIN]
GET    /api/admin/transactions       → All txns: ?status=&type=&dateFrom=&dateTo=&page=&limit= [AUTH+ADMIN]
GET    /api/admin/transactions/:id   → Full txn audit (populated sender, recipient, wallet) [AUTH+ADMIN]
PATCH  /api/admin/transactions/:id/force-success → Force mark pending txn as success [AUTH+ADMIN]
PATCH  /api/admin/transactions/:id/force-fail    → Force mark pending txn as failure  [AUTH+ADMIN]
GET    /api/admin/errors             → All error logs: ?severity=&resolved=&errorCode=&page= [AUTH+ADMIN]
PATCH  /api/admin/errors/:id/resolve → Resolve error {resolutionNotes}         [AUTH+ADMIN]
POST   /api/admin/errors/resolve-all → Resolve all unresolved errors           [AUTH+ADMIN]
GET    /api/admin/users              → All users list with wallet info          [AUTH+ADMIN]
PATCH  /api/admin/users/:id/freeze   → Freeze/unfreeze user wallet              [AUTH+ADMIN]
PATCH  /api/admin/users/:id/activate → Activate/deactivate user account        [AUTH+ADMIN]
```

---

## SECTION 10 — Zustand Store Pattern (same structure for all modules)

```js
import { create } from 'zustand';
import <moduleName>Service from '../../../api/<moduleName>Service';

export const use<Module>Store = create((set, get) => ({
  // State
  items: [],
  selectedItem: null,
  loading: false,
  error: null,

  // Fetch all
  fetchAll: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const { data } = await <moduleName>Service.getAll(params);
      set({ items: data.data || data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch', loading: false });
    }
  },

  // Create
  create: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await <moduleName>Service.create(payload);
      set((state) => ({ items: [data.data, ...state.items], loading: false }));
      return { success: true, data: data.data };
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to create', loading: false });
      return { success: false };
    }
  },

  // Update
  update: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await <moduleName>Service.update(id, payload);
      set((state) => ({
        items: state.items.map((i) => (i._id === id ? data.data : i)),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to update', loading: false });
    }
  },

  // Delete
  remove: async (id) => {
    set({ loading: true, error: null });
    try {
      await <moduleName>Service.remove(id);
      set((state) => ({ items: state.items.filter((i) => i._id !== id), loading: false }));
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to delete', loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
```

---

## SECTION 11 — Service File Pattern (one per module)

```js
// src/api/<module>Service.js
import api from './axiosInstance';

const BASE = '/<resource>';  // e.g. '/recipients', '/transactions', '/pockets'

const <module>Service = {
  getAll:   (params) => api.get(BASE, { params }),
  getById:  (id)     => api.get(`${BASE}/${id}`),
  create:   (data)   => api.post(BASE, data),
  update:   (id, data) => api.put(`${BASE}/${id}`, data),
  remove:   (id)     => api.delete(`${BASE}/${id}`),
  // Add module-specific methods below:
  // e.g. toggleFavourite: (id) => api.patch(`${BASE}/${id}/favourite`),
};

export default <module>Service;
```

---

## SECTION 12 — Output Checklist (Generate ALL for the requested module)

**Infrastructure (generate only if not already exists):**
- [ ] `transiq-api/package.json` with deps: `express mongoose dotenv bcryptjs jsonwebtoken cors express-validator`
- [ ] `transiq-api/config/db.js`
- [ ] `transiq-api/server.js` (all routes pre-mounted as shown in Section 6)
- [ ] `transiq-api/middleware/auth.js`
- [ ] `transiq-api/middleware/adminOnly.js`
- [ ] `transiq-api/.env.example`
- [ ] `Transiq/src/api/axiosInstance.js`
- [ ] `Transiq/.env.example`

**Per module (always generate, complete code):**
- [ ] Only the Mongoose model files this module uses (full schema with hooks + indexes)
- [ ] `transiq-api/routes/<module>.js` — all endpoints for this module
- [ ] `transiq-api/controllers/<module>Controller.js` — full logic, async/await, try/catch, correct HTTP codes
- [ ] `Transiq/src/api/<module>Service.js` — all service functions
- [ ] Zustand store file(s) — `use<Module>Store.js` with real API calls replacing all mock data
- [ ] `README-module<N>.md` — one-liner instructions: packages to install, how to run

---

## SECTION 13 — Module Quick Reference

| # | Module | Collections Used | Service File | Store File |
|---|--------|-----------------|-------------|-----------|
| 1 | Customer Dashboard / Wallet / Pockets | User, Wallet, Pocket | customerService.js, walletService.js | customerStore.js, walletStore.js |
| 2 | Recipients | Receipt, User | recipientService.js | recipientStore.js |
| 3 | Send Money | Transaction, Wallet, Receipt | transactionService.js | transactionStore.js |
| 4 | Transactions & Analytics | Transaction, Wallet, Receipt | transactionService.js, analyticsService.js | transactionStore.js, analyticsStore.js |
| 5 | Security | User, Wallet | securityService.js | securityStore.js |
| 6 | Admin Logs & Monitoring | Transaction, ErrorLog, User, Wallet | adminService.js | logsStore.js |

---

## PROMPT END
