import express from 'express';
import auth from '../middleware/auth.js';
import * as securityController from '../controllers/securityController.js';

const router = express.Router();

router.put('/password', auth, securityController.changePassword);
router.patch('/freeze', auth, securityController.toggleFreeze);
router.delete('/account', auth, securityController.deactivateAccount);
router.get('/activity', auth, securityController.getActivityLog);
router.delete('/sessions/:sessionId', auth, securityController.terminateSession);
router.delete('/sessions', auth, securityController.terminateAllOtherSessions);
router.put('/settings', auth, securityController.updateSecuritySettings);

export default router;
