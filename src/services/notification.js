import db from '../models/index.js';
const { Notification } = db;

const createNotification = async (notificationData) => {
    try {
        const notification = await Notification.create(notificationData);
        return notification;
    } catch (error) {
        throw new Error(`Failed to create notification: ${error.message}`);
    }
};

const getAllNotifications = async (userId) => {
    try {
        const notifications = await Notification.findAll({
            where: { user_id: userId },
            order: [['createdAt', 'DESC']],
        });
        return notifications;
    } catch (error) {
        throw new Error(`Failed to retrieve notifications: ${error.message}`);
    }
};

const getNotificationByUUID = async (uuid) => {
    try {
        const notification = await Notification.findOne({
            where: { uuid },
        });
        return notification;
    } catch (error) {
        throw new Error(`Failed to retrieve notification: ${error.message}`);
    }
};

const updateNotificationByUUID = async (uuid, updateData) => {
    try {
        const notification = await Notification.findOne({
            where: { uuid },
        });

        if (!notification) {
            return null;
        }

        await notification.update(updateData);
        return notification;
    } catch (error) {
        throw new Error(`Failed to update notification: ${error.message}`);
    }
};

const deleteNotificationByUUID = async (uuid) => {
    try {
        const notification = await Notification.findOne({
            where: { uuid },
        });

        if (!notification) {
            return null;
        }

        await notification.destroy();
        return notification;
    } catch (error) {
        throw new Error(`Failed to delete notification: ${error.message}`);
    }
};

export { createNotification, getAllNotifications, getNotificationByUUID, updateNotificationByUUID, deleteNotificationByUUID }