import express from 'express';
import auth from '../middleware/auth.js';
import * as analyticsController from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/summary', auth, analyticsController.summary);
router.get('/by-method', auth, analyticsController.byMethod);
router.get('/by-month', auth, analyticsController.byMonth);
router.get('/insights', auth, analyticsController.insights);
router.get('/export', auth, analyticsController.exportCsv);

export default router;
