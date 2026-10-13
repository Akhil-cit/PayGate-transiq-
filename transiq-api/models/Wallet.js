import mongoose from 'mongoose';

const WalletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    mainBalance: { type: Number, default: 0, min: 0 },
    currency: {
      type: String,
      enum: ['INR', 'USD', 'EUR', 'BTC'],
      default: 'INR',
      index: true,
    },
    isFrozen: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// ── Compound index: one wallet per user (enforced by unique on userId) ────────


// ── Pre-save: Reject balance changes if wallet is frozen ──────────────────────
WalletSchema.pre('save', function (next) {
  if (this.isFrozen && this.isModified('mainBalance')) {
    return next(new Error('Cannot modify balance of a frozen wallet'));
  }
  next();
});

const Wallet = mongoose.model('Wallet', WalletSchema);
export default Wallet;
