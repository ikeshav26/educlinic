import express from 'express';
import {
    createEvent,
    deleteEvent,
    getAllEvents,
    getEventById,
    updateEvent,
} from '../controller/event.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { UserRole } from '../../generated/prisma/enums.js';

const router: express.Router = express.Router();

router.post('/create', authMiddleware(UserRole.ADMIN), createEvent);
router.get('/all-events', authMiddleware(UserRole.USER), getAllEvents);
router.get('/:id', authMiddleware(UserRole.USER), getEventById);
router.patch('/update/:id', authMiddleware(UserRole.ADMIN), updateEvent);
router.delete('/delete/:id', authMiddleware(UserRole.ADMIN), deleteEvent);


export default router;
