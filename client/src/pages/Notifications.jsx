import { useState, useEffect } from 'react';
import { getNotifications, createNotification, markAsRead, deleteNotification } from '../api/notifications';
import Layout from '../components/Layout';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Calendar,
  Flame,
  FileText,
  Plus,
  X,
  Loader2,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for custom reminder
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('exam'); // 'exam' | 'quiz'
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const { data } = await getNotifications();
      setNotifications(data);
    } catch {
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id, currentReadStatus) => {
    try {
      const targetRead = !currentReadStatus;
      await markAsRead(id, targetRead);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: targetRead } : n))
      );
      toast.success(targetRead ? 'Marked as read' : 'Marked as unread');
    } catch {
      toast.error('Failed to update notification status');
    }
  };

  const handleMarkAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    if (unread.length === 0) {
      toast.error('All notifications are already read');
      return;
    }

    try {
      const promises = unread.map((n) => markAsRead(n._id, true));
      await Promise.all(promises);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success('Notification deleted');
    } catch {
      toast.error('Failed to delete notification');
    }
  };

  const handleCreateReminder = async (e) => {
    e.preventDefault();
    if (!title || !message) {
      toast.error('Please enter a title and message');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { title, message, type };
      if (dueDate) {
        payload.dueDate = new Date(dueDate);
      }

      const { data } = await createNotification(payload);
      setNotifications((prev) => [data, ...prev]);
      toast.success('Custom reminder created successfully!');
      
      // Reset form & close modal
      setTitle('');
      setMessage('');
      setType('exam');
      setDueDate('');
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create reminder');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'streak':
        return <Flame className="w-5 h-5 text-orange-500" />;
      case 'quiz':
        return <FileText className="w-5 h-5 text-indigo-500" />;
      case 'exam':
      default:
        return <Calendar className="w-5 h-5 text-rose-500" />;
    }
  };

  const getBgClass = (type) => {
    switch (type) {
      case 'streak':
        return 'bg-orange-50 dark:bg-orange-950/20';
      case 'quiz':
        return 'bg-indigo-50 dark:bg-indigo-950/20';
      case 'exam':
      default:
        return 'bg-rose-50 dark:bg-rose-950/20';
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-2.5">
              <Bell className="w-7 h-7 text-indigo-500" />
              Notifications
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Stay on top of your study schedule, pending quizzes, exam reminders, and streaks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 font-medium text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCheck className="w-4 h-4 text-slate-500" />
              Mark all read
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-md shadow-indigo-100 dark:shadow-none transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Reminder
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            All Alerts ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
              filter === 'unread'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            Unread ({notifications.filter((n) => !n.read).length})
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3.5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              <p className="text-slate-500 text-sm">Loading your reminders...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-slate-100 dark:border-slate-800/60 rounded-2xl">
              <Bell className="w-12 h-12 text-slate-350 dark:text-slate-650 mb-3" />
              <p className="text-slate-700 dark:text-slate-300 font-semibold text-lg">No alerts found</p>
              <p className="text-slate-500 text-sm max-w-sm mt-1">
                You do not have any notifications in this section. Create a reminder or complete a study session.
              </p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {filteredNotifications.map((notification) => (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`flex gap-4 p-4 rounded-2xl border transition-all ${
                    notification.read
                      ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-850/60 opacity-75'
                      : 'bg-indigo-50/15 dark:bg-indigo-950/5 border-indigo-100/65 dark:border-indigo-900/30 ring-1 ring-indigo-500/5'
                  }`}
                >
                  <div className={`p-3 rounded-xl flex-shrink-0 self-start ${getBgClass(notification.type)}`}>
                    {getIcon(notification.type)}
                  </div>

                  <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className={`font-semibold text-sm sm:text-base truncate ${
                        notification.read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'
                      }`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 self-center" />
                      )}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 leading-relaxed">
                      {notification.message}
                    </p>

                    {/* Metadata (due dates, dates) */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-450 dark:text-slate-500 font-medium">
                      <span>
                        Received: {new Date(notification.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {notification.dueDate && (
                        <span className="flex items-center gap-1 text-rose-500 dark:text-rose-450">
                          <Calendar className="w-3.5 h-3.5" />
                          Due: {new Date(notification.dueDate).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-1.5 self-center">
                    <button
                      onClick={() => handleMarkAsRead(notification._id, notification.read)}
                      className={`p-2 rounded-lg transition-colors cursor-pointer ${
                        notification.read
                          ? 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                          : 'hover:bg-indigo-100/50 dark:hover:bg-indigo-950/30 text-indigo-500 dark:text-indigo-400'
                      }`}
                      title={notification.read ? 'Mark as unread' : 'Mark as read'}
                    >
                      {notification.read ? <Check className="w-4.5 h-4.5" /> : <CheckCheck className="w-4.5 h-4.5" />}
                    </button>
                    <button
                      onClick={() => handleDelete(notification._id)}
                      className="p-2 rounded-lg hover:bg-rose-550/10 hover:text-rose-600 text-slate-400 dark:text-slate-550 transition-colors cursor-pointer"
                      title="Delete alert"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Modal for Creating Custom Reminder */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-slate-900/60 dark:bg-black/85 backdrop-blur-xs"
              />

              {/* Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: 'spring', duration: 0.35 }}
                className="relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl rounded-2xl w-full max-w-md p-6 overflow-hidden z-10 text-slate-900 dark:text-white"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
                    Add Custom Study Alert
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateReminder} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-650 dark:text-slate-400">
                      Alert Category
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setType('exam')}
                        className={`py-2 px-3 rounded-xl border font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          type === 'exam'
                            ? 'border-rose-500 bg-rose-50/20 text-rose-600 dark:text-rose-450 dark:bg-rose-950/10'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                        }`}
                      >
                        <Calendar className="w-4 h-4" />
                        Upcoming Exam
                      </button>
                      <button
                        type="button"
                        onClick={() => setType('quiz')}
                        className={`py-2 px-3 rounded-xl border font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          type === 'quiz'
                            ? 'border-indigo-600 bg-indigo-50/20 text-indigo-600 dark:text-indigo-400 dark:bg-indigo-950/10'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                        }`}
                      >
                        <FileText className="w-4 h-4" />
                        Quiz Reminder
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-655 dark:text-slate-400">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Physics Quiz 3 Preparation"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-655 dark:text-slate-400">
                      Description Message
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Enter detailed reminder text or tasks..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-655 dark:text-slate-400 flex items-center gap-1">
                      Due Date & Time
                      <span className="text-xs text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-slate-600 dark:text-slate-300"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3.5">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4.5 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 text-slate-705 dark:text-slate-400 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-sm shadow-md shadow-indigo-100 dark:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      Add to Board
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
