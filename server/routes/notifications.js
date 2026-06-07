import { Router } from 'express';
import {
  getNotifications,
  createNotification,
  markAsRead,
  deleteNotification,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.route('/')
  .get(getNotifications)
  .post(createNotification);

router.route('/:id')
  .put(markAsRead)
  .delete(deleteNotification);

export default router;
