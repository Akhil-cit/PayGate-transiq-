import Wallet from '../models/Wallet.js';
import Pocket from '../models/Pocket.js';
import Receipt from '../models/Receipt.js';
import Transaction from '../models/Transaction.js';
import BankAccount from '../models/BankAccount.js';
import User from '../models/User.js';

// External bank simulator registry (these are mock external bank records, NOT stored in our DB)
// They represent what partner banks expose via their API. When a user "links" one, we create
// a BankAccount document in MongoDB tied to their userId.
const EXTERNAL_BANK_REGISTRY = [
  { accountNumber: 'BANK10001', accountHolderName: 'Primary User', associatedPhoneNumber: '9876543210', accountType: 'Savings', availableBalance: 25000.0, bankName: 'HDFC Bank', ifscCode: 'HDFC0001001' },
  { accountNumber: 'BANK10002', accountHolderName: 'Primary User', associatedPhoneNumber: '9812345678', accountType: 'Salary', availableBalance: 48000.0, bankName: 'ICICI Bank', ifscCode: 'ICIC0002002' },
  { accountNumber: 'BANK10003', accountHolderName: 'Primary User', associatedPhoneNumber: '9765432109', accountType: 'Current', availableBalance: 120000.0, bankName: 'State Bank of India', ifscCode: 'SBIN0003003' },
  { accountNumber: 'BANK10004', accountHolderName: 'Primary User', associatedPhoneNumber: '9823456789', accountType: 'Savings', availableBalance: 62000.0, bankName: 'Axis Bank', ifscCode: 'UTIB0004004' },
  { accountNumber: 'BANK10005', accountHolderName: 'Primary User', associatedPhoneNumber: '9734567890', accountType: 'NRI', availableBalance: 350000.0, bankName: 'Kotak Mahindra Bank', ifscCode: 'KKBK0005005' },
];

// ── GET /api/bank/dummy-accounts ──────────────────────────────────────────────
// Returns the external bank registry (mock partner bank API response)
export const getDummyBanks = (req, res) => {
  res.json(EXTERNAL_BANK_REGISTRY);
};

// ── GET /api/accounts ──────────────────────────────────────────────────────────
// Returns user's Transiq Wallet + all linked BankAccounts + Pockets — all from DB
export const getAccounts = async (req, res) => {
  try {
    const [wallet, bankAccounts, pockets] = await Promise.all([
      Wallet.findOne({ userId: req.user._id }),
      BankAccount.find({ userId: req.user._id, status: { $ne: 'CLOSED' } }).lean(),
      Pocket.find({ userId: req.user._id }).lean(),
    ]);

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found. Please contact support.' });
    }

    const accounts = [
      // 1. Main Wallet (from Wallet collection)
      {
        id: `WALLET_${wallet._id}`,
        name: 'Main Wallet',
        number: `MW-${wallet._id.toString().slice(-6).toUpperCase()}`,
        balance: wallet.mainBalance,
        type: 'WALLET',
        bank: 'Transiq Wallet',
        status: wallet.isFrozen ? 'FROZEN' : 'ACTIVE',
        isVerified: true,
      },
      // 2. Linked Bank Accounts (from BankAccount collection)
      ...bankAccounts.map((acc) => ({
        id: acc._id.toString(),
        name: acc.name,
        number: acc.maskedNumber || `XXXX XXXX ${acc.accountNumber.slice(-4)}`,
        balance: acc.balance,
        type: acc.accountType,
        bank: acc.bankName,
        status: acc.status,
        isVerified: acc.isVerified,
      })),
      // 3. Pockets (from Pocket collection)
      ...pockets.map((p) => ({
        id: p._id.toString(),
        name: `${p.name} (Pocket)`,
        number: `PKT-${p._id.toString().slice(-6).toUpperCase()}`,
        balance: p.currentAmount,
        type: 'POCKET',
        bank: 'Transiq Pocket',
        status: p.isLocked ? 'LOCKED' : 'ACTIVE',
        isVerified: true,
      })),
    ];

    res.json(accounts);
  } catch (err) {
    console.error('getAccounts error:', err);
    res.status(500).json({ message: 'Failed to load accounts.' });
  }
};

