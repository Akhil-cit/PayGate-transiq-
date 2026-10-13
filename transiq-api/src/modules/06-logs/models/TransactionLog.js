import mongoose from 'mongoose';

const transactionLogSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    remitterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Remitter',
      required: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipient',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['INITIATED', 'PENDING', 'PROCESSING', 'SUCCESS', 'FAILED'],
      default: 'INITIATED',
      index: true,
    },
    statusHistory: [
      {
        status: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        details: String,
      },
    ],
    paymentMethod: {
      type: String,
      enum: ['BANK_TRANSFER', 'WALLET', 'CARD'],
      required: true,
    },
    description: String,
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    completionTime: Date,
    metadata: {
      bankRefId: String,
      authorizationCode: String,
      ipAddress: String,
      userAgent: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for queries
transactionLogSchema.index({ remitterId: 1, timestamp: -1 });
transactionLogSchema.index({ status: 1, timestamp: -1 });
transactionLogSchema.index({ createdAt: -1 });

const TransactionLog = mongoose.model('TransactionLog_Legacy', transactionLogSchema);
export default TransactionLog;
