import api from './axios';

export const getNotifications = () => api.get('/notifications');
export const createNotification = (data) => api.post('/notifications', data);
export const markAsRead = (id, read) => api.put(`/notifications/${id}`, { read });
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);
