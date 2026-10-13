# Module 6 — Admin Logs & Monitoring
## PayGate / Transiq

---

## What's included

| Layer | Files created |
|-------|--------------|
| Backend models | `User.js`, `Wallet.js`, `Transaction.js`, `ErrorLog.js` |
| Backend routes | `routes/admin.js`, `routes/auth.js` |
| Backend controller | `controllers/adminController.js` |
| Backend infra | `config/db.js`, `server.js`, `middleware/auth.js`, `middleware/adminOnly.js`, `middleware/validate.js` |
| Frontend API | `src/api/axiosInstance.js`, `src/api/adminService.js` |
| Frontend store | `src/modules/06-logs/store/logsStore.js` (real API, no mock data) |

---

## How to run

### 1. Start MongoDB
Make sure MongoDB is running locally on port 27017.
```
mongod
```
The database `paygate_db` will be created automatically on first write.

### 2. Start the backend
```
cd transiq-api
npm install         # already done
npm run dev         # uses nodemon for hot-reload
                    # OR: npm start
```
API runs at: **http://localhost:5000**

### 3. Start the frontend
```
cd Transiq
npm run dev
```
App runs at: **http://localhost:5173**

---

## Create an admin account (one-time setup)

POST to `http://localhost:5000/api/auth/register` with:
```json
{
  "firstName": "Admin",
  "lastName": "PayGate",
  "email": "admin@paygate.com",
  "password": "admin1234",
  "phone": "9999999999",
  "role": "admin"
}
```
Copy the returned `token` — use it as `Bearer <token>` in admin API calls.

---

## API Endpoints (Module 6)

```
GET    /api/admin/stats                           KPI dashboard
GET    /api/admin/transactions                    All transactions
GET    /api/admin/transactions/:id                Single txn audit
PATCH  /api/admin/transactions/:id/force-success  Settle pending txn
PATCH  /api/admin/transactions/:id/force-fail     Fail pending txn
GET    /api/admin/errors                          Error logs
PATCH  /api/admin/errors/:id/resolve              Resolve error
POST   /api/admin/errors/resolve-all              Resolve all errors
GET    /api/admin/users                           All users + wallets
PATCH  /api/admin/users/:id/freeze                Freeze/unfreeze wallet
PATCH  /api/admin/users/:id/activate              Activate/deactivate user
```

---

## Connecting future modules

When building modules 1–5, uncomment the corresponding lines in `transiq-api/server.js`:
```js
app.use('/api/customers',    require('./routes/customers'));
app.use('/api/wallets',      require('./routes/wallets'));
// etc.
```
All models in `transiq-api/models/` are shared — import them in any controller.
