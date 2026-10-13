import mongoose from 'mongoose';

const PocketSchema = new mongoose.Schema(
  {
    walletId: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    currentAmount: { type: Number, default: 0, min: 0 },
    targetAmount: { type: Number, default: 0, min: 0 },
    isLocked: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

PocketSchema.pre('save', function (next) {
  if (this.isLocked && this.isModified('currentAmount') && !this.isNew) {
    return next(new Error('Locked pocket cannot be withdrawn from or modified'));
  }
  next();
});

const Pocket = mongoose.model('Pocket', PocketSchema);
export default Pocket;
