import express from 'express';
import auth from '../middleware/auth.js';
import * as paymentController from '../controllers/paymentController.js';

const router = express.Router();

router.get('/', auth, paymentController.getAccounts);

export default router;
