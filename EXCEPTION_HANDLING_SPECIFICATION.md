# Complete Exception Handling Architectural Specification
## PayGate (Transiq) — Full-Stack MERN Platform

This document explains **Why**, **How**, and **Where** exception handling is architected across every module of the PayGate (Transiq) platform.

---

## 1. WHY EXCEPTION HANDLING IS APPLIED

In a mission-critical financial gateway and wallet system, unhandled exceptions lead to:
1. **Process Crashes**: A single uncaught database timeout or malformed JSON payload could crash the Node.js event loop, terminating service for all active users.
2. **Ambiguous Payment States / Ghost Charges**: If a fund deduction fails midway without structured exception recovery, the customer's wallet could be debited while the ledger transaction fails to record.
3. **Security Vulnerability / Information Leakage**: Default unhandled error stack traces expose internal database URIs, collection schemas, and server file paths to potential attackers.
4. **Client-Side White-Page Freezes**: If an HTTP 401 or 500 error is unhandled in React, components crash, leaving the user with an unusable white screen.

---

## 2. ARCHITECTURAL LEVELS OF EXCEPTION HANDLING

The PayGate platform implements a 4-tier Exception Handling Strategy:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        TIER 1: CLIENT-SIDE UI                          │
│        (Axios Interceptors, React Form Validation & State Guards)      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP Requests / Responses
┌───────────────────────────────────▼────────────────────────────────────┐
│                  TIER 2: MIDDLEWARE & ROUTE GUARDS                     │
│          (JWT Verification, express-validator, adminOnly Guard)        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Validated Requests
┌───────────────────────────────────▼────────────────────────────────────┐
│               TIER 3: BUSINESS CONTROLLER TRY-CATCH                    │
│      (Atomic Checks, Balance Invariants, Frozen Wallet Guards)         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Database Transactions & Failures
┌───────────────────────────────────▼────────────────────────────────────┐
│            TIER 4: ASYNCHRONOUS TELEMETRY & GLOBAL ERROR HANDLER       │
│        (Mongoose Post-Save ErrorLog Hook & Express 4-Param Middleware) │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. HOW & WHERE EXCEPTION HANDLING IS IMPLEMENTED ACROSS ALL MODULES

