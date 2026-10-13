import os
from pathlib import Path

ROOT_DIR = r"D:\Clg\python lab\MERN PROJECT"
OUT_FILE = os.path.join(ROOT_DIR, "PROJECT_MASTER_BLUEPRINT.md")

BACKEND_DIR = os.path.join(ROOT_DIR, "transiq-api")
FRONTEND_DIR = os.path.join(ROOT_DIR, "Transiq")

def read_file_safe(path):
    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()
    except Exception as e:
        return f"// Error reading file: {e}"

def generate():
    with open(OUT_FILE, "w", encoding="utf-8") as out:
        out.write("""# PAYGATE (TRANSIQ) — COMPLETE MEGA SOURCE CODE & SYSTEM BLUEPRINT SPECIFICATION

> **AUTONOMOUS RECONSTRUCTION MANIFEST**
> This document is a comprehensive, production-grade architectural and source specification for **PayGate (Transiq)**.
> It contains the exact technical rationale, end-to-end database schemas, data dictionaries, complete Data Flow Diagrams (Level 0, Level 1, Level 2), Entity-Relationship specifications, UML Class Diagrams, Sequence Diagrams, State Transition Diagrams, API contracts, frontend store blueprints, and **exhaustive, verbatim full source code** for every backend server controller, route, model, middleware, and frontend React module.
>
> If this document is provided into any AI assistant or autonomous code-generation engine, the entire application can be reconstructed from scratch without missing a single function, endpoint, validator, or component.

---

## TABLE OF CONTENTS
1. [Executive Summary & High-Level System Architecture](#1-executive-summary--high-level-system-architecture)
2. [Module Breakdown: Why & How Each Module Exists](#2-module-breakdown-why--how-each-module-exists)
   - [Module 01: Customer Financial Dashboard & Smart Pockets](#module-01-customer-financial-dashboard--smart-pockets)
   - [Module 02: Verified Beneficiary Directory & Contact Book](#module-02-verified-beneficiary-directory--contact-book)
   - [Module 03: 4-Step Payment Initiation & Multi-Account Wallet](#module-03-4-step-payment-initiation--multi-account-wallet)
   - [Module 04: Financial Analytics, Ledgers & Insights](#module-04-financial-analytics-ledgers--insights)
   - [Module 05: Security, RBAC, Active Sessions & Incident Telemetry](#module-05-security-rbac-active-sessions--incident-telemetry)
   - [Module 06: Admin Operations, Telemetry, Pending & Error Recovery](#module-06-admin-operations-telemetry-pending--error-recovery)
3. [Exhaustive Database Design (Schemas & Data Dictionary)](#3-exhaustive-database-design-schemas--data-dictionary)
4. [Data Flow Diagrams (Level 0, Level 1, Level 2)](#4-data-flow-diagrams-dfd)
5. [Entity-Relationship Diagram & Relational Cardinalities](#5-entity-relationship-diagram--relational-cardinalities)
6. [UML Class Diagram & Component Object Model](#6-uml-class-diagram--component-object-model)
7. [Sequence Diagrams: Payment Authorization & Error Telemetry](#7-sequence-diagrams)
8. [Complete REST API Specification & Endpoint Contracts](#8-complete-rest-api-specification)
9. [Complete Backend Source Code (Every File Verbatim)](#9-complete-backend-source-code)
10. [Complete Frontend Source Code (Every File Verbatim)](#10-complete-frontend-source-code)
11. [Execution, Seeding, Verification & Deployment Playbook](#11-execution-seeding-verification--deployment-playbook)

---

## 1. EXECUTIVE SUMMARY & HIGH-LEVEL SYSTEM ARCHITECTURE

### 1.1 Problem Statement
Modern online payment gateways and e-wallets frequently suffer from two critical flaws:
1. **Brittle Client-Side State Synchronization**: Network interruptions during client-side checkouts lead to ambiguous payment states, accidental double deductions, or ghost charges where the wallet is debited without ledger confirmation.
2. **Silent Failure & Missing Telemetry**: Traditional gateways fail to categorize payment failures into granular, auditable error domains. Operators are left without trace codes when transactions stall due to bank timeouts, frozen customer wallets, or insufficient balance.

### 1.2 The PayGate (Transiq) Solution
PayGate provides an enterprise-grade full-stack financial ecosystem built on the **MERN** (MongoDB, Express.js, React 18, Node.js) technology stack:
* **Presentation Tier**: Vite SPA with Tailwind CSS, Zustand centralized stores, and zero-delay route guards.
* **Service Tier**: Node.js REST API with stateless JWT authentication, Bcrypt credential encryption, and atomic deduction pipelines.
* **Data Tier**: MongoDB document database featuring ACID session management, referential integrity across 7 collections, and automated telemetry capture.

---

## 2. MODULE BREAKDOWN: WHY & HOW EACH MODULE EXISTS

### Module 01: Customer Financial Dashboard & Smart Pockets
* **Why it exists**: Users require an instant consolidated view of their liquid balances, goal progress, and recent activity upon signing in.
* **How it works**:
  * Consumes `/api/customers/me` to load authenticated identity details and linked bank balances.
  * Consumes `/api/pockets` to fetch targeted micro-savings envelopes ("Pockets").
  * Implements deposit, withdrawal, lock/unlock, editing, and deletion for budget management.
  * Uses local modal state (`AuthVerificationModal`) to verify credentials directly against MongoDB.

### Module 02: Verified Beneficiary Directory & Contact Book
* **Why it exists**: Sending money repeatedly requires a verified list of recipients with validated IFSC codes and account numbers to prevent human transfer errors.
* **How it works**:
  * Consumes `/api/receipts` to support CRUD operations for payees.
  * Validates Indian Financial System Codes (IFSC) matching `^[A-Z]{4}0[A-Z0-9]{6}$`.
  * Implements favorite starring (`toggleFavourite`) for one-click transfers.

### Module 03: 4-Step Payment Initiation & Multi-Account Wallet
* **Why it exists**: Transferring funds must be strictly sequential, idempotent, and authorized by a cryptographic PIN.
* **How it works**:
  * Step 1: Select or enter a beneficiary.
  * Step 2: Choose source (Wallet vs Linked Bank Account) and transfer method (`WALLET`, `IMPS`, `NEFT`, `RTGS`).
  * Step 3: Enter 4-digit security PIN (`1234` demo default or custom hashed PIN).
  * Step 4: Digital receipt generation with copyable `TXN-` reference code and download capabilities.

### Module 04: Financial Analytics, Ledgers & Insights
* **Why it exists**: Users require transparency into spending trends, income vs expense breakdowns, and transaction search.
* **How it works**:
  * Consumes `/api/transactions` with pagination, status filters (`success`, `failure`, `pending`), and date ranges.
  * Aggregates volume metrics and visual category distributions.

### Module 05: Security, RBAC, Active Sessions & Incident Telemetry
* **Why it exists**: Financial platforms require zero-trust access controls, multi-device tracking, kill-switches, and audit logging.
* **How it works**:
  * Instant wallet freeze toggle (`PATCH /api/security/freeze`) which halts all outgoing debits.
  * Device session management stored directly in MongoDB (`User.activeSessions`).
  * Dedicated session termination (`DELETE /api/security/sessions/:id`).
  * Immutable security event logs (`User.securityLogs`).

### Module 06: Admin Operations, Telemetry, Pending & Error Recovery
* **Why it exists**: Financial administrators must oversee platform uptime, retry stuck pending transfers, and investigate high-severity errors.
* **How it works**:
  * Monitored via `/api/admin/metrics`, `/api/admin/pending`, and `/api/admin/errors`.
  * Allows administrators to manually retry or fail pending transactions and resolve critical error logs.

---

## 3. EXHAUSTIVE DATABASE DESIGN (SCHEMAS & DATA DICTIONARY)

The database `paygate_db` consists of 7 collections:

### 1. `users` Collection
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary Key |
| `firstName` | String | User first name |
| `lastName` | String | User last name |
| `email` | String | Unique login email (lowercase) |
| `password` | String | Bcrypt hash (min 8 chars) |
| `phone` | String | Unique mobile number |
| `role` | String | Enum: `['customer', 'admin']` |
| `isActive` | Boolean | Account status |
| `twoFactorEnabled` | Boolean | 2FA status |
| `biometricsEnabled`| Boolean | Biometric status |
| `autoLockMinutes` | Number | Auto-lock timeout |
| `activeSessions` | Array | Device session documents |
| `securityLogs` | Array | Security audit log documents |

### 2. `wallets` Collection
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary Key |
| `userId` | ObjectId | Reference to User (1:1) |
| `mainBalance` | Number | Liquid balance in INR |
| `currency` | String | ISO currency code (default: 'INR') |
| `isFrozen` | Boolean | Freeze kill-switch status |

### 3. `pockets` Collection
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary Key |
| `userId` | ObjectId | Reference to User |
| `name` | String | Pocket title |
| `targetAmount` | Number | Milestone goal target |
| `currentAmount` | Number | Accumulated savings |
| `isLocked` | Boolean | Lock status |

### 4. `receipts` Collection
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary Key |
| `userId` | ObjectId | Reference to User |
| `name` | String | Payee registered name |
| `accountNumber`| String | Destination account number |
| `ifscCode` | String | Bank IFSC routing code |
| `bankName` | String | Bank name |
| `accountType` | String | Enum: `['savings', 'current', 'nri']` |
| `isFavorite` | Boolean | Starred status |

### 5. `transactions` Collection
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary Key |
| `referenceCode` | String | Unique reference (`TXN-...`) |
| `senderWalletId`| ObjectId | Source wallet reference |
| `recipientId` | ObjectId | Destination recipient reference |
| `amount` | Number | Transfer sum in INR |
| `method` | String | `WALLET`, `IMPS`, `NEFT`, `RTGS` |
| `type` | String | `transfer`, `deposit`, `withdrawal` |
| `status` | String | `pending`, `success`, `failure`, `cancelled` |
| `description` | String | Payment remarks |
| `failureReason` | String | Optional error description |

### 6. `errorlogs` Collection
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary Key |
| `transactionId` | ObjectId | Reference to Transaction |
| `errorCode` | String | E.g. `INSUFFICIENT_FUNDS`, `BANK_TIMEOUT` |
| `severity` | String | `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` |
| `message` | String | Detailed error text |
| `resolved` | Boolean | Admin resolution status |

### 7. `bankaccounts` Collection
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary Key |
| `userId` | ObjectId | Reference to User |
| `bankName` | String | Commercial bank name |
| `accountNumber`| String | Masked account number |
| `balance` | Number | Available bank balance |
| `status` | String | `ACTIVE`, `INACTIVE` |

---

## 4. DATA FLOW DIAGRAMS (DFD)

### Level 0 DFD (Context Diagram)
```mermaid
graph TD
    User["Customer / User"]
    Admin["System Administrator"]
    PayGate["(0.0) PayGate Platform System"]
    BankSystem["Banking Gateway API"]

    User -->|"Credentials, Transfers, Beneficiary Details"| PayGate
    PayGate -->|"Dashboard Data, Receipts, Status Alerts"| User

    Admin -->|"Audit Queries, Log Reviews, Freeze Triggers"| PayGate
    PayGate -->|"System Telemetry, Error Logs, Metrics"| Admin

    PayGate -->|"Fund Settlement Requests"| BankSystem
    BankSystem -->|"Settlement Responses, Account Status"| PayGate
```

### Level 1 DFD (Subsystem Decomposition)
```mermaid
graph TD
    C["Customer"]
    P1["1.0 User Authentication"]
    P2["2.0 Wallet & Pocket Management"]
    P3["3.0 Beneficiary Maintenance"]
    P4["4.0 Payment Initiation & PIN Authorization"]
    P5["5.0 Telemetry & Audit Processing"]
    A["Administrator"]

    DS1[("D1: Users Store")]
    DS2[("D2: Wallets Store")]
    DS3[("D3: Receipts Store")]
    DS4[("D4: Transactions Ledger")]
    DS5[("D5: ErrorLogs Store")]

    C -->|"Login Credentials"| P1
    P1 <-->|"Verify Hash / Token"| DS1
    P1 -->|"Auth Token & Role"| C

    C -->|"Allocate Pockets / Move Funds"| P2
    P2 <-->|"Read / Update Balances"| DS2

    C -->|"Add / Edit Recipient"| P3
    P3 <-->|"Store Beneficiary"| DS3

    C -->|"Initiate Transfer + PIN"| P4
    P4 <-->|"Check Balance & Deduct"| DS2
    P4 <-->|"Validate Beneficiary"| DS3
    P4 -->|"Log Transaction"| DS4
    P4 -->|"Generate Receipt"| C

    P4 -.->|"On Failure / Timeout"| P5
    P5 -->|"Write Incident"| DS5
    A <-->|"Inspect Errors & History"| P5
    A <-->|"Audit Transactions"| DS4
```

---

## 5. ENTITY-RELATIONSHIP DIAGRAM & RELATIONAL CARDINALITIES

```mermaid
erDiagram
    USER ||--o| WALLET : "owns (1:1)"
    USER ||--o{ BANK_ACCOUNT : "links (1:N)"
    USER ||--o{ POCKET : "allocates (1:N)"
    USER ||--o{ RECEIPT : "saves (1:N)"
    WALLET ||--o{ TRANSACTION : "originates (1:N)"
    RECEIPT ||--o{ TRANSACTION : "receives (1:N)"
    TRANSACTION ||--o| ERROR_LOG : "triggers on failure (1:1)"
```

---

## 6. UML CLASS DIAGRAM & COMPONENT OBJECT MODEL

```mermaid
classDiagram
    class User {
        +ObjectId _id
        +String firstName
        +String lastName
        +String email
        +String password
        +String role
        +Boolean isActive
        +comparePassword(candidate) Boolean
    }
    class Wallet {
        +ObjectId _id
        +ObjectId userId
        +Number mainBalance
        +String currency
        +Boolean isFrozen
    }
    class Pocket {
        +ObjectId _id
        +ObjectId userId
        +String name
        +Number targetAmount
        +Number currentAmount
        +Boolean isLocked
    }
    class Transaction {
        +ObjectId _id
        +String referenceCode
        +ObjectId senderWalletId
        +ObjectId recipientId
        +Number amount
        +String method
        +String status
    }
    class ErrorLog {
        +ObjectId _id
        +ObjectId transactionId
        +String errorCode
        +String severity
        +String message
        +Boolean resolved
    }
    User "1" --> "1" Wallet
    User "1" --> "*" Pocket
    Wallet "1" --> "*" Transaction
    Transaction "1" --> "0..1" ErrorLog
```

---

## 7. SEQUENCE DIAGRAMS

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Customer
    participant UI as React Frontend (Vite)
    participant Auth as Auth Middleware (JWT)
    participant Ctrl as PaymentController
    participant WModel as Wallet Model
    participant TxnModel as Transaction Model
    participant ErrModel as ErrorLog Model

    Customer->>UI: Select Recipient, Amount & Method
    UI->>Customer: Prompt for 4-Digit Security PIN
    Customer->>UI: Submit PIN ("1234")
    UI->>Auth: POST /api/payments/authorize-pin (Bearer Token)
    
    critical Verify Authorization
        Auth->>Auth: Verify JWT signature & expiration
    end

    Auth->>Ctrl: Forward verified request (req.user)
    
    Ctrl->>WModel: Find User Wallet & Check Balance
    alt Wallet Frozen or Insufficient Balance
        Ctrl-->>UI: 400/403 Error Response
        Ctrl->>ErrModel: Create ErrorLog (INSUFFICIENT_FUNDS / FROZEN_WALLET)
        UI-->>Customer: Display Failure Dialog
    else Valid Balance & PIN Match
        Ctrl->>WModel: Deduct amount from mainBalance
        Ctrl->>TxnModel: Create Transaction (status: "success")
        TxnModel-->>Ctrl: Saved Transaction Doc with referenceCode
        Ctrl-->>UI: 200 OK { status: "SUCCESS", transactionId, referenceCode }
        UI-->>Customer: Display Success Screen & Digital Receipt
    end
```

---

## 8. COMPLETE REST API SPECIFICATION

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register customer account (forces role: customer) |
| `POST` | `/api/auth/login` | Public | Authenticate user & return signed JWT |
| `POST` | `/api/auth/verify-user` | Public | Check if user exists in MongoDB |
| `GET` | `/api/customers/me` | Bearer | Get logged-in user profile & bank accounts |
| `GET` | `/api/wallets/me` | Bearer | Get customer wallet balance & status |
| `GET` | `/api/pockets` | Bearer | List customer savings pockets |
| `POST` | `/api/pockets` | Bearer | Create a new savings pocket |
| `PUT` | `/api/pockets/:id` | Bearer | Update pocket name or target |
| `DELETE` | `/api/pockets/:id` | Bearer | Delete pocket & refund to wallet |
| `POST` | `/api/pockets/:id/deposit` | Bearer | Move funds from wallet into pocket |
| `POST` | `/api/pockets/:id/withdraw` | Bearer | Move funds from pocket back to wallet |
| `PATCH` | `/api/pockets/:id/lock` | Bearer | Toggle pocket lock guard |
| `GET` | `/api/receipts` | Bearer | List all saved beneficiaries |
| `POST` | `/api/receipts` | Bearer | Save new beneficiary |
| `PUT` | `/api/receipts/:id` | Bearer | Edit existing beneficiary |
| `DELETE` | `/api/receipts/:id` | Bearer | Remove beneficiary |
| `PATCH` | `/api/receipts/:id/favorite` | Bearer | Toggle favorite star status |
| `POST` | `/api/payments/authorize-pin` | Bearer | Authorize & execute funds transfer |
| `GET` | `/api/transactions` | Bearer | Paginated transaction history |
| `GET` | `/api/security/activity` | Bearer | Fetch DB sessions and security activity |
| `DELETE` | `/api/security/sessions/:id` | Bearer | Terminate specific device session |
| `DELETE` | `/api/security/sessions` | Bearer | Sign out all other sessions |
| `PUT` | `/api/security/settings` | Bearer | Update 2FA, Biometrics & Auto-lock |
| `PATCH` | `/api/security/freeze` | Bearer | Toggle instant wallet freeze |
| `GET` | `/api/admin/metrics` | Admin | Real-time platform metrics |
| `GET` | `/api/admin/pending` | Admin | List pending transactions |
| `GET` | `/api/admin/errors` | Admin | List high-severity error logs |

---

## 9. COMPLETE BACKEND SOURCE CODE

""")

        # Add backend files
        backend_files = [
            ("transiq-api/package.json", os.path.join(BACKEND_DIR, "package.json")),
            ("transiq-api/.env.example", os.path.join(BACKEND_DIR, ".env.example")),
            ("transiq-api/server.js", os.path.join(BACKEND_DIR, "server.js")),
            ("transiq-api/seed.js", os.path.join(BACKEND_DIR, "seed.js")),
            ("transiq-api/config/db.js", os.path.join(BACKEND_DIR, "config", "db.js")),
            ("transiq-api/middleware/auth.js", os.path.join(BACKEND_DIR, "middleware", "auth.js")),
            ("transiq-api/middleware/adminOnly.js", os.path.join(BACKEND_DIR, "middleware", "adminOnly.js")),
            ("transiq-api/middleware/validate.js", os.path.join(BACKEND_DIR, "middleware", "validate.js")),
            ("transiq-api/models/User.js", os.path.join(BACKEND_DIR, "models", "User.js")),
            ("transiq-api/models/Wallet.js", os.path.join(BACKEND_DIR, "models", "Wallet.js")),
            ("transiq-api/models/Pocket.js", os.path.join(BACKEND_DIR, "models", "Pocket.js")),
            ("transiq-api/models/Receipt.js", os.path.join(BACKEND_DIR, "models", "Receipt.js")),
            ("transiq-api/models/Transaction.js", os.path.join(BACKEND_DIR, "models", "Transaction.js")),
            ("transiq-api/models/ErrorLog.js", os.path.join(BACKEND_DIR, "models", "ErrorLog.js")),
            ("transiq-api/models/BankAccount.js", os.path.join(BACKEND_DIR, "models", "BankAccount.js")),
            ("transiq-api/controllers/adminController.js", os.path.join(BACKEND_DIR, "controllers", "adminController.js")),
            ("transiq-api/controllers/analyticsController.js", os.path.join(BACKEND_DIR, "controllers", "analyticsController.js")),
            ("transiq-api/controllers/customerController.js", os.path.join(BACKEND_DIR, "controllers", "customerController.js")),
            ("transiq-api/controllers/paymentController.js", os.path.join(BACKEND_DIR, "controllers", "paymentController.js")),
            ("transiq-api/controllers/pocketController.js", os.path.join(BACKEND_DIR, "controllers", "pocketController.js")),
            ("transiq-api/controllers/recipientController.js", os.path.join(BACKEND_DIR, "controllers", "recipientController.js")),
            ("transiq-api/controllers/securityController.js", os.path.join(BACKEND_DIR, "controllers", "securityController.js")),
            ("transiq-api/controllers/transactionController.js", os.path.join(BACKEND_DIR, "controllers", "transactionController.js")),
            ("transiq-api/controllers/walletController.js", os.path.join(BACKEND_DIR, "controllers", "walletController.js")),
            ("transiq-api/routes/auth.js", os.path.join(BACKEND_DIR, "routes", "auth.js")),
            ("transiq-api/routes/admin.js", os.path.join(BACKEND_DIR, "routes", "admin.js")),
            ("transiq-api/routes/analytics.js", os.path.join(BACKEND_DIR, "routes", "analytics.js")),
            ("transiq-api/routes/customers.js", os.path.join(BACKEND_DIR, "routes", "customers.js")),
            ("transiq-api/routes/payment.js", os.path.join(BACKEND_DIR, "routes", "payment.js")),
            ("transiq-api/routes/pockets.js", os.path.join(BACKEND_DIR, "routes", "pockets.js")),
            ("transiq-api/routes/recipients.js", os.path.join(BACKEND_DIR, "routes", "recipients.js")),
            ("transiq-api/routes/security.js", os.path.join(BACKEND_DIR, "routes", "security.js")),
            ("transiq-api/routes/transactions.js", os.path.join(BACKEND_DIR, "routes", "transactions.js")),
            ("transiq-api/routes/wallets.js", os.path.join(BACKEND_DIR, "routes", "wallets.js")),
        ]

        for rel_path, abs_path in backend_files:
            if os.path.exists(abs_path):
                ext = "json" if rel_path.endswith(".json") else "javascript"
                out.write(f"\n### File: `{rel_path}`\n```{ext}\n")
                out.write(read_file_safe(abs_path).strip())
                out.write("\n```\n")

        out.write("""\n---\n\n## 10. COMPLETE FRONTEND SOURCE CODE\n\n""")

        # Add frontend files
        frontend_files = [
            ("Transiq/package.json", os.path.join(FRONTEND_DIR, "package.json")),
            ("Transiq/vite.config.js", os.path.join(FRONTEND_DIR, "vite.config.js")),
            ("Transiq/index.html", os.path.join(FRONTEND_DIR, "index.html")),
            ("Transiq/src/main.jsx", os.path.join(FRONTEND_DIR, "src", "main.jsx")),
            ("Transiq/src/App.jsx", os.path.join(FRONTEND_DIR, "src", "App.jsx")),
            ("Transiq/src/App.css", os.path.join(FRONTEND_DIR, "src", "App.css")),
            ("Transiq/src/api/axiosInstance.js", os.path.join(FRONTEND_DIR, "src", "api", "axiosInstance.js")),
            ("Transiq/src/api/securityService.js", os.path.join(FRONTEND_DIR, "src", "api", "securityService.js")),
            ("Transiq/src/utils/validation.js", os.path.join(FRONTEND_DIR, "src", "utils", "validation.js")),
            ("Transiq/src/components/AdminSidebar.jsx", os.path.join(FRONTEND_DIR, "src", "components", "AdminSidebar.jsx")),
            ("Transiq/src/components/CustomerSidebar.jsx", os.path.join(FRONTEND_DIR, "src", "components", "CustomerSidebar.jsx")),
            ("Transiq/src/components/SidebarIcon.jsx", os.path.join(FRONTEND_DIR, "src", "components", "SidebarIcon.jsx")),
            ("Transiq/src/components/Sidebar.css", os.path.join(FRONTEND_DIR, "src", "components", "Sidebar.css")),
            ("Transiq/src/components/ModeSwitcher.jsx", os.path.join(FRONTEND_DIR, "src", "components", "ModeSwitcher.jsx")),
            ("Transiq/src/components/AuthVerificationModal.jsx", os.path.join(FRONTEND_DIR, "src", "components", "AuthVerificationModal.jsx")),
            ("Transiq/src/pages/LoginPage.jsx", os.path.join(FRONTEND_DIR, "src", "pages", "LoginPage.jsx")),
            ("Transiq/src/pages/AdminLoginPage.jsx", os.path.join(FRONTEND_DIR, "src", "pages", "AdminLoginPage.jsx")),
            ("Transiq/src/modules/01-customer/pages/CustomerDashboard.jsx", os.path.join(FRONTEND_DIR, "src", "modules", "01-customer", "pages", "CustomerDashboard.jsx")),
            ("Transiq/src/modules/01-customer/store/useCustomerStore.js", os.path.join(FRONTEND_DIR, "src", "modules", "01-customer", "store", "useCustomerStore.js")),
            ("Transiq/src/modules/01-customer/store/usePocketStore.js", os.path.join(FRONTEND_DIR, "src", "modules", "01-customer", "store", "usePocketStore.js")),
            ("Transiq/src/modules/02-recipients/pages/RecipientList.jsx", os.path.join(FRONTEND_DIR, "src", "modules", "02-recipients", "pages", "RecipientList.jsx")),
            ("Transiq/src/modules/02-recipients/store/useRecipientStore.js", os.path.join(FRONTEND_DIR, "src", "modules", "02-recipients", "store", "useRecipientStore.js")),
            ("Transiq/src/modules/03-initiation/pages/PaymentFlowContainer.jsx", os.path.join(FRONTEND_DIR, "src", "modules", "03-initiation", "pages", "PaymentFlowContainer.jsx")),
            ("Transiq/src/modules/03-initiation/pages/MyWalletPage.jsx", os.path.join(FRONTEND_DIR, "src", "modules", "03-initiation", "pages", "MyWalletPage.jsx")),
            ("Transiq/src/modules/04-transactions/pages/TransactionsPage.jsx", os.path.join(FRONTEND_DIR, "src", "modules", "04-transactions", "pages", "TransactionsPage.jsx")),
            ("Transiq/src/modules/04-transactions/pages/FinancialAnalysisPage.jsx", os.path.join(FRONTEND_DIR, "src", "modules", "04-transactions", "pages", "FinancialAnalysisPage.jsx")),
            ("Transiq/src/modules/04-transactions/pages/InsightsPage.jsx", os.path.join(FRONTEND_DIR, "src", "modules", "04-transactions", "pages", "InsightsPage.jsx")),
            ("Transiq/src/modules/04-transactions/store/transactionStore.js", os.path.join(FRONTEND_DIR, "src", "modules", "04-transactions", "store", "transactionStore.js")),
            ("Transiq/src/modules/05-security/pages/SecurityPage.jsx", os.path.join(FRONTEND_DIR, "src", "modules", "05-security", "pages", "SecurityPage.jsx")),
            ("Transiq/src/modules/05-security/store/useSecurityStore.js", os.path.join(FRONTEND_DIR, "src", "modules", "05-security", "store", "useSecurityStore.js")),
            ("Transiq/src/modules/06-logs/pages/AdminMonitoring.jsx", os.path.join(FRONTEND_DIR, "src", "modules", "06-logs", "pages", "AdminMonitoring.jsx")),
            ("Transiq/src/modules/06-logs/pages/TransactionHistory.jsx", os.path.join(FRONTEND_DIR, "src", "modules", "06-logs", "pages", "TransactionHistory.jsx")),
            ("Transiq/src/modules/06-logs/pages/PendingTransactionsPage.jsx", os.path.join(FRONTEND_DIR, "src", "modules", "06-logs", "pages", "PendingTransactionsPage.jsx")),
            ("Transiq/src/modules/06-logs/pages/ErrorLogsPage.jsx", os.path.join(FRONTEND_DIR, "src", "modules", "06-logs", "pages", "ErrorLogsPage.jsx")),
            ("Transiq/src/modules/06-logs/pages/SettingsPage.jsx", os.path.join(FRONTEND_DIR, "src", "modules", "06-logs", "pages", "SettingsPage.jsx")),
            ("Transiq/src/modules/06-logs/store/logsStore.js", os.path.join(FRONTEND_DIR, "src", "modules", "06-logs", "store", "logsStore.js")),
        ]

        for rel_path, abs_path in frontend_files:
            if os.path.exists(abs_path):
                ext = "json" if rel_path.endswith(".json") else ("css" if rel_path.endswith(".css") else ("html" if rel_path.endswith(".html") else "jsx"))
                out.write(f"\n### File: `{rel_path}`\n```{ext}\n")
                out.write(read_file_safe(abs_path).strip())
                out.write("\n```\n")

        out.write("""\n---\n\n## 11. EXECUTION, SEEDING, VERIFICATION & DEPLOYMENT PLAYBOOK

### 11.1 Prerequisites
* Node.js v18+ or v20+
* MongoDB Community Server running on `mongodb://localhost:27017`

### 11.2 Backend Startup
```bash
cd transiq-api
npm install
node seed.js
node server.js
```
* Backend runs on: `http://localhost:5000`

### 11.3 Frontend Startup
```bash
cd Transiq
npm install
npm run dev
```
* Frontend runs on: `http://localhost:5173`

### 11.4 Seeded Credentials
* **Customer Portal**: `arjun@paygate.com` / `Password@123`
* **Admin Console**: `admin@paygate.internal` / `Password@123`

""")

    print(f"SUCCESS: Blueprint generated at {OUT_FILE}")

if __name__ == "__main__":
    generate()
