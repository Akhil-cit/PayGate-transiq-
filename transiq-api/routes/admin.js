import express from 'express';
import auth from '../middleware/auth.js';
import adminOnly from '../middleware/adminOnly.js';
import * as ctrl from '../controllers/adminController.js';

const router = express.Router();

router.use(auth, adminOnly);

router.get('/stats', ctrl.getStats);

router.get('/transactions',                        ctrl.getAllTransactions);
router.get('/transactions/:id',                    ctrl.getTransactionById);
router.patch('/transactions/:id/force-success',    ctrl.forceSuccess);
router.patch('/transactions/:id/force-fail',       ctrl.forceFail);

router.get('/errors',                ctrl.getErrors);
router.patch('/errors/:id/resolve',  ctrl.resolveError);
router.post('/errors/resolve-all',   ctrl.resolveAllErrors);

router.get('/users',                      ctrl.getAllUsers);
router.patch('/users/:id/freeze',         ctrl.freezeUserWallet);
router.patch('/users/:id/activate',       ctrl.toggleUserActive);

export default router;
