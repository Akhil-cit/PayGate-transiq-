import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, default: '', trim: true },
    email: {
      type: String, required: true, unique: true,
      lowercase: true, trim: true, index: true,
    },
    password: { type: String, required: true, minlength: 8 },
    phone: { type: String, required: true, unique: true, index: true },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
      index: true,
    },
    isActive: { type: Boolean, default: true, index: true },
    twoFactorEnabled: { type: Boolean, default: true },
    biometricsEnabled: { type: Boolean, default: false },
    autoLockMinutes: { type: Number, default: 15 },
    activeSessions: [
      {
        device: { type: String, required: true },
        location: { type: String, default: 'India' },
        ipAddress: { type: String, default: '127.0.0.1' },
        lastActive: { type: String, default: 'Just now' },
        isCurrent: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    securityLogs: [
      {
        event: { type: String, required: true },
        status: { type: String, default: 'SUCCESS' },
        ip: { type: String, default: '127.0.0.1' },
        device: { type: String, default: 'Web Browser' },
        timestamp: { type: String, default: () => new Date().toISOString().replace('T', ' ').slice(0, 19) },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    superUserIdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// ── Pre-save: Hash password if modified ──────────────────────────────────────
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10));
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Pre-findOneAndUpdate: Hash password if being updated ─────────────────────
UserSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  if (update && update.password) {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10));
    update.password = await bcrypt.hash(update.password, salt);
  }
  next();
});

// ── Post-save: Auto-create Wallet for new users ───────────────────────────────
UserSchema.post('save', async function (doc) {
  if (this.isNew) {
    try {
      const Wallet = mongoose.model('Wallet');
      const existing = await Wallet.findOne({ userId: doc._id });
      if (!existing) {
        await Wallet.create({ userId: doc._id, mainBalance: 0, currency: 'INR', isFrozen: false });
      }
    } catch (_) {
      // Wallet model may not be loaded yet in some test scenarios
    }
  }
});

// ── Instance method: Compare password ────────────────────────────────────────
UserSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model('User', UserSchema);
export default User;
