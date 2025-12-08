import createApiInstance from "./createApiInstance.js";
import { LOCAL_BASE_URL } from "../config/config.js";

// Gọi qua gateway (port 8080)
const getApiBaseUrl = () => {
  return LOCAL_BASE_URL || 'http://localhost:8080';
};

const API_URL = "/v1/notifications";

const api = createApiInstance(`${getApiBaseUrl()}${API_URL}`);

/**
 * @returns {Promise<Array>
 */
export const getNotificationsByUserId = async () => {
    try {
        const response = await api.get(`/getAllByUserId`);
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch notifications");
    }
};

/**
 * @returns {Promise<Array>}
 */
export const getNotificationsByShopId = async () => {
    try {
        const response = await api.get(`/getAllByShopId`);
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch shop notifications");
    }
};

/**cd
 * Mark notification as read
 * @param {string} notificationId - ID of the notification
 * @returns {Promise} Response from server
 */
export const markNotificationAsRead = async (notificationId) => {
    try {
        const response = await api.put(`/markAsRead/${notificationId}`);
        return response.data;
    } catch (error) {
        console.error("Error marking notification as read:", error);
        throw new Error("Failed to mark notification as read");
    }
};

/**
 * Delete a notification
 * @param {string} notificationId - ID of the notification
 * @returns {Promise} Response from server
 */
export const deleteNotification = async (notificationId) => {
    try {
        const response = await api.delete(`/delete/${notificationId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting notification:", error);
        throw new Error("Failed to delete notification");
    }
};

/**
 * Delete all notifications for the current user
 * @returns {Promise} Response from server
 */
export const deleteAllNotifications = async () => {
    try {
        const response = await api.delete(`/deleteAllByUserId`);
        return response.data;
    } catch (error) {
        console.error("Error deleting all notifications:", error);
        throw new Error("Failed to delete all notifications");
    }
};

/**
 * Delete all notifications for the current shop owner
 * @returns {Promise} Response from server
 */
export const deleteAllShopNotifications = async () => {
    try {
        const response = await api.delete(`/deleteAllByShopId`);
        return response.data;
    } catch (error) {
        console.error("Error deleting all shop notifications:", error);
        throw new Error("Failed to delete all shop notifications");
    }
};

/**
 * Mark all notifications as read for the current user
 * @returns {Promise} Response from server
 */
export const markAllNotificationsAsRead = async () => {
    try {
        const response = await api.put(`/markAllAsReadByUserId`);
        return response.data;
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        throw new Error("Failed to mark all notifications as read");
    }
};

/**
 * Mark all notifications as read for the current shop owner
 * @returns {Promise} Response from server
 */
export const markAllShopNotificationsAsRead = async () => {
    try {
        const response = await api.put(`/markAllAsReadByShopId`);
        return response.data;
    } catch (error) {
        console.error("Error marking all shop notifications as read:", error);
        throw new Error("Failed to mark all shop notifications as read");
    }
};