### Module 01: Customer Financial Dashboard, Wallets & Smart Pockets
* **Where**:
  * Backend Controller: [`transiq-api/controllers/pocketController.js`](file:///D:/Clg/python%20lab/MERN%20PROJECT/transiq-api/controllers/pocketController.js) & [`walletController.js`](file:///D:/Clg/python%20lab/MERN%20PROJECT/transiq-api/controllers/walletController.js)
  * Frontend Store: [`Transiq/src/modules/01-customer/store/usePocketStore.js`](file:///D:/Clg/python%20lab/MERN%20PROJECT/Transiq/src/modules/01-customer/store/usePocketStore.js)
* **How**:
  * **Negative/Non-Numeric Guard**: `validatePocketTarget()` catches negative values or values exceeding 100,000,000 INR before querying the database.
  * **Locked Pocket Invariant**: `withdraw()` checks `if (pocket.isLocked) throw new Error('Unlock the pocket before withdrawing')`.
  * **Overdraft Exception**: Prevents balance from dropping below ₹0: `if (amount > wallet.mainBalance) return res.status(400)`.
  * **Try-Catch Encapsulation**: All asynchronous Mongoose calls are wrapped in `try { ... } catch (e) { res.status(500).json({ success: false, message: '...' }) }`.

---

### Module 02: Beneficiary Directory & Contact Book
* **Where**:
  * Backend Controller: [`transiq-api/controllers/recipientController.js`](file:///D:/Clg/python%20lab/MERN%20PROJECT/transiq-api/controllers/recipientController.js)
  * Frontend Validation: [`Transiq/src/utils/validation.js`](file:///D:/Clg/python%20lab/MERN%20PROJECT/Transiq/src/utils/validation.js)
* **How**:
  * **IFSC Format Exception**: Rejects codes that do not match `^[A-Z]{4}0[A-Z0-9]{6}$`.
  * **Ownership Isolation**: In `getById`, `update`, and `remove`, queries strictly enforce `{ _id: req.params.id, userId: req.user._id }`. If an unauthorized customer attempts to access someone else's beneficiary ID, a `404 Recipient Not Found` exception is thrown.
  * **Duplicate Handling**: Catches MongoDB unique constraint errors (code 11000) and transforms them into friendly user messages: `"Recipient already exists in your contacts."`

---

### Module 03: Payment Checkout Initiation & Bank Integration
* **Where**:
  * Backend Controller: [`transiq-api/controllers/paymentController.js`](file:///D:/Clg/python%20lab/MERN%20PROJECT/transiq-api/controllers/paymentController.js) (lines 230–312)
  * Database Hook: [`transiq-api/models/Transaction.js`](file:///D:/Clg/python%20lab/MERN%20PROJECT/transiq-api/models/Transaction.js) (lines 68–97)
* **How**:
  * **PIN Authentication Failure**:
    ```javascript
    if (pin !== (process.env.DEMO_PAYMENT_PIN || '1234')) {
      return res.status(400).json({ status: 'FAILED', reason: 'Incorrect Security PIN.' });
    }
    ```
  * **Frozen Wallet Kill-Switch Exception**:
    ```javascript
    if (wallet.isFrozen && (!accountId || accountId.startsWith('WALLET_'))) {
      return res.status(403).json({ status: 'FAILED', reason: 'Your wallet is frozen. Outgoing payments are blocked.' });
    }
    ```
  * **Bank vs. Wallet Balance Checking**: Validates `balance >= amount` before subtracting.
  * **Automated Failure Logging Hook (Mongoose Post-Save)**:
    When any transaction document saves with `status: 'failure'`, a post-save hook intercepts the failure and creates an `ErrorLog` record categorized by severity (`CRITICAL`, `HIGH`, `MEDIUM`) without blocking the user response.

---

### Module 04: Transactions, Financial Ledgers & Analytics
* **Where**:
  * Backend Controller: [`transiq-api/controllers/transactionController.js`](file:///D:/Clg/python%20lab/MERN%20PROJECT/transiq-api/controllers/transactionController.js) & [`analyticsController.js`](file:///D:/Clg/python%20lab/MERN%20PROJECT/transiq-api/controllers/analyticsController.js)
* **How**:
  * **Query Parameter Sanitization**: Parses and limits page parameters: `const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));`.
  * **Zero-Division Defense**: In financial ratio calculations (e.g. success rate), the denominator is safeguarded: `const successRate = total > 0 ? ((success / total) * 100).toFixed(1) : '100.0'`.

---

### Module 05: Security, RBAC & Device Session Management
* **Where**:
  * Backend Middleware: [`transiq-api/middleware/auth.js`](file:///D:/Clg/python%20lab/MERN%20PROJECT/transiq-api/middleware/auth.js)
  * Backend Controller: [`transiq-api/controllers/securityController.js`](file:///D:/Clg/python%20lab/MERN%20PROJECT/transiq-api/controllers/securityController.js)
  * Frontend Interceptor: [`Transiq/src/api/axiosInstance.js`](file:///D:/Clg/python%20lab/MERN%20PROJECT/Transiq/src/api/axiosInstance.js)
* **How**:
  * **JWT Expiration & Tampering**:
    ```javascript
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user || !req.user.isActive) throw new Error('Account inactive');
      next();
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
    ```
  * **Client-Side 401 Interception (Zero-Loop Redirect)**:
    When the frontend encounters an HTTP 401, the response interceptor clears `paygate_token` and redirects to `/login` immediately, preventing endless retry loops.

---

### Module 06: Admin Operations, Telemetry & Error Recovery
* **Where**:
  * Backend Middleware: [`transiq-api/middleware/adminOnly.js`](file:///D:/Clg/python%20lab/MERN%20PROJECT/transiq-api/middleware/adminOnly.js)
  * Backend Controller: [`transiq-api/controllers/adminController.js`](file:///D:/Clg/python%20lab/MERN%20PROJECT/transiq-api/controllers/adminController.js)
  * Server Root: [`transiq-api/server.js`](file:///D:/Clg/python%20lab/MERN%20PROJECT/transiq-api/server.js) (lines 92–99)
* **How**:
  * **Role Authorization Exception**: If `req.user.role !== 'admin'`, the middleware returns `403 Forbidden` (`"Access denied: Admin credentials required"`).
  * **Global Uncaught Error Handler Middleware**:
    ```javascript
    app.use((err, req, res, next) => {
      console.error('Server error:', err.message);
      res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
      });
    });
    ```

---

## 4. EXCEPTION HANDLING TEST MATRIX

An automated suite ([`transiq-api/tests/exception_handling.test.js`](file:///D:/Clg/python%20lab/MERN%20PROJECT/transiq-api/tests/exception_handling.test.js)) tests these guarantees:

| Test Case | Scenario | Expected Exception Behavior | Status |
|---|---|---|---|
| **EX-01** | Unhandled Database / Runtime Error | Caught by global middleware; returns 500 JSON without node process crash | **PASS** |
| **EX-02** | Validation Domain Exception | Throws custom error; forwarded via `next(err)` to return 400 Bad Request | **PASS** |
| **EX-03** | Expired / Invalid JWT Token | Intercepted by `auth.js`; returns 401 and wiped on client | **PASS** |
| **EX-04** | Frozen Wallet Payment Attempt | Trapped by `authorizePin`; returns 403 Forbidden | **PASS** |
| **EX-05** | Overdraft / Insufficient Funds | Trapped by `authorizePin`; returns 400 with available balance message | **PASS** |
| **EX-06** | Failed Transaction Ledger Event | Captured by Mongoose post-save hook; auto-records `ErrorLog` | **PASS** |
