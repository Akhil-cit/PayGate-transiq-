# PayGate - Project Structure & Architecture

## Project Overview
PayGate is a payment gateway system that enables a customer (remitter) to initiate a fund transfer to a recipient, manages the transaction lifecycle, communicates with an authorized banking system, and maintains transaction status and logs.

---

## 6-Module Architecture

### Module 1: Landing Page & Customer Management
**Purpose**: Entry point and customer profile management  
**Responsibilities**:
- Landing page UI
- Customer account creation/setup
- Customer profile management
- Account details display
- Payment activity overview

**Files**:
```
backend/modules/01-customer/
  ├── models/Customer.js
  ├── controllers/customerController.js
  ├── routes/customerRoutes.js
  ├── services/customerService.js
  └── validations/customerValidation.js

frontend/modules/01-customer/
  ├── pages/LandingPage.jsx
  ├── pages/CustomerDashboard.jsx
  ├── components/CustomerProfile.jsx
  ├── components/AccountDetails.jsx
  └── store/customerStore.js
```

---

### Module 2: Remitter & Recipient Management
**Purpose**: Manage payment participants and authorized accounts  
**Responsibilities**:
- Remitter (sender) profile management
- Recipient (receiver) profile management
- Authorized account management
- Payment destination selection
- Recipient directory/search

**Files**:
```
backend/modules/02-participants/
  ├── models/Remitter.js
  ├── models/Recipient.js
  ├── models/AuthorizedAccount.js
  ├── controllers/remitterController.js
  ├── controllers/recipientController.js
  ├── routes/participantRoutes.js
  ├── services/remitterService.js
  ├── services/recipientService.js
  └── validations/participantValidation.js

frontend/modules/02-participants/
  ├── pages/RemitterProfile.jsx
  ├── pages/RecipientList.jsx
  ├── components/RemitterForm.jsx
  ├── components/RecipientSelector.jsx
  ├── components/AuthorizedAccountList.jsx
  └── store/participantStore.js
```

---

### Module 3: Payment Initiation Module
**Purpose**: Start and validate payment requests  
**Responsibilities**:
- Payment initiation UI
- Fund amount input
- Recipient selection
- Payment request validation
- Request generation

**Files**:
```
backend/modules/03-initiation/
  ├── models/PaymentRequest.js
  ├── controllers/initiationController.js
  ├── routes/initiationRoutes.js
  ├── services/initiationService.js
  ├── validations/paymentValidation.js
  └── utils/paymentRequestGenerator.js

frontend/modules/03-initiation/
  ├── pages/InitiatePayment.jsx
  ├── components/PaymentForm.jsx
  ├── components/FundAmountInput.jsx
  ├── components/RecipientSelection.jsx
  ├── components/PaymentReview.jsx
  └── store/initiationStore.js
```

---

### Module 4: Transaction & Fund Processing Module ⭐ **CORE**
**Purpose**: The heart of PayGate - manage complete transaction lifecycle  
**Responsibilities**:
- Create transaction records
- Generate unique Transaction IDs
- Process fund transfer requests
- Track transaction status (pending/success/failure)
- Maintain transaction lifecycle
- Handle transaction state management

**Files**:
```
backend/modules/04-transaction/
  ├── models/Transaction.js
  ├── models/TransactionStatus.js
  ├── controllers/transactionController.js
  ├── routes/transactionRoutes.js
  ├── services/transactionService.js
  ├── services/transactionProcessing.js
  ├── validations/transactionValidation.js
  ├── utils/transactionIdGenerator.js
  ├── utils/transactionStateManager.js
  └── middleware/transactionMiddleware.js

frontend/modules/04-transaction/
  ├── pages/TransactionDetails.jsx
  ├── components/TransactionTracker.jsx
  ├── components/TransactionStatus.jsx
  ├── components/TransactionTimeline.jsx
  ├── store/transactionStore.js
  └── utils/transactionStatusFormatter.js
```

---

### Module 5: Banking & Fund Handling Module
**Purpose**: Interact with authorized banking system (simulated/limited)  
**Responsibilities**:
- Authorized account reference management
- Balance/fund validation
- Debit instruction generation
- Credit instruction generation
- Simulated bank response handling
- Fund transfer status tracking

