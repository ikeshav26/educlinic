import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getAllUsers, getUserById, blockUser, unblockUser } from '../controller/user.controller.js';

const router: express.Router = express.Router();

router.get('/', authMiddleware(), getAllUsers);
router.get('/:id', authMiddleware(), getUserById);
router.post('/:id/block', authMiddleware(), blockUser);
router.post('/:id/unblock', authMiddleware(), unblockUser);

export default router;