// ── POST /api/wallet/accounts/add ─────────────────────────────────────────────
// Step 1: Look up the account in the external bank registry and send OTP
export const addBankAccount = async (req, res) => {
  try {
    const { accountNumber, phone } = req.body;
    if (!accountNumber || !phone) {
      return res.status(400).json({ message: 'Account number and phone number are required.' });
    }

    const match = EXTERNAL_BANK_REGISTRY.find((b) => b.accountNumber === accountNumber.trim());
    if (!match) {
      return res.status(400).json({
        message: 'No matching bank account found. Please check the account number and try again.',
      });
    }

    // Check if already linked
    const existing = await BankAccount.findOne({ userId: req.user._id, accountNumber: accountNumber.trim() });
    if (existing) {
      return res.status(409).json({ message: 'This bank account is already linked to your profile.' });
    }

    // In production: call real bank OTP API. Here we use a fixed demo OTP.
    const generatedOtp = '458921';
    res.json({
      success: true,
      message: `OTP sent to linked mobile ending with ${phone.slice(-4)}.`,
      verificationCode: generatedOtp, // Only exposed in demo mode
    });
  } catch (err) {
    console.error('addBankAccount error:', err);
    res.status(500).json({ message: 'Failed to initiate bank account linking.' });
  }
};

// ── POST /api/wallet/accounts/verify-otp ──────────────────────────────────────
// Step 2: Verify OTP and persist the linked bank account to MongoDB
export const verifyOtp = async (req, res) => {
  try {
    const { accountNumber, phone, otp } = req.body;

    if (otp !== '458921' && otp !== '123456') {
      return res.status(400).json({ message: 'Invalid OTP. Please enter the correct verification code.' });
    }

    const bankData = EXTERNAL_BANK_REGISTRY.find((b) => b.accountNumber === accountNumber);
    if (!bankData) {
      return res.status(400).json({ message: 'Bank account data not found.' });
    }

    // Already linked?
    const existing = await BankAccount.findOne({ userId: req.user._id, accountNumber: accountNumber.trim() });
    if (existing) {
      return res.status(409).json({ message: 'Bank account already linked.' });
    }

    // Save to DB
    const newAcc = await BankAccount.create({
      userId: req.user._id,
      name: `${bankData.bankName} ${bankData.accountType} Account`,
      accountNumber: accountNumber,
      maskedNumber: `XXXX XXXX ${accountNumber.slice(-4)}`,
      balance: bankData.availableBalance,
      accountType: bankData.accountType.toUpperCase(),
      bankName: bankData.bankName,
      ifscCode: bankData.ifscCode,
      isVerified: true,
      status: 'ACTIVE',
    });

    res.json({
      success: true,
      message: 'Bank account verified and linked successfully.',
      data: {
        id: newAcc._id.toString(),
        name: newAcc.name,
        number: newAcc.maskedNumber,
        balance: newAcc.balance,
        type: newAcc.accountType,
        bank: newAcc.bankName,
        status: newAcc.status,
        isVerified: true,
      },
    });
  } catch (err) {
    console.error('verifyOtp error:', err);
    res.status(500).json({ message: 'Failed to link bank account.' });
  }
};

