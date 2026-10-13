import express from 'express';
import auth from '../middleware/auth.js';
import adminOnly from '../middleware/adminOnly.js';
import * as ctrl from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require authentication + admin role
router.use(auth, adminOnly);

// ── KPI Dashboard ─────────────────────────────────────────────────────────────
router.get('/stats', ctrl.getStats);

// ── Transaction Management ────────────────────────────────────────────────────
router.get('/transactions',                        ctrl.getAllTransactions);
router.get('/transactions/:id',                    ctrl.getTransactionById);
router.patch('/transactions/:id/force-success',    ctrl.forceSuccess);
router.patch('/transactions/:id/force-fail',       ctrl.forceFail);

// ── Error Log Management ──────────────────────────────────────────────────────
router.get('/errors',                ctrl.getErrors);
router.patch('/errors/:id/resolve',  ctrl.resolveError);
router.post('/errors/resolve-all',   ctrl.resolveAllErrors);

// ── User Management ───────────────────────────────────────────────────────────
router.get('/users',                      ctrl.getAllUsers);
router.patch('/users/:id/freeze',         ctrl.freezeUserWallet);
router.patch('/users/:id/activate',       ctrl.toggleUserActive);

export default router;
