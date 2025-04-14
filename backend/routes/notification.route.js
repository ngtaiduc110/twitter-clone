import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { getNotifications, deleteNotifications } from '../controllers/notification.controller.js';

const notificationRoutes = express.Router();

notificationRoutes.get('/', protectRoute, getNotifications)
notificationRoutes.delete('/', protectRoute, deleteNotifications)
// notificationRoutes.delete('/:id', protectRoute, deleteNotification)

export default notificationRoutes