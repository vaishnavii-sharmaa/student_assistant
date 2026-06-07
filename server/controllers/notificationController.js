import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
  try {
    let notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });

    // Seed mock data if user has no notifications
    if (notifications.length === 0) {
      const mockNotifications = [
        {
          user: req.user._id,
          title: '🔥 Keep the streak alive!',
          message: 'Complete a study session today to maintain your learning streak.',
          type: 'streak',
          read: false,
        },
        {
          user: req.user._id,
          title: '📝 Ready for your next quiz?',
          message: 'Take a quick quiz to check your understanding of your recent topics.',
          type: 'quiz',
          read: false,
        },
        {
          user: req.user._id,
          title: '📅 Mathematics Midterm Exam',
          message: 'Don\'t forget to study for your upcoming math examination scheduled soon.',
          type: 'exam',
          read: false,
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        },
      ];

      notifications = await Notification.insertMany(mockNotifications);
      // Sort newly inserted
      notifications.sort((a, b) => b.createdAt - a.createdAt);
    }

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
