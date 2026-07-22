import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  getConversations,
  getMessagesWithUser,
  markMessagesAsRead,
  sendMessageHttp,
} from '../controller/chat.controller.js';

const router: Router = Router();

// Protect all chat routes with authentication middleware
router.use(authMiddleware());

router.get('/conversations', getConversations);
router.get('/messages/:partnerId', getMessagesWithUser);
router.post('/read/:partnerId', markMessagesAsRead);
router.post('/send', sendMessageHttp);

export default router;
