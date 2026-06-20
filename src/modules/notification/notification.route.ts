import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { getNotifications,markAsRead, markAsReadAll, deleteNotification } from "./notification.controller";

const router = Router()

router.get('/', authenticate, getNotifications)
router.put('/read-all', authenticate, markAsReadAll)
router.put('/:notificationId/read', authenticate, markAsRead)
router.delete('/:notificationId', authenticate, deleteNotification)

export default router