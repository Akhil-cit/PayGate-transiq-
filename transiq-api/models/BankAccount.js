import mongoose from 'mongoose';

const BankAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true, trim: true },
    accountNumber: { type: String, required: true },
    maskedNumber: { type: String, default: '' },
    balance: { type: Number, default: 0, min: 0 },
    accountType: {
      type: String,
      enum: ['SAVINGS', 'SALARY', 'CURRENT', 'NRI', 'WALLET'],
      default: 'SAVINGS',
    },
    bankName: { type: String, required: true },
    ifscCode: { type: String, default: '' },
    isVerified: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['ACTIVE', 'FROZEN', 'CLOSED'],
      default: 'ACTIVE',
    },
  },
  { timestamps: true }
);

BankAccountSchema.index({ userId: 1, accountNumber: 1 }, { unique: true });

const BankAccount = mongoose.model('BankAccount', BankAccountSchema);
export default BankAccount;
