import mongoose from 'mongoose';
import Receipt from '../models/Receipt.js';

export const getAll = async (req, res, next) => {
  try {
    const filter = { userId: req.user._id };

    if (req.query.accountType) filter.accountType = req.query.accountType;
    if (req.query.isFavorite !== undefined) filter.isFavorite = req.query.isFavorite === 'true';

    if (req.query.search) {
      const escaped = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(escaped, 'i');
      filter.$or = [
        { name: searchRegex },
        { bankName: searchRegex },
        { accountNumber: searchRegex },
        { ifscCode: searchRegex },
      ];
    }

    const recipients = await Receipt.find(filter).sort({ isFavorite: -1, createdAt: -1 });

    res.json({
      success: true,
      count: recipients.length,
      data: recipients,
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { name, accountNumber, bankName, ifscCode, accountType, phone, email } = req.body;

    const trimmedAccount = (accountNumber || '').toString().trim();
    const trimmedIfsc = (ifscCode || '').toString().trim().toUpperCase();
    const trimmedName = (name || '').toString().trim();
    const trimmedBank = (bankName || '').toString().trim();

    const existing = await Receipt.findOne({
      userId: req.user._id,
      accountNumber: trimmedAccount,
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'This account number is already saved as a recipient',
      });
    }

    const recipient = await Receipt.create({
      userId: req.user._id,
      name: trimmedName,
      accountNumber: trimmedAccount,
      bankName: trimmedBank,
      ifscCode: trimmedIfsc,
      accountType: accountType || 'savings',
      phone: phone ? phone.toString().trim() : '',
      email: email ? email.toString().trim().toLowerCase() : '',
    });

    res.status(201).json({
      success: true,
      message: 'Recipient added successfully',
      data: recipient,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Duplicate recipient — this account number already exists',
      });
    }
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid recipient ID' });
    }

    const recipient = await Receipt.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!recipient) {
      return res.status(404).json({ success: false, message: 'Recipient not found' });
    }

    res.json({ success: true, data: recipient });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid recipient ID' });
    }

    const allowedFields = ['name', 'accountNumber', 'bankName', 'ifscCode', 'accountType', 'phone', 'email'];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    if (updates.accountNumber) {
      updates.accountNumber = updates.accountNumber.toString().trim();
      const duplicate = await Receipt.findOne({
        userId: req.user._id,
        accountNumber: updates.accountNumber,
        _id: { $ne: req.params.id },
      });
      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: 'Another recipient already has this account number',
        });
      }
    }

    if (updates.name) updates.name = updates.name.toString().trim();
    if (updates.bankName) updates.bankName = updates.bankName.toString().trim();
    if (updates.ifscCode) updates.ifscCode = updates.ifscCode.toString().trim().toUpperCase();
    if (updates.phone !== undefined) updates.phone = updates.phone ? updates.phone.toString().trim() : '';
    if (updates.email !== undefined) updates.email = updates.email ? updates.email.toString().trim().toLowerCase() : '';

    const recipient = await Receipt.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!recipient) {
      return res.status(404).json({ success: false, message: 'Recipient not found' });
    }

    res.json({
      success: true,
      message: 'Recipient updated successfully',
      data: recipient,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid recipient ID' });
    }

    const recipient = await Receipt.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!recipient) {
      return res.status(404).json({ success: false, message: 'Recipient not found' });
    }

    res.json({
      success: true,
      message: 'Recipient removed successfully',
      data: { _id: recipient._id },
    });
  } catch (error) {
    next(error);
  }
};

export const toggleFavourite = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid recipient ID' });
    }

    const recipient = await Receipt.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!recipient) {
      return res.status(404).json({ success: false, message: 'Recipient not found' });
    }

    recipient.isFavorite = !recipient.isFavorite;
    await recipient.save();

    res.json({
      success: true,
      message: recipient.isFavorite ? 'Marked as favourite' : 'Removed from favourites',
      data: recipient,
    });
  } catch (error) {
    next(error);
  }
};
