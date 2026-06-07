import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { updateProfile } from '../api/auth';
import Layout from '../components/Layout';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  GraduationCap,
  Bell,
  Lock,
  MapPin,
  Mail,
  Palette,
  Check,
  Loader2,
} from 'lucide-react';

const GithubIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Settings() {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);

  // Profile fields
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(user?.address || '');
  const [github, setGithub] = useState(user?.github || '');
  const [linkedin, setLinkedin] = useState(user?.linkedin || '');

  // Academic details
  const [college, setCollege] = useState(user?.academicDetails?.college || '');
  const [major, setMajor] = useState(user?.academicDetails?.major || '');
  const [graduationYear, setGraduationYear] = useState(user?.academicDetails?.graduationYear || '');
  const [gpa, setGpa] = useState(user?.academicDetails?.gpa || '');

  // Theme & Notifications
  const [theme, setTheme] = useState(user?.theme || 'light');
  const [quizReminders, setQuizReminders] = useState(
    user?.notificationPreferences?.quizReminders !== false
  );
  const [upcomingExams, setUpcomingExams] = useState(
    user?.notificationPreferences?.upcomingExams !== false
  );
  const [studyStreakAlerts, setStudyStreakAlerts] = useState(
    user?.notificationPreferences?.studyStreakAlerts !== false
  );

  // Security fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        name,
        email,
        address,
        github,
        linkedin,
        academicDetails: {
          college,
          major,
          graduationYear,
          gpa,
        },
        theme,
        notificationPreferences: {
          quizReminders,
          upcomingExams,
          studyStreakAlerts,
        },
      };

      if (activeTab === 'security') {
        if (!currentPassword || !newPassword) {
          toast.error('Please enter both current and new passwords');
          setIsLoading(false);
          return;
        }
        if (newPassword !== confirmPassword) {
          toast.error('Passwords do not match');
          setIsLoading(false);
          return;
        }
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const { data } = await updateProfile(payload);
      
      const updatedUser = {
        ...user,
        name: data.name,
        email: data.email,
        address: data.address,
        github: data.github,
        linkedin: data.linkedin,
        academicDetails: data.academicDetails,
        theme: data.theme,
        notificationPreferences: data.notificationPreferences,
      };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast.success('Settings updated successfully!');
      
      // Clear security fields on success
      if (activeTab === 'security') {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'User Profile', icon: User },
    { id: 'academic', label: 'Academic Details', icon: GraduationCap },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage your personal profile, academic information, and interface preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          {/* Navigation Sidebar */}
          <div className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 scrollbar-none border-b md:border-b-0 border-slate-200 dark:border-slate-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-sm whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100 dark:shadow-none'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content Pane */}
          <div className="md:col-span-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl p-6 md:p-8">
            <form onSubmit={handleUpdateProfile}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'profile' && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                          Personal Information
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                          Update your basic account details and social profile links.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Full Name
                          </label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                              placeholder="John Doe"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                            <input
                              type="email"
                              value={email}
                              disabled
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed text-sm"
                              placeholder="john@example.com"
                            />
                          </div>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Address
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                            <input
                              type="text"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                              placeholder="123 Main St, New York, NY"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            GitHub URL
                          </label>
                          <div className="relative">
                            <GithubIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                            <input
                              type="url"
                              value={github}
                              onChange={(e) => setGithub(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                              placeholder="https://github.com/username"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            LinkedIn URL
                          </label>
                          <div className="relative">
                            <LinkedinIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                            <input
                              type="url"
                              value={linkedin}
                              onChange={(e) => setLinkedin(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                              placeholder="https://linkedin.com/in/username"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'academic' && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                          Academic Details
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                          Share your collegiate information to personalize study reports.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            College / University
                          </label>
                          <input
                            type="text"
                            value={college}
                            onChange={(e) => setCollege(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                            placeholder="Harvard University"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Major / Field of Study
                          </label>
                          <input
                            type="text"
                            value={major}
                            onChange={(e) => setMajor(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                            placeholder="Computer Science"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Graduation Year
                          </label>
                          <input
                            type="text"
                            value={graduationYear}
                            onChange={(e) => setGraduationYear(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                            placeholder="2027"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            GPA (Cumulative)
                          </label>
                          <input
                            type="text"
                            value={gpa}
                            onChange={(e) => setGpa(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                            placeholder="3.8"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'preferences' && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                          Preferences & Settings
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                          Configure theme choices and control notification alerts.
                        </p>
                      </div>

                      {/* Theme Selector */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Application Theme
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => setTheme('light')}
                            className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                              theme === 'light'
                                ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/10'
                                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                          >
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                              ☀️
                            </div>
                            <span className="text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-1.5">
                              Light Mode
                              {theme === 'light' && <Check className="w-4 h-4 text-indigo-600" />}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setTheme('dark')}
                            className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                              theme === 'dark'
                                ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/10'
                                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                          >
                            <div className="w-10 h-10 rounded-full bg-slate-800 text-indigo-300 flex items-center justify-center">
                              🌙
                            </div>
                            <span className="text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-1.5">
                              Dark Mode
                              {theme === 'dark' && <Check className="w-4 h-4 text-indigo-400" />}
                            </span>
                          </button>
                        </div>
                      </div>

                      <hr className="border-slate-100 dark:border-slate-800" />

                      {/* Notification Preferences */}
                      <div className="space-y-4">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Bell className="w-4 h-4 text-indigo-500" />
                          Notification Preferences
                        </label>
                        <div className="space-y-3.5">
                          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                            <div>
                              <p className="text-sm font-semibold text-slate-800 dark:text-white">
                                Quiz Reminders
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Receive notifications to complete pending mock quizzes.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setQuizReminders(!quizReminders)}
                              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                                quizReminders ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                              }`}
                            >
                              <span
                                className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                                  quizReminders ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                            <div>
                              <p className="text-sm font-semibold text-slate-800 dark:text-white">
                                Upcoming Exams
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Get alerted about scheduled examinations and midterms.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setUpcomingExams(!upcomingExams)}
                              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                                upcomingExams ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                              }`}
                            >
                              <span
                                className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                                  upcomingExams ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                            <div>
                              <p className="text-sm font-semibold text-slate-800 dark:text-white">
                                Study Streak Alerts
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Alerts warning you when you are about to lose your daily streak.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setStudyStreakAlerts(!studyStreakAlerts)}
                              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                                studyStreakAlerts ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                              }`}
                            >
                              <span
                                className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                                  studyStreakAlerts ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'security' && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                          Account Security
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                          Update your login password to keep your account safe.
                        </p>
                      </div>

                      <div className="space-y-5 max-w-md">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                            placeholder="••••••••"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                            placeholder="Min 6 characters"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Submit Buttons */}
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium shadow-md shadow-indigo-100 dark:shadow-none transition-all text-sm flex items-center gap-2 cursor-pointer"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
