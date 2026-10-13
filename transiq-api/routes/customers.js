import express from 'express';
import auth from '../middleware/auth.js';
import * as customerController from '../controllers/customerController.js';

const router = express.Router();

router.get('/me', auth, customerController.getMe);
router.put('/me', auth, customerController.updateMe);
router.get('/dashboard', auth, customerController.dashboard);

export default router;
