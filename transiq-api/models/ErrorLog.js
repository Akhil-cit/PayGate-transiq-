import mongoose from 'mongoose';

const ErrorLogSchema = new mongoose.Schema(
  {
    errorId: {
      type: String,
      unique: true,
      index: true,
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
      index: true,
      default: null,
    },
    errorCode: {
      type: String,
      enum: [
        'INSUFFICIENT_FUNDS',
        'BANK_TIMEOUT',
        'INVALID_ACCOUNT',
        'DUPLICATE_TXN',
        'NETWORK_ERROR',
        'AUTH_FAILED',
        'LIMIT_EXCEEDED',
        'FROZEN_WALLET',
      ],
      required: true,
      index: true,
    },
    severity: {
      type: String,
      enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
      required: true,
      index: true,
    },
    message: { type: String, required: true },
    resolved: { type: Boolean, default: false, index: true },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    resolvedAt: { type: Date, default: null },
    resolutionNotes: { type: String, default: '' },
    stackTrace: { type: String, default: '' },
  },
  { timestamps: true }
);

ErrorLogSchema.index({ resolved: 1, severity: 1 });
ErrorLogSchema.index({ errorCode: 1, resolved: 1 });

ErrorLogSchema.pre('save', function (next) {
  if (!this.errorId) {
    this.errorId = `ERR-${Date.now().toString(36).toUpperCase()}`;
  }
  next();
});

const ErrorLog = mongoose.model('ErrorLog', ErrorLogSchema);
export default ErrorLog;
