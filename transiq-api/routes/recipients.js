import express from 'express';
import auth from '../middleware/auth.js';
import * as recipientController from '../controllers/recipientController.js';

const router = express.Router();

router.get('/', auth, recipientController.getAll);
router.post('/', auth, recipientController.create);
router.get('/search', auth, recipientController.getAll);
router.get('/:id', auth, recipientController.getById);
router.put('/:id', auth, recipientController.update);
router.delete('/:id', auth, recipientController.remove);
router.patch('/:id/favourite', auth, recipientController.toggleFavourite);

export default router;
