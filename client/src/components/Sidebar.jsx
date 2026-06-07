import { NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, LayoutDashboard, LogOut, GraduationCap, Bell, Settings as SettingsIcon, BookMarked } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getNotifications } from '../api/notifications';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchCount = async () => {
      try {
        const { data } = await getNotifications();
        const unread = data.filter((n) => !n.read).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error('Failed to fetch notification count:', err);
      }
    };
    fetchCount();

    const interval = setInterval(fetchCount, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { to: '/study', label: 'Study', icon: BookOpen },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/summary', label: 'Summary', icon: BookMarked },
    { to: '/notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { to: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <aside className="hidden md:flex w-64 min-h-screen bg-sidebar text-white flex-col fixed left-0 top-0 z-40">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-indigo-400" />
          <div>
            <h1 className="font-bold text-lg leading-tight">Student</h1>
            <p className="text-indigo-300 text-sm">Assistant</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, label, icon: Icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:bg-sidebar-hover hover:text-white'
              }`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="flex-grow">{label}</span>
            {badge > 0 && (
              <span className="bg-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="px-4 py-2 mb-2">
          <p className="text-sm font-medium truncate">{user?.name}</p>
          <p className="text-xs text-slate-400 truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-slate-300 hover:bg-sidebar-hover hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  );
}
