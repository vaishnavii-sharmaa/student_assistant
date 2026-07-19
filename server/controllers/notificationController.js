import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
  try {
    let notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });

    // Return notifications (empty array if none exist)

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createNotification = async (req, res) => {
  try {
    const { title, message, type, dueDate } = req.body;

    if (!title || !message || !type) {
      return res.status(400).json({ message: 'Please provide title, message, and type' });
    }

    const notification = await Notification.create({
      user: req.user._id,
      title,
      message,
      type,
      dueDate,
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { read } = req.body;
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: read !== undefined ? read : true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