// ── POST /api/wallet/accounts/split & /api/wallet/split ────────────────────────
export const splitWallet = async (req, res) => {
  try {
    const { accountId, allocations } = req.body;
    if (!allocations || !Array.isArray(allocations)) {
      return res.status(400).json({ success: false, message: 'Allocations array is required.' });
    }

    const mainAlloc = Number(allocations.find((a) => a.walletName === 'Main Wallet')?.amount) || 0;
    const savingsAlloc = Number(allocations.find((a) => a.walletName === 'Savings Wallet')?.amount) || 0;

    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const wallet = await Wallet.findOne({ userId: user._id });
    if (!wallet) {
      return res.status(404).json({ success: false, message: 'Wallet not found.' });
    }

    if (wallet.isFrozen) {
      return res.status(403).json({ success: false, message: 'Your wallet is frozen. Cannot modify balance allocation.' });
    }

    // Check account if provided
    if (accountId && !accountId.startsWith('WALLET_')) {
      const bankAcc = await BankAccount.findOne({ _id: accountId, userId: user._id });
      if (bankAcc) {
        const total = mainAlloc + savingsAlloc;
        if (total > bankAcc.balance) {
          return res.status(400).json({ success: false, message: `Allocations exceed available bank balance (₹${bankAcc.balance.toLocaleString('en-IN')}).` });
        }
      }
    }

    // Update wallet main balance
    wallet.mainBalance = mainAlloc;
    await wallet.save({ validateModifiedOnly: true });

    // Store savings allocation in a dedicated pocket
    if (savingsAlloc > 0) {
      let savingsPocket = await Pocket.findOne({ userId: user._id, name: 'Savings Wallet' });
      if (!savingsPocket) {
        savingsPocket = await Pocket.create({
          userId: user._id,
          walletId: wallet._id,
          name: 'Savings Wallet',
          currentAmount: savingsAlloc,
          targetAmount: savingsAlloc * 2,
        });
      } else {
        savingsPocket.currentAmount = savingsAlloc;
        await savingsPocket.save();
      }
    }

    res.json({
      success: true,
      message: 'Wallet balance allocated successfully.',
      data: {
        mainBalance: wallet.mainBalance,
        savingsBalance: savingsAlloc,
      },
    });
  } catch (err) {
    console.error('splitWallet error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to allocate wallet balance.' });
  }
};

// ── POST /api/payment/resolve-recipient ───────────────────────────────────────
// ── POST /api/payment/initiate ────────────────────────────────────────────────
export const initiatePayment = async (req, res) => {
  const now = new Date();
  const dateStr =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(100000 + Math.random() * 900000);
  const transactionId = `TXN-${dateStr}-${rand}`;
  const createdAt =
    now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today';

  res.json({ transactionId, status: 'INITIATED', createdAt });
};

// ── POST /api/payment/validate-details ─────────────────────────────────────────
export const validateDetails = async (req, res) => {
  const { accountId, amount } = req.body;
  const numAmt = Number(amount);

  if (!numAmt || numAmt <= 0) {
    return res.status(400).json({ detail: 'Please enter a valid amount greater than ₹0.' });
  }

  // Check balance from DB based on accountId
  try {
    if (accountId && accountId.startsWith('WALLET_')) {
      const wallet = await Wallet.findOne({ userId: req.user._id });
      if (wallet && numAmt > wallet.mainBalance) {
        return res.status(400).json({ detail: `Insufficient wallet balance. Available: ₹${wallet.mainBalance.toLocaleString('en-IN')}.` });
      }
    } else if (accountId) {
      const bankAcc = await BankAccount.findOne({ _id: accountId, userId: req.user._id }).catch(() => null);
      if (bankAcc && numAmt > bankAcc.balance) {
        return res.status(400).json({ detail: `Insufficient balance in ${bankAcc.name}. Available: ₹${bankAcc.balance.toLocaleString('en-IN')}.` });
      }
    }
  } catch (_) {
    // Non-blocking — allow if account not found by ID
  }

  res.json({ status: 'VALIDATED', message: 'Details verified successfully.' });
};

// ── POST /api/payment/confirm ─────────────────────────────────────────────────
export const confirmPayment = async (req, res) => {
  res.json({ status: 'CONFIRMED', message: 'Transaction ready for PIN authorization.' });
};

