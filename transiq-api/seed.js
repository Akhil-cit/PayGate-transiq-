import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import User from './models/User.js';
import Wallet from './models/Wallet.js';
import Pocket from './models/Pocket.js';
import Receipt from './models/Receipt.js';
import Transaction from './models/Transaction.js';
import ErrorLog from './models/ErrorLog.js';
import BankAccount from './models/BankAccount.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/paygate_db';

async function seed() {
  console.log('🌱 Connecting to MongoDB…');
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to', mongoose.connection.name);

  console.log('🗑  Clearing existing data…');
  await Promise.all([
    User.deleteMany({}),
    Wallet.deleteMany({}),
    Pocket.deleteMany({}),
    Receipt.deleteMany({}),
    Transaction.deleteMany({}),
    ErrorLog.deleteMany({}),
    BankAccount.deleteMany({}),
  ]);

  console.log('👤 Creating users…');
  const hashedPw = await bcrypt.hash('Password@123', 12);

  const customerUser = await User.create({
    firstName: 'Arjun',
    lastName: 'Mehta',
    email: 'arjun@paygate.com',
    password: 'Password@123',
    phone: '9876543210',
    role: 'customer',
    isActive: true,
    twoFactorEnabled: true,
    biometricsEnabled: false,
    autoLockMinutes: 15,
    activeSessions: [
      {
        device: 'Chrome on Windows 11',
        location: 'coimbatore, India',
        ipAddress: '103.21.124.89',
        lastActive: 'Just now',
        isCurrent: true,
      },
      {
        device: 'PayGate App on iPhone 15 Pro',
        location: 'Bengaluru, India',
        ipAddress: '49.207.210.14',
        lastActive: '2 days ago',
        isCurrent: false,
      },
      {
        device: 'Safari on macOS Sonoma',
        location: 'Chennai, India',
        ipAddress: '157.48.91.2',
        lastActive: '3 days ago',
        isCurrent: false,
      },
    ],
    securityLogs: [
      {
        event: 'Password Changed',
        status: 'SUCCESS',
        ip: '103.21.124.89',
        device: 'Chrome on Windows',
        timestamp: '2026-09-15 14:30:12',
      },
      {
        event: '2FA OTP Verification',
        status: 'SUCCESS',
        ip: '103.21.124.89',
        device: 'Chrome on Windows',
        timestamp: '2026-09-15 14:28:05',
      },
      {
        event: 'Wallet Freeze Toggled',
        status: 'INFO',
        ip: '49.207.210.14',
        device: 'iPhone 15 Pro',
        timestamp: '2026-09-12 18:11:40',
      },
      {
        event: 'Failed Login Attempt',
        status: 'FAILED',
        ip: '185.220.101.5',
        device: 'Unknown Client (Tor Exit)',
        timestamp: '2026-09-10 03:42:19',
      },
    ],
  });

  const adminUser = await User.create({
    firstName: 'Admin',
    lastName: 'Officer',
    email: 'admin@paygate.internal',
    password: 'Password@123',
    phone: '9876543211',
    role: 'admin',
    isActive: true,
  });

  await User.create({
    firstName: 'System',
    lastName: 'Admin',
    email: 'admin@transiq.internal',
    password: 'Password@123',
    phone: '9876543212',
    role: 'admin',
    isActive: true,
  });

  console.log('👛 Finding/Updating wallets…');
  let customerWallet = await Wallet.findOne({ userId: customerUser._id });
  if (!customerWallet) {
    customerWallet = await Wallet.create({
      userId: customerUser._id,
      mainBalance: 45000,
      currency: 'INR',
      isFrozen: false,
    });
  } else {
    customerWallet.mainBalance = 45000;
    await customerWallet.save();
  }

  console.log('🎯 Creating pockets…');
  await Pocket.create([
    {
      walletId: customerWallet._id,
      userId: customerUser._id,
      name: 'Emergency Fund',
      targetAmount: 50000,
      currentAmount: 15000,
      isLocked: false,
    },
    {
      walletId: customerWallet._id,
      userId: customerUser._id,
      name: 'Vacation Savings',
      targetAmount: 30000,
      currentAmount: 8500,
      isLocked: false,
    },
    {
      walletId: customerWallet._id,
      userId: customerUser._id,
      name: 'Tech Upgrade',
      targetAmount: 20000,
      currentAmount: 20000,
      isLocked: true,
    },
  ]);

  console.log('👥 Creating recipients…');
  const recipients = await Receipt.create([
    {
      userId: customerUser._id,
      name: 'Priya Sharma',
      bankName: 'HDFC Bank',
      accountNumber: '50100412345678',
      ifscCode: 'HDFC0001234',
      accountType: 'savings',
      phone: '9811122233',
      email: 'priya@example.com',
      isFavorite: true,
    },
    {
      userId: customerUser._id,
      name: 'Rahul Verma',
      bankName: 'State Bank of India',
      accountNumber: '30987654321',
      ifscCode: 'SBIN0004567',
      accountType: 'current',
      phone: '9822233344',
      email: 'rahul@example.com',
      isFavorite: true,
    },
    {
      userId: customerUser._id,
      name: 'Ananya Iyer',
      bankName: 'ICICI Bank',
      accountNumber: '123405009876',
      ifscCode: 'ICIC0005678',
      accountType: 'savings',
      phone: '9833344455',
      email: 'ananya@example.com',
      isFavorite: false,
    },
  ]);

  console.log('💳 Creating transactions…');
  const txnData = [
    {
      senderWalletId: customerWallet._id,
      recipientId: recipients[0]._id,
      amount: 4500,
      status: 'success',
      type: 'transfer',
      method: 'UPI',
      description: 'Monthly grocery split',
      referenceCode: 'TXN-20260901-1001',
    },
    {
      senderWalletId: customerWallet._id,
      recipientId: recipients[1]._id,
      amount: 12000,
      status: 'success',
      type: 'transfer',
      method: 'IMPS',
      description: 'Consulting invoice fee',
      referenceCode: 'TXN-20260905-1002',
    },
    {
      senderWalletId: customerWallet._id,
      recipientId: recipients[2]._id,
      amount: 3500,
      status: 'pending',
      type: 'transfer',
      method: 'BANK_TRANSFER',
      description: 'Rent deposit part 1',
      referenceCode: 'TXN-20260910-1003',
    },
    {
      senderWalletId: customerWallet._id,
      recipientId: recipients[0]._id,
      amount: 8000,
      status: 'failure',
      failureReason: 'BANK_TIMEOUT',
      type: 'transfer',
      method: 'NEFT',
      description: 'Urgent transfer',
      referenceCode: 'TXN-20260915-1004',
    },
  ];

  const createdTxns = await Transaction.create(txnData);

  console.log('⚠️  Creating error logs for failures…');
  await ErrorLog.create({
    transactionId: createdTxns[3]._id,
    errorCode: 'BANK_TIMEOUT',
    severity: 'CRITICAL',
    message: 'Transaction TXN-20260915-1004 failed: BANK_TIMEOUT response from partner bank',
    resolved: false,
  });

  console.log('🏦 Linking bank accounts…');
  await BankAccount.create([
    {
      userId: customerUser._id,
      name: 'HDFC Bank Savings Account',
      accountNumber: 'BANK10001',
      maskedNumber: 'XXXX XXXX 0001',
      balance: 82450,
      accountType: 'SAVINGS',
      bankName: 'HDFC Bank',
      ifscCode: 'HDFC0001001',
      isVerified: true,
      status: 'ACTIVE',
    },
    {
      userId: customerUser._id,
      name: 'ICICI Bank Salary Account',
      accountNumber: 'BANK10002',
      maskedNumber: 'XXXX XXXX 0002',
      balance: 124600,
      accountType: 'SALARY',
      bankName: 'ICICI Bank',
      ifscCode: 'ICIC0002002',
      isVerified: true,
      status: 'ACTIVE',
    },
    {
      userId: customerUser._id,
      name: 'SBI Current Account',
      accountNumber: 'BANK10003',
      maskedNumber: 'XXXX XXXX 0003',
      balance: 38000,
      accountType: 'CURRENT',
      bankName: 'State Bank of India',
      ifscCode: 'SBIN0003003',
      isVerified: true,
      status: 'ACTIVE',
    },
  ]);

  console.log('✅ Database seeded successfully!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
