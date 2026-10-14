import mongoose from 'mongoose';
import crypto from 'crypto';

const TransactionSchema = new mongoose.Schema(
  {
    senderWalletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wallet',
      required: false,
      index: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Receipt',
      required: true,
      index: true,
    },
    originalTransactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
      default: null,
      index: true,
    },
    referenceCode: {
      type: String,
      unique: true,
      index: true,
    },
    amount: { type: Number, required: true, min: 0.1 },
    status: {
      type: String,
      enum: ['pending', 'success', 'failure', 'cancelled'],
      default: 'pending',
      index: true,
    },
    type: {
      type: String,
      enum: ['enquiry', 'refund', 'reversal', 'transfer', 'topup'],
      default: 'transfer',
      index: true,
    },
    method: {
      type: String,
      enum: ['BANK_TRANSFER', 'CARD', 'WALLET', 'UPI', 'NEFT', 'RTGS', 'IMPS'],
      required: true,
    },
    description: { type: String, default: '' },
    failureReason: { type: String, default: '' },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    ipAddress: { type: String, default: '103.21.124.89' },
  },
  { timestamps: true }
);

TransactionSchema.index({ senderWalletId: 1, status: 1 });
TransactionSchema.index({ status: 1, createdAt: -1 });
TransactionSchema.index({ type: 1, status: 1 });

TransactionSchema.pre('save', function (next) {
  if (!this.referenceCode) {
    this.referenceCode = `TXN-${Date.now()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  }
  next();
});

TransactionSchema.post('save', async function (doc) {
  try {
    if (doc.status === 'failure' && this.isModified && this.isModified('status')) {
      const ErrorLog = mongoose.model('ErrorLog');
      const existing = await ErrorLog.findOne({ transactionId: doc._id });
      if (!existing) {
        const reason = doc.failureReason || 'NETWORK_ERROR';
        const severityMap = {
          INSUFFICIENT_FUNDS: 'HIGH',
          BANK_TIMEOUT: 'CRITICAL',
          INVALID_ACCOUNT: 'MEDIUM',
          DUPLICATE_TXN: 'HIGH',
          NETWORK_ERROR: 'HIGH',
          AUTH_FAILED: 'CRITICAL',
          LIMIT_EXCEEDED: 'MEDIUM',
          FROZEN_WALLET: 'HIGH',
        };
        await ErrorLog.create({
          transactionId: doc._id,
          errorCode: severityMap[reason] ? reason : 'NETWORK_ERROR',
          severity: severityMap[reason] || 'HIGH',
          message: `Transaction ${doc.referenceCode} failed: ${reason}`,
          resolved: false,
        });
      }
    }
  } catch (_) {
  }
});

const Transaction = mongoose.model('Transaction', TransactionSchema);
export default Transaction;
