import express from 'express';
import auth from '../middleware/auth.js';
import * as transactionController from '../controllers/transactionController.js';

const router = express.Router();

router.get('/', auth, transactionController.getAll);
router.post('/', auth, transactionController.initiate);
router.post('/validate', auth, transactionController.validateTransaction);
router.get('/:id', auth, transactionController.getById);
router.patch('/:id/cancel', auth, transactionController.cancel);
router.patch('/:id/retry', auth, transactionController.retry);

export default router;
