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

// Get all posts
router.get('/', authMiddleware(), getAllPosts);

// Get post by ID
router.get('/:id', authMiddleware(), getPostById);

// Create a post
router.post('/', authMiddleware(), createPost);

// Toggle like on a post
router.post('/:id/like', authMiddleware(), togglePostLike);

// Create a comment (or reply) on a post
router.post('/:id/comments', authMiddleware(), createComment);

// Toggle like on a comment
router.post('/comments/:commentId/like', authMiddleware(), toggleCommentLike);

export default router;
