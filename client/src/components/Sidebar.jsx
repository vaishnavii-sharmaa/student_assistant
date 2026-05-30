import { NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, LayoutDashboard, LogOut, GraduationCap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const links = [
  { to: '/study', label: 'Study', icon: BookOpen },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
        {links.map(({ to, label, icon: Icon }) => (
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
            <Icon className="w-5 h-5" />
            {label}
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
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
