import express from 'express';
import * as notificationController from '../controllers/notification.js';
import * as middleware from '../middlewares/authentication.js';

const router = express.Router();

router.post('/notification/create', middleware.verifyToken, notificationController.createNotification);
router.get('/notification/get', middleware.verifyToken, notificationController.getAllNotification);
router.put('/notification/:uuid/update', middleware.verifyToken, notificationController.updateNotificationByUUID);
router.delete('/notification/delete', middleware.verifyToken, notificationController.deleteNotificationByUUID);

export default router;
