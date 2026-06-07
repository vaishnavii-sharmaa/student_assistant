import { NavLink } from 'react-router-dom';
import { BookOpen, LayoutDashboard, Bell, Settings as SettingsIcon, BookMarked } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getNotifications } from '../api/notifications';

export default function MobileNav() {
  const { user } = useAuth();
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

    const interval = setInterval(fetchCount, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const links = [
    { to: '/study', label: 'Study', icon: BookOpen },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/summary', label: 'Summary', icon: BookMarked },
    { to: '/notifications', label: 'Alerts', icon: Bell, badge: unreadCount },
    { to: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-sidebar border-t border-slate-700 z-40 flex">
      {links.map(({ to, label, icon: Icon, badge }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-1 py-3 text-xs relative ${
              isActive ? 'text-indigo-400' : 'text-slate-400'
            }`
          }
        >
          <div className="relative">
            <Icon className="w-5 h-5" />
            {badge > 0 && (
              <span className="absolute -top-1 -right-2 bg-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                {badge}
              </span>
            )}
          </div>
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
