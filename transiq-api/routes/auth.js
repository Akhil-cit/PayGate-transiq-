import express from 'express';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import validate from '../middleware/validate.js';
import User from '../models/User.js';
import Wallet from '../models/Wallet.js';

const router = express.Router();

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

router.post(
  '/register',
  [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 8 }).withMessage('Password min 8 characters'),
    body('phone').notEmpty().withMessage('Phone is required'),
  ],
  validate,
  async (req, res) => {
    try {
      const { firstName, lastName, email, password, phone } = req.body;
      const exists = await User.findOne({ $or: [{ email }, { phone }] });
      if (exists) {
        return res.status(409).json({ success: false, message: 'Email or phone already registered' });
      }
      const user = await User.create({ firstName, lastName, email, password, phone, role: 'customer' });
      await Wallet.create({ userId: user._id, mainBalance: 50000, currency: 'INR' });
      const token = signToken(user._id);
      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: { token, user: { id: user._id, firstName, lastName, email, role: user.role } },
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
      if (!user.isActive) {
        return res.status(403).json({ success: false, message: 'Account is deactivated' });
      }
      const token = signToken(user._id);
      res.json({
        success: true,
        message: 'Login successful',
        data: { token, user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role } },
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

router.post('/verify-user', async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier || !identifier.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter a name, email, or phone number to verify.' });
    }

    const q = identifier.trim();
    const user = await User.findOne({
      $or: [
        { email: q.toLowerCase() },
        { phone: q },
        { firstName: new RegExp(`^${escapeRegex(q)}$`, 'i') },
        { lastName: new RegExp(`^${escapeRegex(q)}$`, 'i') },
      ],
    });

    if (user) {
      return res.json({
        exists: true,
        message: `User "${user.firstName} ${user.lastName}" found in database.`,
        data: { firstName: user.firstName, lastName: user.lastName },
      });
    }

    return res.json({
      exists: false,
      message: `No account matching "${q}" was found in the database. Please sign up to create a new profile.`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
