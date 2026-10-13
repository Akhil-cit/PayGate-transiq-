import express from 'express';
import auth from '../middleware/auth.js';
import * as paymentController from '../controllers/paymentController.js';

const router = express.Router();

router.get('/dummy-accounts', auth, paymentController.getDummyBanks);
router.post('/accounts/add', auth, paymentController.addBankAccount);
router.post('/accounts/verify-otp', auth, paymentController.verifyOtp);
router.post('/accounts/split', auth, paymentController.splitWallet);
router.post('/split', auth, paymentController.splitWallet);

export default router;
