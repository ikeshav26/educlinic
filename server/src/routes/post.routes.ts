import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createPost,
  getAllPosts,
  getPostById,
  togglePostLike,
  createComment,
  toggleCommentLike,
} from '../controller/post.controller.js';

const router: Router = Router();

router.get('/', authMiddleware(), getAllPosts);
router.get('/:id', authMiddleware(), getPostById);
router.post('/', authMiddleware(), createPost);
router.post('/:id/like', authMiddleware(), togglePostLike);
router.post('/:id/comments', authMiddleware(), createComment);
router.post('/comments/:commentId/like', authMiddleware(), toggleCommentLike);

export default router;
