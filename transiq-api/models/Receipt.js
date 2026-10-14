import mongoose from 'mongoose';

const ReceiptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    accountNumber: { type: String, required: true, index: true },
    referenceCode: { type: String },
    accountType: {
      type: String,
      enum: ['savings', 'current', 'nri', 'ewa'],
      default: 'savings',
    },
    isFavorite: { type: Boolean, default: false, index: true },
    name: { type: String, required: true, trim: true },
    bankName: { type: String, required: true },
    ifscCode: { type: String, required: true },
    phone: { type: String, default: '' },
    email: { type: String, lowercase: true, default: '' },
  },
  { timestamps: true }
);

ReceiptSchema.index({ userId: 1, accountNumber: 1 });

ReceiptSchema.pre('save', function (next) {
  if (!this.referenceCode) {
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
    this.referenceCode = `RCP-${rand}`;
  }
  next();
});

const Receipt = mongoose.model('Receipt', ReceiptSchema);
export default Receipt;
