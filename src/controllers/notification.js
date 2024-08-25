import * as notificationService from '../services/notification.js';
import { response } from '../services/utils.js';

const createNotification = async (req, res) => {
    try {
        const user = req.user;
        const { content, action_type } = req.body;

        if (!content || !action_type) {
            return res.status(400).json(response("failed", "Content and action_type are required"));
        }

        const notificationData = {
            user_id: user.dataValues.id,
            content,
            action_type
        };
        const notification = await notificationService.createNotification(notificationData);

        return res.status(201).json(response("success", "Notification created successfully", "notification", notification));
    } catch (error) {
        return res.status(500).json(response("error", error.message));
    }
};

const getAllNotification = async (req, res) => {
    try {
        const userData = req.user;

        const notifications = await notificationService.getAllNotifications(userData.id);

        return res.status(200).json(response("success", "Notifications retrieved successfully", "notifications", notifications));
    } catch (error) {
        return res.status(500).json(response("error", error.message));
    }
};

const getNotificationByUUID = async (req, res) => {
    try {
        const { uuid } = req.params;

        if (!uuid) {
            return res.status(400).json(response("failed", "Invalid UUID"));
        }

        const notification = await notificationService.getNotificationByUUID(uuid);

        if (!notification) {
            return res.status(404).json(response("failed", "Notification not found"));
        }

        return res.status(200).json(response("success", "Notification retrieved successfully", "notification", notification));
    } catch (error) {
        return res.status(500).json(response("error", error.message));
    }
};

const updateNotificationByUUID = async (req, res) => {
    try {
        const { uuid } = req.params;
        const { content, action_type, has_seen } = req.body;

        if (!uuid) {
            return res.status(400).json(response("failed", "Invalid UUID"));
        }

        const updatedNotification = await notificationService.updateNotificationByUUID(uuid, { content, action_type, has_seen });

        if (!updatedNotification) {
            return res.status(404).json(response("failed", "Notification not found"));
        }

        return res.status(200).json(response("success", "Notification updated successfully", "notification", updatedNotification));
    } catch (error) {
        return res.status(500).json(response("error", error.message));
    }
};

const deleteNotificationByUUID = async (req, res) => {
    try {
        const { uuid } = req.params;

        if (!uuid) {
            return res.status(400).json(response("failed", "Invalid UUID"));
        }

        const deletedNotification = await notificationService.deleteNotificationByUUID(uuid);

        if (!deletedNotification) {
            return res.status(404).json(response("failed", "Notification not found"));
        }

        return res.status(200).json(response("success", "Notification deleted successfully", "notification", deletedNotification));
    } catch (error) {
        return res.status(500).json(response("error", error.message));
    }
};

export { createNotification, getAllNotification, getNotificationByUUID, deleteNotificationByUUID, updateNotificationByUUID }