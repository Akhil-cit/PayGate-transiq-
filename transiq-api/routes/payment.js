import express from 'express';
import auth from '../middleware/auth.js';
import * as paymentController from '../controllers/paymentController.js';

const router = express.Router();

// Payment Initiation flow
router.post('/initiate', auth, paymentController.initiatePayment);
router.post('/validate-details', auth, paymentController.validateDetails);
router.post('/confirm', auth, paymentController.confirmPayment);
router.post('/authorize-pin', auth, paymentController.authorizePin);
router.post('/retry', auth, paymentController.retryPayment);

export default router;
