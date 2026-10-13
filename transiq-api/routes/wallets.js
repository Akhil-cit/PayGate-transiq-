import express from 'express';
import auth from '../middleware/auth.js';
import * as walletController from '../controllers/walletController.js';
import * as paymentController from '../controllers/paymentController.js';

const router = express.Router();

router.get('/me', auth, walletController.getMine);
router.patch('/currency', auth, walletController.changeCurrency);
router.post('/split', auth, paymentController.splitWallet);

export default router;
