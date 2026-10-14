import express from 'express';
import auth from '../middleware/auth.js';
import * as pocketController from '../controllers/pocketController.js';

const router = express.Router();

router.get('/', auth, pocketController.list);
router.post('/', auth, pocketController.create);
router.put('/:id', auth, pocketController.update);

router.post('/:id/deposit', auth, pocketController.deposit);
router.patch('/:id/deposit', auth, pocketController.deposit);

router.post('/:id/withdraw', auth, pocketController.withdraw);
router.patch('/:id/withdraw', auth, pocketController.withdraw);

router.post('/:id/lock', auth, pocketController.toggleLock);
router.patch('/:id/lock', auth, pocketController.toggleLock);

router.delete('/:id', auth, pocketController.remove);

export default router;
