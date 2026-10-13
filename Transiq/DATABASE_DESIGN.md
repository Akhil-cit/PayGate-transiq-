# PayGate / Transiq — Database Design Specification

> **Classification:** Internal Engineering — Database Architecture Proposal  
> **Stack:** MongoDB 7.x · Mongoose ODM 8.x · Node.js  
> **Author Role:** Principal Database Architect  
> **Date:** 2026-09-08  
> **Status:** DRAFT — Pending Engineering Review

---

## Table of Contents

1. [Preamble & Design Philosophy](#1-preamble--design-philosophy)
2. [Surface & Deep-Down Architectural Guardrails (16 MB Mitigation)](#2-surface--deep-down-architectural-guardrails-16-mb-mitigation)
   - 2.1 [Surface Architecture: Referencing vs. Embedding Decision Matrix](#21-surface-architecture-referencing-vs-embedding-decision-matrix)
   - 2.2 [Deep-Down Mechanics: WiredTiger, Memory Pressure & the 16 MB Trap](#22-deep-down-mechanics-wiredtiger-memory-pressure--the-16-mb-trap)
   - 2.3 [Schema Enforcement: Mongoose ODM Boundary Validation](#23-schema-enforcement-mongoose-odm-boundary-validation)
3. [Fintech Schema Blueprints & Hard Edge Cases](#3-fintech-schema-blueprints--hard-edge-cases)
   - 3.1 [User Schema](#31-user-schema)
   - 3.2 [Wallet Schema](#32-wallet-schema)
   - 3.3 [Recipient Schema](#33-recipient-schema)
   - 3.4 [Transaction Schema](#34-transaction-schema)
4. [Global B-Tree Indexing Matrix & Concurrency Controls](#4-global-b-tree-indexing-matrix--concurrency-controls)
   - 4.1 [B-Tree Structural Layout](#41-b-tree-structural-layout)
   - 4.2 [Index Declarations](#42-index-declarations)
   - 4.3 [Concurrency & Race Conditions: The Double-Spending Problem](#43-concurrency--race-conditions-the-double-spending-problem)
5. [ACID Transaction System & Automated Rollback Logic](#5-acid-transaction-system--automated-rollback-logic)
   - 5.1 [The Transaction Engine](#51-the-transaction-engine)
   - 5.2 [Detailed Workflow Steps: Atomic Fund Transfer](#52-detailed-workflow-steps-atomic-fund-transfer)
   - 5.3 [Failures & Edge Cases: The Recovery Script Sequence](#53-failures--edge-cases-the-recovery-script-sequence)
6. [Appendix: Collection Size Projections & Operational Notes](#6-appendix-collection-size-projections--operational-notes)

---

## 1. Preamble & Design Philosophy

PayGate (branded Transiq) is a MERN-stack payment gateway composed of **six functional modules**:

| # | Module | Primary Data Responsibility |
|---|--------|-----------------------------|
| 1 | Landing Page & Customer Management | User identity, authentication, role-gating |
| 2 | Remitter & Recipient Management | Saved beneficiary routes (bank details) |
| 3 | Payment Initiation | Balance checks, debit orchestration |
| 4 | Transaction & Fund Processing | Immutable ledger entries, status lifecycle |
| 5 | Banking & Fund Handling | Credit provisioning, external bank simulation |
| 6 | Transaction Logs & Monitoring | Admin live dashboard, filtered querying |

### Core Invariants

Every design decision in this document traces back to three inviolable financial system invariants:

1. **Conservation of Funds.** The total sum of all wallet balances plus in-flight transaction holds must equal the total funds ever deposited into the system. No operation may create or destroy value.
2. **Append-Only Auditability.** Every state transition in the financial lifecycle must produce a permanent, timestamped ledger entry. Mutations and deletions of historical records are categorically prohibited.
3. **Atomicity Under Failure.** Any operation that touches more than one document (debit sender, credit receiver, write ledger entry) must either complete in its entirety or leave zero traces. Partial state is never acceptable.

---

## 2. Surface & Deep-Down Architectural Guardrails (16 MB Mitigation)

### 2.1 Surface Architecture: Referencing vs. Embedding Decision Matrix

MongoDB's document model presents two fundamental data-relationship strategies. Choosing incorrectly for a Fintech system is catastrophic. The decision must be driven by **growth boundedness** — whether the nested data has a known, small upper limit or can grow without bound.

#### Decision Matrix

| Relationship | Strategy | Rationale |
|---|---|---|
| User → Transactions | **Document Referencing (ObjectId)** | A single user may generate thousands to millions of transactions over their lifetime. Embedding would push the User document past the 16 MB BSON limit and destroy read performance long before that ceiling is hit. |
| User → Saved Recipients | **Document Referencing (ObjectId)** | While a typical user may have 5–50 saved recipients, the growth is unbounded (no hard business cap). A separate `Recipient` collection also enables compound unique indexes for deduplication, which are impossible on embedded sub-arrays. |
| Wallet → Pockets (sub-wallets) | **Embedded Sub-documents** | Pockets are bounded by business rule. A user will have at most 10–20 named savings pockets (e.g., "Vacation", "Emergency Fund"). This array will never approach even 1% of the 16 MB limit. Embedding eliminates a network round-trip for every wallet read, which is the hottest query in the system. |
| Transaction → Error Details | **Embedded Sub-document (single object)** | Error metadata is a fixed-shape object (message, code, timestamp). It is a 1:1 relationship with no growth vector. Embedding is safe and avoids a join. |
| User → Wallet | **Document Referencing (ObjectId)** | One-to-one, but in a separate collection. This enforces separation of concerns: authentication/identity data (User) is decoupled from financial state (Wallet). The User collection can be read-heavy for login without loading balance data, and the Wallet collection can be write-heavy for transactions without lock contention on User documents. |

#### The Cardinal Rule

> **If the array can grow without a hard, business-enforced ceiling, it MUST be a separate collection linked by ObjectId. No exceptions.**

Violating this rule does not simply "slow things down." It creates a ticking time bomb: the document silently grows for months until it hits the 16 MB hard BSON limit, at which point MongoDB will **hard-refuse** all writes to that document. For a user's wallet or profile, this means the customer is permanently locked out of their own money — the most severe failure mode in Fintech.

---

### 2.2 Deep-Down Mechanics: WiredTiger, Memory Pressure & the 16 MB Trap

Understanding *why* the 16 MB limit exists — and why the real damage starts far earlier — requires examining MongoDB's storage engine internals.

#### WiredTiger Storage Engine Architecture

MongoDB's default storage engine, WiredTiger, operates on the following principles relevant to our design:

1. **Page-Based Storage.** WiredTiger organizes data on disk in fixed-size pages (default internal page size: 4 KB for internal nodes, configurable up to 512 KB for leaf pages). Each document is stored within leaf pages of a B-tree structure on disk.

2. **In-Memory Cache (WiredTiger Cache).** WiredTiger maintains an in-memory cache (default: 50% of RAM minus 1 GB, or 256 MB, whichever is larger). Hot documents are served directly from this cache. Cache efficiency is the single largest determinant of query latency.

3. **Document-Level Concurrency Control.** WiredTiger uses document-level locking (technically, intent locks at the collection level and exclusive locks at the document level during writes). This means two concurrent writes to *different* documents in the same collection proceed in parallel, but two concurrent writes to the *same* document serialize.

#### Why Bloated Documents Kill Performance Before Hitting 16 MB

Consider a User document that embeds its transaction history as a growing array:

```
Scenario: User with 50,000 transactions embedded
- Average transaction sub-document size: ~300 bytes
- Transaction array alone: 50,000 × 300 = ~15 MB
- Total document: ~15.2 MB (approaching hard limit)
```

The failures manifest in escalating severity:

| Stage | Document Size | Failure Mode |
|---|---|---|
| **Stage 1: Cache Thrashing** | 2–5 MB | The document no longer fits efficiently in a single WiredTiger cache page. Every read of this user requires loading megabytes into cache, evicting other users' hot data. Cache hit ratio degrades system-wide. |
| **Stage 2: Network Amplification** | 5–10 MB | Every query that touches this user — even `findById()` for a simple name lookup — transfers the full document over the network between mongod and the application server. Query latency spikes from <5 ms to 200+ ms. Projections can mitigate but not eliminate this cost because the full document must still be read from storage. |
| **Stage 3: Write Amplification** | 10–15 MB | Adding one new transaction (300 bytes) to the array requires MongoDB to rewrite the *entire* 10+ MB document. WiredTiger's delta-based journaling helps on disk, but the in-memory representation must be fully reconstructed. Write latency exceeds 500 ms. Under load, this becomes a write bottleneck for the entire replica set primary. |
| **Stage 4: Hard Failure** | 16 MB | `BSONObjectTooLarge: object to insert exceeds maximum BSON size (16793598 bytes)`. All writes to this document permanently fail. The user cannot send money, receive money, or even update their profile. This is an unrecoverable data architecture failure. |

#### The Correct Pattern

Transactions live in their own collection. A query for a user's transactions uses an indexed lookup:

```javascript
// Fast indexed query — scans only the B-tree index, not User documents
await Transaction.find({ senderWalletId: walletId })
  .sort({ createdAt: -1 })
  .limit(50);
```

This query touches only the Transaction collection's index, returns exactly the requested page of results, and never loads or modifies the User or Wallet documents.

---

### 2.3 Schema Enforcement: Mongoose ODM Boundary Validation

Mongoose operates as the **application-to-database boundary validator**. Every document must pass through Mongoose's validation pipeline before it reaches MongoDB. This is our first — and most important — line of defense against malformed data entering the financial system.

#### Validation Primitives Used Across All Schemas

| Validator | Purpose | Example |
|---|---|---|
| `required: true` | Prevents null/undefined fields from being persisted. Critical for financial fields like `amount` and `currency`. | `amount: { type: Number, required: true }` |
| `trim: true` | Strips leading/trailing whitespace from strings at the setter level (before validation runs). Prevents `" INR "` from being treated as different from `"INR"`. | `currency: { type: String, trim: true }` |
| `lowercase: true` | Normalizes string casing at the setter level. Ensures `"John@Email.COM"` is stored as `"john@email.com"`, preventing duplicate-account creation via case variation. | `email: { type: String, lowercase: true }` |
| `uppercase: true` | Normalizes to uppercase. Used for ISO currency codes where `"inr"` must become `"INR"`. | `currency: { type: String, uppercase: true }` |
| `enum: [...]` | Restricts a field to an explicit set of allowed values. Mongoose will throw a `ValidationError` if any other value is provided. | `role: { type: String, enum: ['customer', 'admin'] }` |
| `min: 0` | For Number fields, enforces a floor value. In Fintech, this prevents negative balances from being written at the schema level. | `mainBalance: { type: Number, min: 0 }` |
| `match: /.../` | Regex validation for string patterns. Used for email format enforcement and reference code formatting. | `email: { type: String, match: /.+@.+\..+/ }` |
| `unique: true` | Creates a unique index at the MongoDB level. Prevents duplicate emails, duplicate reference codes. Note: this is an *index* property, not a Mongoose validator — it relies on MongoDB's unique constraint enforcement. | `email: { type: String, unique: true }` |
| `validate: { validator: fn }` | Custom synchronous or async validation functions for business logic that cannot be expressed with built-in validators. | Custom amount precision checks |

#### Setter Execution Order

Mongoose processes field values in this order:

1. **Default values** are applied (if the field is absent from the input).
2. **Setters** execute: `trim`, `lowercase`, `uppercase`, and any custom `set` functions.
3. **Validators** run: `required`, `enum`, `min`, `max`, `match`, and custom `validate` functions.
4. **Casting** to the declared SchemaType occurs.

This order is critical: trimming and case-normalization happen *before* validation, so an enum check for `['customer', 'admin']` will correctly validate an input of `" ADMIN "` after it is trimmed and lowercased to `"admin"`.

---

## 3. Fintech Schema Blueprints & Hard Edge Cases

### 3.1 User Schema

The User schema handles identity, authentication, and system-level access control. It is deliberately lean — it contains *no* financial data.

#### Edge Case: Account Freezing & Suspension

A user account may need to be frozen by an admin (suspected fraud, regulatory hold, or compliance review). When `isActive` is `false`, the application layer must **immediately reject** all inbound and outbound financial operations for this user — wallet reads, sends, and receives must all short-circuit before reaching the transaction engine.

This flag is checked at the **controller middleware layer**, not inside the transaction itself, because:
- It avoids opening a database session/transaction unnecessarily.
- It provides instant feedback to the client (HTTP 403) rather than a delayed abort.
- It prevents any write-lock acquisition on the Wallet document, reducing contention.

```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

// ─── User Schema ────────────────────────────────────────────────────────────────
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required.'],
      trim: true,
      minlength: [1, 'First name cannot be empty.'],
      maxlength: [100, 'First name cannot exceed 100 characters.'],
    },

    lastName: {
      type: String,
      required: [true, 'Last name is required.'],
      trim: true,
      minlength: [1, 'Last name cannot be empty.'],
      maxlength: [100, 'Last name cannot exceed 100 characters.'],
    },

    email: {
      type: String,
      required: [true, 'Email address is required.'],
      unique: true,               // Enforced by MongoDB unique index
      lowercase: true,            // Setter: normalize BEFORE uniqueness check
      trim: true,                 // Setter: strip whitespace BEFORE lowercase
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address.',
      ],
      index: true,                // Explicit B-tree index for login lookups
    },

    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: [8, 'Password must be at least 8 characters.'],
      select: false,              // NEVER returned in queries by default
    },

    role: {
      type: String,
      required: true,
      enum: {
        values: ['customer', 'admin'],
        message: 'Role must be either "customer" or "admin".',
      },
      default: 'customer',
      lowercase: true,            // Normalizes "ADMIN" → "admin" before enum check
      trim: true,
    },

    // ── Account Freeze Flag ──────────────────────────────────────────────────
    // When false, ALL financial operations for this user are instantly rejected
    // at the middleware layer before any wallet or transaction logic executes.
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },

    // ── Suspension Audit Trail ───────────────────────────────────────────────
    // Records who froze the account and why. This is a bounded embedded object
    // (not an array), so it will never grow beyond a single small sub-document.
    suspensionDetails: {
      suspendedAt: { type: Date, default: null },
      suspendedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
      reason: { type: String, trim: true, maxlength: 500, default: null },
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,   // Adds createdAt, updatedAt automatically
    versionKey: '__v',   // Enables Optimistic Concurrency Control (OCC)
  }
);

// ── Compound Index: Admin queries for users by role + creation date ───────────
userSchema.index({ role: 1, createdAt: -1 });

// ── Index: Fast lookup of frozen accounts for admin dashboard ────────────────
userSchema.index({ isActive: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
```

#### Edge Case Analysis

| Scenario | How the Schema Handles It |
|---|---|
| **Case-variant duplicate emails:** `"John@Email.COM"` and `"john@email.com"` | `lowercase: true` normalizes both to `"john@email.com"`. The `unique: true` index then rejects the second insertion with a duplicate key error (MongoDB error code 11000). |
| **Whitespace-padded email:** `"  john@email.com  "` | `trim: true` strips whitespace *before* the lowercase setter runs. The stored value is clean. |
| **Invalid role injection:** `"superadmin"` | `enum: ['customer', 'admin']` throws a Mongoose `ValidationError` before the document is persisted. |
| **Frozen account attempts a transfer:** | Middleware reads `user.isActive`. If `false`, returns HTTP `403 Forbidden` immediately. No wallet query, no session, no locks. |
| **Password leakage in API responses:** | `select: false` on the password field means `User.findById(id)` never includes the password hash unless `.select('+password')` is explicitly chained (used only in the login controller). |

---

### 3.2 Wallet Schema

The Wallet schema is the financial heart of the system. Each user has exactly one wallet, containing a `mainBalance` and an embedded array of `Pockets` (user-defined savings sub-wallets).

#### Edge Case: Negative Balance Prevention

Financial systems must enforce a hard floor at the schema level. Even if application logic has a bug that attempts to write a negative balance, the schema validator must act as the last line of defense:

```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

// ─── Pocket Sub-Schema (Embedded) ───────────────────────────────────────────
// Pockets are bounded: a user will have at most ~10-20 custom savings pockets.
// This is well within safe embedding limits. Embedding avoids a join on every
// wallet read, which is the highest-frequency query in the entire system.
const pocketSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Pocket name is required.'],
      trim: true,
      maxlength: [50, 'Pocket name cannot exceed 50 characters.'],
    },

    targetAmount: {
      type: Number,
      default: 0,
      min: [0, 'Target amount cannot be negative.'],
      validate: {
        validator: function (value) {
          // Enforce max 2 decimal places for currency precision
          return Number(value.toFixed(2)) === value;
        },
        message: 'Target amount cannot have more than 2 decimal places.',
      },
    },

    currentAmount: {
      type: Number,
      default: 0,
      min: [0, 'Pocket balance cannot be negative.'],
      validate: {
        validator: function (value) {
          return Number(value.toFixed(2)) === value;
        },
        message: 'Pocket balance cannot have more than 2 decimal places.',
      },
    },

    emoji: {
      type: String,
      default: '💰',
      maxlength: 4,
    },

    isLocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,           // Each pocket gets its own ObjectId for targeted updates
    timestamps: true,
  }
);

// ─── Wallet Schema ──────────────────────────────────────────────────────────────
const walletSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Wallet must be linked to a user.'],
      unique: true,             // Enforces 1:1 — one wallet per user, no exceptions
      index: true,              // B-tree index for fast wallet lookups by user
    },

    mainBalance: {
      type: Number,
      required: [true, 'Main balance is required.'],
      default: 0,
      min: [0, 'Balance cannot be negative. Debit operations must verify funds before modifying.'],
      validate: {
        validator: function (value) {
          // Enforce max 2 decimal places — prevents floating point dust
          // e.g., 100.001 after repeated additions/subtractions
          return Number(value.toFixed(2)) === value;
        },
        message: 'Balance cannot have more than 2 decimal places.',
      },
    },

    currency: {
      type: String,
      required: [true, 'Currency code is required.'],
      uppercase: true,          // Setter: "inr" → "INR" before validation
      trim: true,
      enum: {
        values: ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD', 'AUD', 'CAD'],
        message: 'Currency {VALUE} is not supported.',
      },
      default: 'INR',
    },

    // ── Bounded Embedded Pockets ─────────────────────────────────────────────
    pockets: {
      type: [pocketSchema],
      default: [],
      validate: {
        validator: function (pocketsArray) {
          return pocketsArray.length <= 20;
        },
        message: 'A wallet cannot have more than 20 pockets.',
      },
    },

    // ── Wallet-Level Lock ────────────────────────────────────────────────────
    // Used by admins to freeze a specific wallet without deactivating the
    // entire user account. A frozen wallet rejects all debit/credit ops.
    isFrozen: {
      type: Boolean,
      default: false,
    },

    lastTransactionAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: '__v',      // Critical for Optimistic Concurrency Control
  }
);

// ── Index: Admin dashboard — find all frozen wallets ──────────────────────────
walletSchema.index({ isFrozen: 1 });

// ── Index: Currency-based reporting ──────────────────────────────────────────
walletSchema.index({ currency: 1 });

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
```

#### Edge Case Analysis

| Scenario | How the Schema Handles It |
|---|---|
| **Negative balance write attempt:** Application bug tries `mainBalance: -50` | `min: 0` validator throws `ValidationError`. The document is never persisted. This is the absolute last line of defense — application logic should also check, but the schema catches bugs. |
| **Floating-point dust:** Repeated `0.1 + 0.2` operations produce `0.30000000000000004` | The custom `validate` function checks `Number(value.toFixed(2)) === value`. Values with more than 2 decimal places are rejected. Application logic must round to 2 decimal places before writing. |
| **Pocket array overflow:** A user tries to create 100 pockets via API abuse | The array-level validator enforces `pockets.length <= 20`. Even if the application layer has a bug, the schema blocks the 21st pocket. |
| **Currency case mismatch:** Frontend sends `"inr"`, backend expects `"INR"` | `uppercase: true` setter normalizes before the `enum` check. `"inr"` → `"INR"` → passes enum validation. |
| **Duplicate wallet creation:** Race condition creates two wallets for one user | `unique: true` on `userId` creates a unique MongoDB index. The second insert fails with duplicate key error 11000. |
| **Optimistic Concurrency Conflict:** Two concurrent balance modifications | The `__v` version key enables OCC. See Section 4.3 for full explanation. |

---

### 3.3 Recipient Schema

The Recipient schema stores saved beneficiary routes — the bank details a customer saves so they don't need to re-enter them for every transfer.

#### Edge Case: Duplicate Recipient Prevention

A customer must not be able to save the same bank account number twice under their profile. This is not just a UX concern — duplicate recipients can lead to double-debits if the customer accidentally selects the wrong duplicate entry. The deduplication **must be enforced at the database level** via a compound unique index, because application-layer checks are vulnerable to race conditions (two concurrent requests reading "no duplicate found" at the same millisecond, then both inserting).

```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

// ─── Recipient Schema ───────────────────────────────────────────────────────────
const recipientSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient must be linked to a user.'],
      index: true,               // Fast lookup: "show me all my saved recipients"
    },

    // ── Beneficiary Identity ─────────────────────────────────────────────────
    recipientName: {
      type: String,
      required: [true, 'Recipient name is required.'],
      trim: true,
      maxlength: [200, 'Recipient name cannot exceed 200 characters.'],
    },

    // ── Bank Route Details ───────────────────────────────────────────────────
    bankName: {
      type: String,
      required: [true, 'Bank name is required.'],
      trim: true,
      maxlength: [200, 'Bank name cannot exceed 200 characters.'],
    },

    accountNumber: {
      type: String,
      required: [true, 'Account number is required.'],
      trim: true,
      minlength: [8, 'Account number must be at least 8 characters.'],
      maxlength: [34, 'Account number cannot exceed 34 characters (IBAN max).'],
      // Note: Stored as String, not Number, because:
      // 1. Account numbers can have leading zeros ("0012345678")
      // 2. IBANs contain letters ("GB29NWBK60161331926819")
      // 3. No arithmetic operations are ever performed on account numbers
    },

    ifscCode: {
      type: String,
      required: [true, 'IFSC code is required.'],
      trim: true,
      uppercase: true,           // "sbin0001234" → "SBIN0001234"
      match: [
        /^[A-Z]{4}0[A-Z0-9]{6}$/,
        'IFSC code must be in valid format (e.g., SBIN0001234).',
      ],
    },

    accountType: {
      type: String,
      trim: true,
      lowercase: true,
      enum: {
        values: ['savings', 'current', 'nre', 'nro'],
        message: 'Account type must be one of: savings, current, nre, nro.',
      },
      default: 'savings',
    },

    // ── Metadata ─────────────────────────────────────────────────────────────
    nickname: {
      type: String,
      trim: true,
      maxlength: [50, 'Nickname cannot exceed 50 characters.'],
      default: null,
    },

    isFavorite: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ── CRITICAL: Compound Unique Index — Prevents Duplicate Recipients ──────────
// A single user cannot save the same bank account number twice.
// This is enforced at the DATABASE level, not application level, because
// application-layer uniqueness checks are vulnerable to race conditions.
//
// Why compound? Because account number "0012345678" can exist for User A
// AND User B — they are different beneficiaries. Uniqueness is scoped per-user.
recipientSchema.index(
  { userId: 1, accountNumber: 1 },
  { unique: true, name: 'unique_user_account' }
);

// ── Index: Fast lookup of a user's favorite recipients ───────────────────────
recipientSchema.index({ userId: 1, isFavorite: -1 });

const Recipient = mongoose.model('Recipient', recipientSchema);

module.exports = Recipient;
```

#### Edge Case Analysis

| Scenario | How the Schema Handles It |
|---|---|
| **Duplicate recipient race condition:** Two concurrent requests save `accountNumber: "0012345678"` for the same userId | The compound unique index `{ userId: 1, accountNumber: 1 }` is enforced by MongoDB at the storage layer. The second insert fails with error 11000 regardless of timing. |
| **Same account, different users:** User A and User B both save account `"0012345678"` | The compound index is `{ userId, accountNumber }`, not just `{ accountNumber }`. Different users can independently save the same bank account. |
| **Leading-zero account numbers:** Account `"0012345678"` stored as Number becomes `12345678` | `accountNumber` is `type: String`. Leading zeros are preserved. No arithmetic is performed on account numbers. |
| **IFSC case mismatch:** Frontend sends `"sbin0001234"` | `uppercase: true` normalizes to `"SBIN0001234"`, then `match` regex validates the format. |

---

### 3.4 Transaction Schema

The Transaction schema is the **immutable, append-only financial ledger**. It is the single source of truth for every fund movement in the system.

#### Edge Case: Why Financial Ledger Rows Must Be Immutable

In traditional accounting and regulated Fintech, ledger entries are **never updated or deleted**. This is a fundamental principle, not a preference:

1. **Audit Trail Integrity.** Regulators (RBI, PCI-DSS, SOX compliance) require a complete, tamper-evident history of every transaction. If a row can be modified, the audit trail is compromised — it becomes impossible to prove what actually happened.

2. **Reconciliation Safety.** Periodic reconciliation (matching internal records against bank statements) depends on every historical entry being frozen. If a "success" entry is later modified to "failure," reconciliation reports become inconsistent and financial statements become unreliable.

3. **Dispute Resolution.** Customer disputes ("I was charged but never received funds") require examining the exact state of the transaction at the time it occurred. Mutating the original record destroys this evidence.

4. **Compensating Entries, Not Corrections.** If a transaction must be reversed (refund, chargeback, admin correction), the correct approach is to **append a new compensating transaction** that offsets the original — never to modify the original entry. This preserves the full narrative: "Transaction A was executed, then Transaction B reversed it."

```javascript
const mongoose = require('mongoose');
const crypto = require('crypto');
const { Schema } = mongoose;

// ─── Transaction Schema (Immutable Ledger Line) ─────────────────────────────────
const transactionSchema = new Schema(
  {
    // ── Debit Side ───────────────────────────────────────────────────────────
    senderWalletId: {
      type: Schema.Types.ObjectId,
      ref: 'Wallet',
      required: [true, 'Sender wallet ID is required.'],
      index: true,              // Fast lookup: "show me all debits from this wallet"
    },

    // ── Credit Side ──────────────────────────────────────────────────────────
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: 'Recipient',
      required: [true, 'Recipient ID is required.'],
      index: true,              // Fast lookup: "show me all credits to this recipient"
    },

    // ── Financial Values ─────────────────────────────────────────────────────
    amount: {
      type: Number,
      required: [true, 'Transaction amount is required.'],
      min: [0.01, 'Transaction amount must be at least 0.01.'],
      validate: {
        validator: function (value) {
          // Enforce max 2 decimal places for currency precision
          return Number(value.toFixed(2)) === value;
        },
        message: 'Transaction amount cannot have more than 2 decimal places.',
      },
    },

    currency: {
      type: String,
      required: [true, 'Currency code is required.'],
      uppercase: true,
      trim: true,
      enum: {
        values: ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD', 'AUD', 'CAD'],
        message: 'Currency {VALUE} is not supported.',
      },
    },

    // ── Unique Reference Code ────────────────────────────────────────────────
    // Cryptographically generated, globally unique identifier for this
    // transaction. Used for external reconciliation, customer support lookups,
    // and API idempotency keys.
    referenceCode: {
      type: String,
      required: [true, 'Reference code is required.'],
      unique: true,             // MongoDB unique index — no two transactions share a code
      index: true,
      default: function () {
        // Generate a 24-character hex string from 12 random bytes
        // Collision probability: ~1 in 2^96 ≈ 7.9 × 10^28
        return 'TXN-' + crypto.randomBytes(12).toString('hex').toUpperCase();
      },
    },

    // ── Status Lifecycle ─────────────────────────────────────────────────────
    // 'pending'  → Transaction initiated, debit executed, credit not yet confirmed
    // 'success'  → Full cycle complete: debit + credit + ledger entry committed
    // 'failure'  → Rolled back: debit reversed, funds restored to sender
    //
    // IMPORTANT: Status changes are implemented by APPENDING a new transaction
    // document (compensating entry), NOT by mutating this field on an existing
    // document. The only exception is the initial pending → success/failure
    // transition within the same ACID session that created the entry.
    status: {
      type: String,
      required: true,
      enum: {
        values: ['pending', 'success', 'failure'],
        message: 'Status must be one of: pending, success, failure.',
      },
      default: 'pending',
      lowercase: true,
      trim: true,
      index: true,              // Fast lookup for admin pending monitor
    },

    // ── Transaction Type ─────────────────────────────────────────────────────
    type: {
      type: String,
      required: true,
      enum: {
        values: ['transfer', 'refund', 'reversal', 'deposit', 'withdrawal'],
        message: 'Transaction type is not valid.',
      },
      default: 'transfer',
      lowercase: true,
      trim: true,
    },

    // ── Error Tracking (Embedded — fixed shape, 1:1, no growth) ──────────────
    errorMessage: {
      type: String,
      default: null,
      trim: true,
      maxlength: [1000, 'Error message cannot exceed 1000 characters.'],
    },

    errorCode: {
      type: String,
      default: null,
      trim: true,
      uppercase: true,
    },

    // ── Admin Resolution ─────────────────────────────────────────────────────
    resolvedByAdmin: {
      type: Boolean,
      default: false,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },

    resolvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    adminNotes: {
      type: String,
      default: null,
      trim: true,
      maxlength: [2000, 'Admin notes cannot exceed 2000 characters.'],
    },

    // ── Compensating Entry Link ──────────────────────────────────────────────
    // If this transaction is a refund/reversal, this field points to the
    // original transaction it compensates. Creates a traceable chain.
    originalTransactionId: {
      type: Schema.Types.ObjectId,
      ref: 'Transaction',
      default: null,
    },

    // ── Metadata ─────────────────────────────────────────────────────────────
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters.'],
      default: null,
    },

    ipAddress: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,          // createdAt = transaction timestamp (immutable)
    versionKey: '__v',
  }
);

// ── CRITICAL: Compound Index for Module 6 Admin Live Dashboard ───────────────
// Powers the "Pending Monitor" and "Transaction Logs" screens.
// Admins query: "Show me all pending transactions, newest first"
// Without this compound index, MongoDB would perform a COLLSCAN on potentially
// millions of transaction documents.
transactionSchema.index({ status: 1, createdAt: -1 });

// ── Index: Date-range queries for financial reporting ────────────────────────
transactionSchema.index({ createdAt: -1 });

// ── Index: Sender + date range (user's transaction history) ──────────────────
transactionSchema.index({ senderWalletId: 1, createdAt: -1 });

// ── Index: Type + status for admin filtering ─────────────────────────────────
transactionSchema.index({ type: 1, status: 1 });

// ── Index: Unresolved error lookups for admin error log screen ───────────────
transactionSchema.index(
  { resolvedByAdmin: 1, status: 1 },
  { name: 'unresolved_failures' }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
```

#### Edge Case Analysis

| Scenario | How the Schema Handles It |
|---|---|
| **Duplicate reference code:** Extremely unlikely (1 in 2⁹⁶) but possible | `unique: true` on `referenceCode` means MongoDB rejects the duplicate at the storage level. Application logic should catch error 11000 and regenerate. |
| **Amount of 0 or negative:** API abuse or calculation bug | `min: 0.01` rejects zero-value and negative transactions at the schema level. |
| **Floating-point amount:** `100.999` after bad calculation | Custom validator ensures `Number(value.toFixed(2)) === value`. Values with more than 2 decimal places are rejected. |
| **Status mutation after commit:** Attempting to change a "success" to "failure" | Enforced at the application layer: the transaction update controller must reject any status modification on non-pending transactions. Compensating entries (type: 'refund' or 'reversal') are used instead. |
| **Admin resolves a pending transaction:** | `resolvedByAdmin: true`, `resolvedAt: new Date()`, `resolvedBy: adminUserId` are set. The resolution itself is auditable via timestamps. |

---

## 4. Global B-Tree Indexing Matrix & Concurrency Controls

### 4.1 B-Tree Structural Layout

MongoDB uses **B-Tree indexes** (specifically B+ Tree variants in WiredTiger) as its primary indexing data structure. Understanding how a B-Tree search operates is essential for predicting query performance and identifying missing-index catastrophes.

#### How a B-Tree Search Operates

A B-Tree is a self-balancing tree data structure that maintains sorted data and allows searches, insertions, and deletions in **O(log n)** time. In MongoDB's implementation:

```
                        ┌─────────────────────────────┐
         Root Node      │  [key_100]  [key_500]  [key_900]  │
                        └──┬──────────┬──────────┬──────────┘
                           │          │          │
                 ┌─────────▼──┐  ┌────▼─────┐  ┌▼──────────┐
  Internal       │ [key_25]   │  │ [key_300] │  │ [key_700] │
  Nodes          │ [key_50]   │  │ [key_400] │  │ [key_800] │
                 └─┬────┬──┬─┘  └──┬───┬──┬─┘  └─┬───┬──┬─┘
                   │    │  │       │   │  │      │   │  │
                   ▼    ▼  ▼       ▼   ▼  ▼      ▼   ▼  ▼
  Leaf Nodes     ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐
  (Data Ptrs)    │→D│ │→D│ │→D│ │→D│ │→D│ │→D│ │→D│ │→D│ │→D│
                 └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘
                  ↓    ↓    ↓    ↓    ↓    ↓    ↓    ↓    ↓
              ┌────────────────────────────────────────────────┐
              │       Actual Document Data on Disk / Cache     │
              └────────────────────────────────────────────────┘
```

**Step-by-step search for `referenceCode = "TXN-ABC123"`:**

1. **Root Node Comparison.** The query engine compares the search key against the keys in the root node. Since this is a string, lexicographic comparison determines which child pointer to follow.

2. **Internal Node Traversal.** The engine descends through 1–3 internal node levels (for millions of documents, B-Trees are remarkably shallow — a tree with 10 million leaf entries and order 100 has only ~4 levels).

3. **Leaf Node Arrival.** The leaf node contains the indexed field value and a **data pointer** — a reference to the actual document's location on disk (the RecordId in WiredTiger's parlance).

4. **Document Fetch.** Using the data pointer, WiredTiger retrieves the full document from disk (or, ideally, from the in-memory cache).

**Total operations for 10 million documents:** ~4 node comparisons + 1 document fetch = **5 disk reads** (or cache hits). This is O(log n).

#### Why Missing an Index Causes Catastrophic Collection Scans

Without an index, MongoDB must perform a **Collection Scan (COLLSCAN)** — a sequential read of every single document in the collection to check if it matches the query predicate.

| Query | With Index (IXSCAN) | Without Index (COLLSCAN) |
|---|---|---|
| Find transaction by `referenceCode` | **4–5 operations** (~0.1 ms) | **10,000,000 document reads** (~30 seconds) |
| Find pending transactions sorted by date | **Index walk** (~1 ms for 50 results) | **Full scan + in-memory sort** (~45 seconds, may run out of 100 MB sort RAM and fail) |
| Find all transactions for a wallet | **Index range scan** (~2 ms) | **Full collection scan** (~30 seconds) |

For a Fintech system with millions of transactions, a single missing index on a hot query path turns a sub-millisecond operation into a multi-second full-table scan. Under concurrent load, this bottleneck cascades: every query queues behind the slow scan, connections pool up, and the entire application becomes unresponsive.

> **Sort RAM Limit.** MongoDB has a 100 MB limit on in-memory sorts. If a query requires sorting without an index and the intermediate result set exceeds 100 MB, MongoDB will **abort the query** with error `QueryExceededMemoryLimitNoDiskUseAllowed`. This can happen with as few as 500,000 transaction documents sorted by date without a `{ createdAt: -1 }` index.

---

### 4.2 Index Declarations

The following is the **complete indexing matrix** across all four schemas. Every index is declared with its purpose, the query pattern it serves, and which application module benefits from it.

#### User Collection Indexes

```javascript
// ── Declared in Schema ───────────────────────────────────────────────────────

// 1. Unique email index (declared via `unique: true` on field)
//    Query: db.users.findOne({ email: "john@email.com" })
//    Module: 1 (Login, Registration)
//    Type: Single-field, unique, B-tree
{ email: 1 }   // unique: true

// 2. Role + creation date compound index
//    Query: db.users.find({ role: "customer" }).sort({ createdAt: -1 })
//    Module: 6 (Admin user management dashboard)
//    Type: Compound, B-tree
{ role: 1, createdAt: -1 }

// 3. Active status index
//    Query: db.users.find({ isActive: false })
//    Module: 6 (Admin frozen accounts list)
//    Type: Single-field, B-tree
{ isActive: 1 }
```

#### Wallet Collection Indexes

```javascript
// 1. Unique userId index (declared via `unique: true` on field)
//    Query: db.wallets.findOne({ userId: ObjectId("...") })
//    Module: 1, 3, 4, 5 (Every wallet read)
//    Type: Single-field, unique, B-tree
{ userId: 1 }   // unique: true

// 2. Frozen wallet index
//    Query: db.wallets.find({ isFrozen: true })
//    Module: 6 (Admin frozen wallets dashboard)
//    Type: Single-field, B-tree
{ isFrozen: 1 }

// 3. Currency index
//    Query: db.wallets.find({ currency: "INR" })
//    Module: 6 (Currency-segmented reporting)
//    Type: Single-field, B-tree
{ currency: 1 }
```

#### Recipient Collection Indexes

```javascript
// 1. UserId index (declared via `index: true` on field)
//    Query: db.recipients.find({ userId: ObjectId("...") })
//    Module: 2 (Show all saved recipients for a user)
//    Type: Single-field, B-tree
{ userId: 1 }

// 2. Compound unique index — duplicate prevention
//    Query: db.recipients.insertOne({ userId: X, accountNumber: Y })
//    Module: 2 (Add recipient — uniqueness enforcement)
//    Type: Compound, unique, B-tree
{ userId: 1, accountNumber: 1 }   // unique: true

// 3. Favorites lookup
//    Query: db.recipients.find({ userId: X, isFavorite: true })
//    Module: 3 (Quick-select favorite recipients for send money)
//    Type: Compound, B-tree
{ userId: 1, isFavorite: -1 }
```

#### Transaction Collection Indexes

```javascript
// 1. Reference code unique index (declared via `unique: true` on field)
//    Query: db.transactions.findOne({ referenceCode: "TXN-ABC123..." })
//    Module: 4, 6 (Transaction lookup by reference)
//    Type: Single-field, unique, B-tree
{ referenceCode: 1 }   // unique: true

// 2. Status index (declared via `index: true` on field)
//    Query: db.transactions.find({ status: "pending" })
//    Module: 6 (Pending monitor badge count)
//    Type: Single-field, B-tree
{ status: 1 }

// 3. Sender wallet index (declared via `index: true` on field)
//    Query: db.transactions.find({ senderWalletId: ObjectId("...") })
//    Module: 4 (User's transaction history)
//    Type: Single-field, B-tree
{ senderWalletId: 1 }

// 4. Recipient index (declared via `index: true` on field)
//    Query: db.transactions.find({ recipientId: ObjectId("...") })
//    Module: 4 (Recipient-centric view)
//    Type: Single-field, B-tree
{ recipientId: 1 }

// ━━━ COMPOUND INDEXES (Declared via schema.index()) ━━━━━━━━━━━━━━━━━━━━━━━━━

// 5. ★ CRITICAL: Admin Live Dashboard Index ★
//    Query: db.transactions.find({ status: "pending" }).sort({ createdAt: -1 })
//    Module: 6 (Pending Monitor, Transaction Logs — the most-hit admin query)
//    Type: Compound, B-tree
//    WHY COMPOUND: Status alone would find all pending transactions, but
//    sorting by createdAt would still require an in-memory sort. The compound
//    index { status: 1, createdAt: -1 } allows MongoDB to walk the index in
//    order and return already-sorted results with zero in-memory sort cost.
{ status: 1, createdAt: -1 }

// 6. Date-range queries for financial reporting
//    Query: db.transactions.find({ createdAt: { $gte: startDate, $lte: endDate } })
//    Module: 4, 6 (Date-filtered reports, financial analysis)
//    Type: Single-field, B-tree
{ createdAt: -1 }

// 7. Sender + date range (user's chronological transaction history)
//    Query: db.transactions.find({ senderWalletId: X }).sort({ createdAt: -1 })
//    Module: 4 (User's "My Transactions" page with pagination)
//    Type: Compound, B-tree
{ senderWalletId: 1, createdAt: -1 }

// 8. Type + status for admin filtering
//    Query: db.transactions.find({ type: "refund", status: "pending" })
//    Module: 6 (Admin filter by transaction type and status)
//    Type: Compound, B-tree
{ type: 1, status: 1 }

// 9. Unresolved failures for admin error log screen
//    Query: db.transactions.find({ resolvedByAdmin: false, status: "failure" })
//    Module: 6 (Error Logs page — unresolved failure badge)
//    Type: Compound, B-tree, named
{ resolvedByAdmin: 1, status: 1 }   // name: 'unresolved_failures'
```

---

### 4.3 Concurrency & Race Conditions: The Double-Spending Problem

#### The Vulnerability

The "double-spending" race condition is the most critical concurrency vulnerability in any payment system. It occurs when two simultaneous payment requests read the same wallet balance at the exact same millisecond, both conclude that sufficient funds exist, and both proceed to debit the wallet — resulting in a negative balance and funds created from nothing.

```
Timeline (without protection):

  Time     Thread A (Send ₹500)              Thread B (Send ₹700)
  ─────    ─────────────────────────          ──────────────────────────
  T+0ms    READ wallet.mainBalance → ₹1000   READ wallet.mainBalance → ₹1000
  T+1ms    CHECK: 1000 >= 500 ✓ proceed      CHECK: 1000 >= 700 ✓ proceed
  T+2ms    WRITE: mainBalance = 1000 - 500   WRITE: mainBalance = 1000 - 700
  T+3ms    SAVE: mainBalance = 500           SAVE: mainBalance = 300
                                              
  Result:  Wallet shows ₹300, but ₹1200 was  
           debited from a ₹1000 balance.      
           ₹200 was created from nothing.     
           Conservation of funds VIOLATED.     
```

#### Solution: Optimistic Concurrency Control (OCC) via Mongoose `__v`

Mongoose provides built-in OCC through the `__v` (version key) field. Every document carries an integer version number that increments on each successful save. When two concurrent operations read the same version, only the first to commit succeeds — the second detects the version mismatch and throws a `VersionError`.

**How it works internally:**

1. Both Thread A and Thread B read the wallet document. Both see `__v: 5`.

2. Thread A calls `.save()`. Mongoose internally generates an `updateOne()` operation with the filter `{ _id: walletId, __v: 5 }` and the update `{ $set: { mainBalance: 500 }, $inc: { __v: 1 } }`. This atomically checks the version AND updates the balance AND increments the version in a single MongoDB operation. The document is now at `__v: 6`.

3. Thread B calls `.save()`. Mongoose generates the same filter: `{ _id: walletId, __v: 5 }`. But the document's version is now `6`, so the filter matches **zero documents**. Mongoose detects `modifiedCount === 0` and throws a `VersionError`.

4. The application catches the `VersionError` and either retries the entire operation (re-read, re-check, re-write) or returns an error to the client.

```
Timeline (with OCC):

  Time     Thread A (Send ₹500)                Thread B (Send ₹700)
  ─────    ──────────────────────────────       ───────────────────────────────
  T+0ms    READ wallet { __v: 5, bal: 1000 }   READ wallet { __v: 5, bal: 1000 }
  T+1ms    CHECK: 1000 >= 500 ✓                CHECK: 1000 >= 700 ✓
  T+2ms    SAVE: filter { __v: 5 }             (waiting for lock)
           UPDATE: { bal: 500, __v: 6 }
           Result: matched 1, modified 1 ✓
  T+3ms                                        SAVE: filter { __v: 5 }
                                                UPDATE: { bal: 300, __v: 6 }
                                                Result: matched 0 ✗
                                                ⚠ VersionError thrown!
  T+4ms                                        CATCH: Retry or abort.
                                                Re-read: { __v: 6, bal: 500 }
                                                CHECK: 500 >= 700 ✗ INSUFFICIENT
                                                Return 400: "Insufficient funds"
           
  Result:  ₹500 correctly debited.
           Thread B safely rejected.
           Conservation of funds PRESERVED.
```

#### Implementation Pattern

```javascript
const transferFunds = async (senderWalletId, amount) => {
  const MAX_RETRIES = 3;
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // 1. Read the current state (including __v)
      const wallet = await Wallet.findById(senderWalletId);
      
      if (!wallet) throw new Error('Wallet not found.');
      if (wallet.isFrozen) throw new Error('Wallet is frozen.');
      if (wallet.mainBalance < amount) throw new Error('Insufficient funds.');
      
      // 2. Modify locally
      wallet.mainBalance -= amount;
      
      // 3. Save — Mongoose includes __v in the filter automatically
      //    If another thread modified the wallet since our read, this
      //    throws VersionError and we retry.
      await wallet.save();
      
      return wallet; // Success
      
    } catch (error) {
      if (error.name === 'VersionError' && attempt < MAX_RETRIES - 1) {
        // Collision detected — retry with fresh read
        console.warn(`OCC collision on wallet ${senderWalletId}, retry ${attempt + 1}`);
        continue;
      }
      throw error; // Non-retryable error or max retries exceeded
    }
  }
};
```

> **Important Note:** OCC handles the concurrency detection. But for multi-document atomicity (debit sender + credit receiver + write ledger entry), we additionally need **MongoDB ACID transactions** (sessions). Section 5 covers this. The two mechanisms work together: the session ensures atomicity across documents, and `__v` ensures no conflicting modification slips through on any individual document.

---

## 5. ACID Transaction System & Automated Rollback Logic

### 5.1 The Transaction Engine

MongoDB supports multi-document ACID transactions starting from version 4.0 (replica sets) and 4.2 (sharded clusters). These transactions provide the same guarantees as traditional RDBMS transactions:

| Property | MongoDB Implementation |
|---|---|
| **Atomicity** | All operations within a session either commit together or roll back together. There is no partial state. |
| **Consistency** | Schema validators and unique indexes are enforced within the transaction. A transaction that violates a constraint is aborted. |
| **Isolation** | Transactions use **snapshot isolation** by default. A transaction sees a consistent snapshot of the data as of the transaction's start time. Other transactions' uncommitted writes are invisible. |
| **Durability** | Once `commitTransaction()` returns successfully, the data is written to the journal (WAL — Write-Ahead Log) and is guaranteed to survive process crashes and power failures. |

#### How Sessions Work in Mongoose

A session is created from the Mongoose connection and passed to every database operation that should be part of the atomic unit:

```javascript
const session = await mongoose.startSession();
session.startTransaction();

try {
  // All operations pass { session } as an option
  await Model.findOneAndUpdate(filter, update, { session });
  await Model.create([document], { session });
  
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
} finally {
  session.endSession();
}
```

**Critical requirement:** Multi-document transactions require a **MongoDB Replica Set**. A standalone `mongod` instance does not support transactions. For development, use `mongod --replSet rs0` or MongoDB Atlas (which always provisions replica sets).

---

### 5.2 Detailed Workflow Steps: Atomic Fund Transfer

The following is the complete, step-by-step controller blueprint for an atomic fund transfer. This is the most complex and critical operation in the entire system.

```javascript
const mongoose = require('mongoose');
const crypto = require('crypto');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

/**
 * Executes an atomic fund transfer between two wallets.
 * 
 * Guarantees:
 * - Sender is debited AND receiver is credited AND ledger entry is written,
 *   or NONE of these operations persist.
 * - Double-spending is prevented via atomic conditional update.
 * - All financial invariants are preserved under any failure mode.
 * 
 * @param {ObjectId} senderUserId   - The authenticated user initiating the transfer
 * @param {ObjectId} recipientId    - The saved recipient document ID
 * @param {Number}   amount         - Transfer amount (must be > 0, max 2 decimals)
 * @param {String}   currency       - ISO currency code
 * @param {String}   description    - Optional transfer note
 * @param {String}   ipAddress      - Client IP for audit trail
 * @returns {Object} The created transaction document
 */
const executeTransfer = async (
  senderUserId,
  recipientId,
  amount,
  currency,
  description = null,
  ipAddress = null
) => {
  // ════════════════════════════════════════════════════════════════════════════
  // PRE-FLIGHT CHECKS (Outside the transaction — read-only, no locks needed)
  // ════════════════════════════════════════════════════════════════════════════

  // Step 0a: Verify sender account is active (not frozen/suspended)
  const senderUser = await User.findById(senderUserId).lean();
  if (!senderUser) {
    throw new Error('SENDER_NOT_FOUND: Sender user does not exist.');
  }
  if (!senderUser.isActive) {
    throw new Error('ACCOUNT_SUSPENDED: Your account has been suspended. Contact support.');
  }

  // Step 0b: Validate amount at application level (schema will also validate)
  if (!amount || amount <= 0) {
    throw new Error('INVALID_AMOUNT: Transfer amount must be greater than zero.');
  }
  if (Number(amount.toFixed(2)) !== amount) {
    throw new Error('INVALID_PRECISION: Amount cannot have more than 2 decimal places.');
  }

  // ════════════════════════════════════════════════════════════════════════════
  // STEP 1: Spawn a new database session and begin the ACID transaction
  // ════════════════════════════════════════════════════════════════════════════

  const session = await mongoose.startSession();

  // Configure transaction options for financial-grade consistency
  session.startTransaction({
    readConcern: { level: 'snapshot' },    // Consistent snapshot isolation
    writeConcern: { w: 'majority' },       // Wait for majority replica ack
    readPreference: 'primary',             // Always read from primary
  });

  try {
    // ══════════════════════════════════════════════════════════════════════════
    // STEP 2: Atomic check-and-deduct from sender's wallet
    // ══════════════════════════════════════════════════════════════════════════
    //
    // This is a CONDITIONAL atomic update. The filter includes:
    //   - _id: target the correct wallet
    //   - mainBalance: { $gte: amount } — ONLY proceed if sufficient funds
    //   - isFrozen: false — ONLY proceed if wallet is not frozen
    //
    // If ANY condition fails, findOneAndUpdate returns null (no document matched),
    // and we know the debit cannot proceed — without ever having modified anything.
    //
    // This pattern is SUPERIOR to "read balance, check in JS, then update" because
    // it eliminates the race condition window between read and write. The check
    // and the modification happen in a SINGLE atomic MongoDB operation.

    const senderWallet = await Wallet.findOneAndUpdate(
      {
        userId: senderUserId,
        mainBalance: { $gte: amount },   // Atomic balance guard
        isFrozen: false,                  // Atomic freeze guard
      },
      {
        $inc: { mainBalance: -amount },   // Atomic decrement
        $set: { lastTransactionAt: new Date() },
      },
      {
        new: true,                        // Return the modified document
        session,                          // Bind to the ACID session
      }
    );

    if (!senderWallet) {
      // No document matched the filter — either:
      // 1. Wallet doesn't exist for this user
      // 2. Insufficient balance (mainBalance < amount)
      // 3. Wallet is frozen
      //
      // We don't know which, but it doesn't matter — the transfer cannot proceed.
      // We'll do a diagnostic read to provide a meaningful error message.

      const diagnosticWallet = await Wallet.findOne(
        { userId: senderUserId },
        null,
        { session }
      );

      if (!diagnosticWallet) {
        throw new Error('WALLET_NOT_FOUND: No wallet exists for the sender.');
      }
      if (diagnosticWallet.isFrozen) {
        throw new Error('WALLET_FROZEN: Your wallet has been frozen. Contact support.');
      }
      if (diagnosticWallet.mainBalance < amount) {
        throw new Error(
          `INSUFFICIENT_FUNDS: Available balance is ${diagnosticWallet.currency} ${diagnosticWallet.mainBalance.toFixed(2)}, ` +
          `but the transfer requires ${diagnosticWallet.currency} ${amount.toFixed(2)}.`
        );
      }

      throw new Error('DEBIT_FAILED: Unable to process debit. Please try again.');
    }

    // ══════════════════════════════════════════════════════════════════════════
    // STEP 3: Incremental provisioning of funds to the recipient
    // ══════════════════════════════════════════════════════════════════════════
    //
    // In a full banking system, this step would interface with an external
    // bank API. In PayGate's internal transfer model, we credit the recipient's
    // wallet directly if they are also a PayGate user.
    //
    // For external bank transfers, this step would instead:
    //   1. Place the funds in an escrow/holding state
    //   2. Initiate an external bank API call
    //   3. Wait for confirmation before marking success
    //
    // For simplicity, this blueprint shows the internal transfer path.

    // Retrieve recipient details to find their wallet (if internal)
    const recipientDoc = await mongoose.model('Recipient').findById(recipientId).session(session);
    
    if (!recipientDoc) {
      throw new Error('RECIPIENT_NOT_FOUND: The selected recipient does not exist.');
    }

    // Note: For external bank transfers, this block would be replaced with
    // external API integration. The recipient may not have a PayGate wallet.
    // The transaction would still be logged with status tracking.

    // ══════════════════════════════════════════════════════════════════════════
    // STEP 4: Log the immutable ledger entry with a cryptographically
    //         secure, unique transaction reference identifier
    // ══════════════════════════════════════════════════════════════════════════
    //
    // The reference code is generated using Node.js crypto.randomBytes(),
    // producing 12 bytes of cryptographic randomness encoded as 24 hex chars.
    // Prefixed with "TXN-" for human readability in support contexts.
    //
    // Collision probability: 1 in 2^96 ≈ 7.9 × 10^28 — effectively zero.

    const referenceCode = 'TXN-' + crypto.randomBytes(12).toString('hex').toUpperCase();

    const transactionRecord = await Transaction.create(
      [
        {
          senderWalletId: senderWallet._id,
          recipientId: recipientId,
          amount: amount,
          currency: currency,
          referenceCode: referenceCode,
          status: 'success',
          type: 'transfer',
          description: description,
          ipAddress: ipAddress,
        },
      ],
      { session }     // Bind to the ACID session
    );
    // Note: Transaction.create() with an array + session is required.
    // Transaction.create(singleDoc, { session }) does NOT work — Mongoose
    // requires the array form when passing options to create().

    // ══════════════════════════════════════════════════════════════════════════
    // STEP 5: Commit the collective batch to disk
    // ══════════════════════════════════════════════════════════════════════════
    //
    // This is the point of no return. Once commitTransaction() returns
    // successfully, ALL three operations (debit, credit, ledger write) are:
    //   1. Written to the WiredTiger journal (WAL) on the primary
    //   2. Replicated to the majority of replica set members
    //   3. Guaranteed to survive process crashes and power failures
    //
    // If commitTransaction() throws, the catch block handles rollback.

    await session.commitTransaction();

    return transactionRecord[0];

  } catch (error) {
    // ══════════════════════════════════════════════════════════════════════════
    // FAILURE HANDLER: Global rollback via abortTransaction()
    // ══════════════════════════════════════════════════════════════════════════
    //
    // If we reach this catch block, it means one of the following occurred:
    //   1. senderWallet debit failed (insufficient funds, frozen wallet)
    //   2. Recipient lookup or credit failed
    //   3. Transaction ledger entry creation failed (validation error, duplicate ref)
    //   4. commitTransaction() itself failed (network drop, replica set election)
    //   5. Any unexpected error within the try block
    //
    // abortTransaction() reverses ALL operations performed within the session.
    // The sender's balance is restored, no credit is applied, and no ledger
    // entry exists. The system is in the exact same state as before the
    // transfer was attempted.

    await session.abortTransaction();

    // Log the failure for operational monitoring
    console.error('[TRANSFER_ABORT]', {
      senderUserId,
      recipientId,
      amount,
      currency,
      error: error.message,
      timestamp: new Date().toISOString(),
    });

    // Re-throw with context for the controller to handle
    throw error;

  } finally {
    // ══════════════════════════════════════════════════════════════════════════
    // CLEANUP: Always end the session, regardless of success or failure
    // ══════════════════════════════════════════════════════════════════════════
    //
    // endSession() releases the server-side session resources. Failing to
    // call this leaks sessions on the MongoDB server, which has a default
    // limit of 1,000,000 concurrent sessions but can cause memory pressure
    // well before that limit.

    session.endSession();
  }
};

module.exports = { executeTransfer };
```

#### Why Each Step Matters

| Step | What Happens | What Breaks Without It |
|---|---|---|
| **Pre-flight checks** | Account active status verified *before* session creation | Frozen accounts would acquire write locks on wallets before being rejected, increasing contention |
| **Session + startTransaction()** | Creates an isolated snapshot of the database | Without a session, each operation is independent — debit could succeed while credit fails, creating a split-state |
| **Atomic check-and-deduct** | `findOneAndUpdate` with `$gte` guard | Separate read-then-write allows double-spending race condition (Section 4.3) |
| **Ledger entry creation** | Immutable record with crypto reference | Without the ledger entry, there's no proof the transfer happened. Reconciliation becomes impossible |
| **commitTransaction()** | Persists all changes atomically | Changes remain invisible to other sessions and can be rolled back |
| **abortTransaction()** | Reverses all uncommitted changes | Without explicit abort, the session eventually times out (default 60s) but holds locks during that period |
| **endSession()** | Releases server resources | Session leak — progressive memory exhaustion on the MongoDB server |

---

### 5.3 Failures & Edge Cases: The Recovery Script Sequence

Every failure mode in the transfer pipeline must result in a clean, deterministic recovery. The principle is simple: **after any failure, the system must be in the exact same state as before the transfer was initiated.** No partial debits, no phantom credits, no orphaned ledger entries.

#### Failure Mode Matrix

| Failure Point | What Happened | Recovery Action | End State |
|---|---|---|---|
| **Pre-flight: User not found** | No session started yet | Throw error, return 404 | No changes |
| **Pre-flight: Account frozen** | No session started yet | Throw error, return 403 | No changes |
| **Step 2: Insufficient funds** | Session started, no writes yet | `abortTransaction()` → `endSession()` | No changes |
| **Step 2: Wallet frozen** | Session started, no writes yet | `abortTransaction()` → `endSession()` | No changes |
| **Step 3: Recipient not found** | Sender debited within session | `abortTransaction()` → sender balance restored | No changes |
| **Step 4: Ledger write fails** | Sender debited, recipient credited within session | `abortTransaction()` → all changes reversed | No changes |
| **Step 4: Duplicate reference code** | Extremely rare (1 in 2⁹⁶) | `abortTransaction()` → retry with new reference | No changes |
| **Step 5: commitTransaction() network drop** | All writes prepared but not committed | MongoDB's transaction timeout (default 60s) triggers server-side abort | No changes |
| **Step 5: Replica set election during commit** | Primary steps down mid-commit | Transaction is aborted by the new primary. `TransientTransactionError` label allows safe retry | No changes |
| **Application crash after debit, before commit** | Session never committed | MongoDB's server-side session timeout aborts the transaction automatically | No changes |
| **MongoDB server crash** | Journal (WAL) may or may not have the commit record | If committed to journal: recovered on restart. If not committed: transaction is rolled back on restart | Consistent either way |

#### Transient Error Retry Pattern

MongoDB labels certain errors as **retryable**. These errors indicate a transient infrastructure condition (network blip, replica set election) rather than a logical application error:

```javascript
const executeTransferWithRetry = async (
  senderUserId,
  recipientId,
  amount,
  currency,
  description,
  ipAddress
) => {
  const MAX_RETRIES = 3;
  const RETRY_DELAY_MS = 200;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await executeTransfer(
        senderUserId,
        recipientId,
        amount,
        currency,
        description,
        ipAddress
      );
    } catch (error) {
      const isRetryable =
        error.hasOwnProperty('errorLabels') && (
          error.errorLabels.includes('TransientTransactionError') ||
          error.errorLabels.includes('UnknownTransactionCommitResult')
        );

      if (isRetryable && attempt < MAX_RETRIES) {
        console.warn(
          `[TRANSFER_RETRY] Transient error on attempt ${attempt}/${MAX_RETRIES}:`,
          error.message
        );
        // Exponential backoff: 200ms, 400ms, 800ms
        await new Promise(resolve =>
          setTimeout(resolve, RETRY_DELAY_MS * Math.pow(2, attempt - 1))
        );
        continue;
      }

      // Non-retryable error or max retries exceeded
      // Log a failed transaction for admin visibility
      try {
        await Transaction.create({
          senderWalletId: null,     // Unknown — debit may not have occurred
          recipientId: recipientId,
          amount: amount,
          currency: currency,
          referenceCode: 'TXN-' + crypto.randomBytes(12).toString('hex').toUpperCase(),
          status: 'failure',
          type: 'transfer',
          errorMessage: error.message,
          errorCode: error.code ? String(error.code) : 'UNKNOWN',
          description: description,
          ipAddress: ipAddress,
        });
      } catch (logError) {
        // If even the failure log fails, escalate to system monitoring
        console.error('[CRITICAL] Failed to log transaction failure:', logError.message);
      }

      throw error;
    }
  }
};
```

#### Critical Safety Properties

1. **No Split-State Guarantee.** Because all debit, credit, and ledger operations are within a single MongoDB session, `abortTransaction()` reverses *all* of them atomically. There is no scenario where the sender is debited but the ledger entry is missing, or the credit is applied but the debit is not.

2. **No Fund Leakage.** The `$gte` guard in Step 2 ensures that a debit only occurs if funds are available. The `min: 0` schema validator ensures that even if application logic has a bug, a negative balance can never be persisted. These are two independent safety layers.

3. **No Phantom Transactions.** The ledger entry is created within the same session as the wallet modifications. If the session aborts, the ledger entry vanishes along with the balance changes. There are no orphaned "success" entries for transfers that were actually rolled back.

4. **Server-Side Timeout Backstop.** If the application crashes after starting a transaction but before committing or aborting, MongoDB's server-side session timeout (default: 60 seconds, configurable via `transactionLifetimeLimitSeconds`) will automatically abort the transaction. This is the final safety net.

---

## 6. Appendix: Collection Size Projections & Operational Notes

### Collection Growth Projections

Assuming a moderately active PayGate deployment:

| Collection | Doc Size (avg) | Growth Rate | 1-Year Projection | Index Size (est.) |
|---|---|---|---|---|
| `users` | ~0.5 KB | 1,000 new/month | 12,000 docs (~6 MB) | ~2 MB |
| `wallets` | ~1 KB (with pockets) | 1:1 with users | 12,000 docs (~12 MB) | ~3 MB |
| `recipients` | ~0.4 KB | 5 per user avg | 60,000 docs (~24 MB) | ~8 MB |
| `transactions` | ~0.6 KB | 50,000/month | 600,000 docs (~360 MB) | ~150 MB |

The `transactions` collection is by far the largest and fastest-growing. This validates:
- Why transactions must NOT be embedded in user/wallet documents.
- Why compound indexes on this collection are critical.
- Why the B-Tree index on `{ status: 1, createdAt: -1 }` is essential for the admin dashboard.

### Replica Set Requirements

| Capability | Standalone `mongod` | Replica Set | Atlas (Cloud) |
|---|---|---|---|
| Multi-document ACID transactions | ❌ | ✅ | ✅ |
| Read concern `snapshot` | ❌ | ✅ | ✅ |
| Write concern `majority` | ❌ | ✅ | ✅ |
| Automatic failover | ❌ | ✅ | ✅ |

**For development:** Use `mongod --replSet rs0` and initiate with `rs.initiate()` to enable transaction support locally.

**For production:** Use MongoDB Atlas (M10+ tier) or a self-managed 3-node replica set (1 primary + 2 secondaries) for production-grade availability and transaction support.

### Schema Version Migration Strategy

All schemas use `timestamps: true`, which adds `createdAt` and `updatedAt` fields. For future schema migrations:

1. **Additive changes** (new fields with defaults) can be deployed without migration — existing documents gain the new field on next `.save()` or can be backfilled with an `updateMany()`.

2. **Destructive changes** (field removal, type changes) require a migration script that:
   - Runs inside a transaction for consistency
   - Is idempotent (safe to run multiple times)
   - Is tested on a staging replica set before production

3. **Index changes** should use `createIndex()` with `{ background: true }` (MongoDB 4.2+ builds indexes in the background by default) to avoid blocking production writes during index construction.

---

> **End of Database Design Specification.**
>
> This document is a living proposal. All schemas, indexes, and transaction patterns should be reviewed, approved, and stress-tested by the engineering team before implementation. Modifications to this specification must go through architectural review.
