import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getAllUsers, getUserById } from '../controller/user.controller.js';

const router: express.Router = express.Router();

router.get('/', authMiddleware(), getAllUsers);
router.get('/:id', authMiddleware(), getUserById);

export default router;