// ── POST /api/payment/authorize-pin ───────────────────────────────────────────
export const authorizePin = async (req, res) => {
  const { transactionId, pin, accountId, amount, recipientId, purpose, remarks } = req.body;

  if (pin !== (process.env.DEMO_PAYMENT_PIN || '1234')) {
    return res.status(400).json({
      status: 'FAILED',
      reason: 'Incorrect Security PIN. Please verify and try again.',
    });
  }

  try {
    const numAmt = Number(amount);
    if (!Number.isFinite(numAmt) || numAmt <= 0 || numAmt > 10000000) {
      return res.status(400).json({ status: 'FAILED', reason: 'Invalid amount. Must be between ₹0.01 and ₹1,00,00,000.' });
    }

    // 1. Get wallet
    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      return res.status(404).json({ status: 'FAILED', reason: 'Wallet not found.' });
    }

    // 2. Determine recipient — strict ownership check
    if (!recipientId) {
      return res.status(400).json({ status: 'FAILED', reason: 'Recipient is required.' });
    }
    const receiptDoc = await Receipt.findOne({ _id: recipientId, userId: req.user._id }).catch(() => null);
    if (!receiptDoc) {
      return res.status(404).json({ status: 'FAILED', reason: 'Recipient not found or does not belong to your account.' });
    }

    // 3. Determine payment method by amount
    const method = numAmt > 200000 ? 'RTGS' : numAmt > 100000 ? 'NEFT' : numAmt > 50000 ? 'IMPS' : 'UPI';

    // Block frozen wallets completely
    if (wallet.isFrozen && (!accountId || accountId.startsWith('WALLET_'))) {
      return res.status(403).json({ status: 'FAILED', reason: 'Your wallet is frozen. Outgoing payments are blocked.' });
    }

    // 4. Deduct balance from the source account
    if (accountId && !accountId.startsWith('WALLET_')) {
      const bankAcc = await BankAccount.findOne({ _id: accountId, userId: req.user._id });
      if (!bankAcc) {
        return res.status(404).json({ status: 'FAILED', reason: 'Bank account not found.' });
      }
      if (bankAcc.status !== 'ACTIVE') {
        return res.status(403).json({ status: 'FAILED', reason: 'Bank account is not active.' });
      }
      if (bankAcc.balance < numAmt) {
        return res.status(400).json({ status: 'FAILED', reason: `Insufficient bank balance. Available: ₹${bankAcc.balance.toLocaleString('en-IN')}.` });
      }
      bankAcc.balance -= numAmt;
      await bankAcc.save();
    } else {
      if (wallet.mainBalance < numAmt) {
        return res.status(400).json({ status: 'FAILED', reason: `Insufficient wallet balance. Available: ₹${wallet.mainBalance.toLocaleString('en-IN')}.` });
      }
      wallet.mainBalance -= numAmt;
      await wallet.save({ validateModifiedOnly: true });
    }

    // 5. Record the transaction
    const rawIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress;
    const isLocal = !rawIp || rawIp === '127.0.0.1' || rawIp === '::1' || rawIp.includes('127.0.0.1');
    const ipAddress = isLocal ? '103.21.124.89' : rawIp;

    const completedTxn = await Transaction.create({
      senderWalletId: wallet._id,
      recipientId: receiptDoc._id,
      amount: numAmt,
      method,
      description: purpose || remarks || 'Funds Transfer',
      type: 'transfer',
      status: 'success',
      referenceCode: transactionId || `TXN-${Date.now()}`,
      ipAddress,
    });

    res.json({
      status: 'SUCCESSFUL',
      message: 'Transaction processed successfully.',
      data: completedTxn,
    });
  } catch (err) {
    console.error('authorizePin error:', err);
    return res.status(500).json({ status: 'FAILED', reason: 'Payment processing failed. Please try again.' });
  }
};

// ── POST /api/payment/retry ────────────────────────────────────────────────────
export const retryPayment = (req, res) => {
  const { transactionId } = req.body;
  res.json({
    success: true,
    message: 'Retry authorized. Please re-enter your Security PIN.',
    transactionId: transactionId || `TXN-RETRY-${Date.now()}`,
  });
};