**Files**:
```
backend/modules/05-banking/
  ├── models/BankAccount.js
  ├── models/FundInstruction.js
  ├── controllers/bankingController.js
  ├── routes/bankingRoutes.js
  ├── services/bankingService.js
  ├── services/fundValidation.js
  ├── services/bankSimulator.js
  ├── validations/bankingValidation.js
  └── utils/bankResponseHandler.js

frontend/modules/05-banking/
  ├── components/BankAccountSelector.jsx
  ├── components/BalanceDisplay.jsx
  ├── components/BankResponse.jsx
  └── store/bankingStore.js
```

---

### Module 6: Transaction Logs & Monitoring Module
**Purpose**: Audit, monitoring, and historical records  
**Responsibilities**:
- Transaction log records
- Payment history tracking
- Success/failure records
- Pending transaction monitoring
- Error logging
- Admin monitoring dashboard

**Files**:
```
backend/modules/06-logs/
  ├── models/TransactionLog.js
  ├── models/ErrorLog.js
  ├── controllers/logsController.js
  ├── routes/logsRoutes.js
  ├── services/loggingService.js
  ├── services/monitoringService.js
  └── utils/logFormatter.js

frontend/modules/06-logs/
  ├── pages/TransactionHistory.jsx
  ├── pages/AdminMonitoring.jsx
  ├── components/LogViewer.jsx
  ├── components/PaymentHistory.jsx
  ├── components/ErrorLogViewer.jsx
  ├── components/MonitoringDashboard.jsx
  └── store/logsStore.js
```

---

## Core Workflow Flow

```
Landing Page (Module 1)
     ↓
Customer Registration/Login (Module 1)
     ↓
Remitter Profile Setup (Module 2)
     ↓
Select Recipient (Module 2)
     ↓
Initiate Payment (Module 3)
  - Enter Fund Amount
  - Validate Details
  - Generate Request
     ↓
Create Transaction (Module 4) ⭐
  - Generate Transaction ID
  - Set Initial Status: PENDING
     ↓
Fund Processing (Module 4) ⭐
  - Validate Fund Transfer
  - Track Status
     ↓
Authorized Banking System (Module 5)
  - Validate Authorized Account
  - Execute Debit/Credit Instructions
  - Receive Bank Response
     ↓
Update Transaction Status (Module 4) ⭐
  - SUCCESS / FAILURE / PENDING
     ↓
Transaction Log Updated (Module 6)
  - Record in Database
  - Update Admin Dashboard
```

---

## Key Architecture Decisions

1. **Module Isolation**: Each module is independent with its own models, controllers, services
2. **Core Focus**: Module 4 (Transaction & Fund Processing) is the heart - all other modules feed into it
3. **Service Layer**: Business logic in services, not controllers
4. **Validation Layer**: Dedicated validation for each module
5. **Frontend/Backend Separation**: Clear separation with API boundaries
6. **Logging Throughout**: Every significant action logged to Module 6

---

## Technology Stack

**Backend**:
- Node.js + Express
- MongoDB (Mongoose ODM)
- JWT Authentication
- Express Validation

**Frontend**:
- React + Vite
- Zustand/Redux for state management
- Axios for API calls
- Tailwind CSS for styling

---

## Environment Setup

```
MERN PROJECT/
├── Transiq/                    (Frontend - React + Vite)
│   ├── src/
│   │   ├── modules/           (6 Modules)
│   │   ├── components/
│   │   ├── pages/
│   │   └── store/
│   └── package.json
│
└── transiq-api/               (Backend - Node + Express)
    ├── src/
    │   ├── modules/           (6 Modules)
    │   ├── config/
    │   ├── middleware/
    │   └── utils/
    └── package.json
```

---

## Next Steps

1. Create backend API structure (Node.js + Express)
2. Create MongoDB schemas for each module
3. Implement Module 4 first (core transaction processing)
4. Build API routes for Module 4
5. Create frontend components for each module
6. Integrate modules in correct workflow order
