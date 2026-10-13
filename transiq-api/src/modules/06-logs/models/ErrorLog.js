import mongoose from 'mongoose';

const errorLogSchema = new mongoose.Schema(
  {
    errorId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    transactionId: {
      type: String,
      ref: 'TransactionLog',
      index: true,
    },
    errorCode: {
      type: String,
      required: true,
      enum: [
        'INVALID_AMOUNT',
        'INSUFFICIENT_FUNDS',
        'INVALID_RECIPIENT',
        'BANK_TIMEOUT',
        'NETWORK_ERROR',
        'VALIDATION_ERROR',
        'AUTHORIZATION_FAILED',
        'DUPLICATE_TRANSACTION',
        'SYSTEM_ERROR',
        'UNKNOWN_ERROR',
      ],
      index: true,
    },
    errorMessage: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
    source: {
      type: String,
      enum: ['VALIDATION', 'PROCESSING', 'BANKING', 'NETWORK', 'SYSTEM'],
      required: true,
    },
    remitterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Remitter',
    },
    stackTrace: String,
    requestData: mongoose.Schema.Types.Mixed,
    responseData: mongoose.Schema.Types.Mixed,
    resolved: {
      type: Boolean,
      default: false,
      index: true,
    },
    resolutionNotes: String,
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for queries
errorLogSchema.index({ errorCode: 1, timestamp: -1 });
errorLogSchema.index({ severity: 1, timestamp: -1 });
errorLogSchema.index({ resolved: 1, timestamp: -1 });
errorLogSchema.index({ createdAt: -1 });

const ErrorLog = mongoose.model('ErrorLog_Legacy', errorLogSchema);
export default ErrorLog;
