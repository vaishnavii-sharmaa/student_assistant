import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpen, LayoutDashboard, LogOut, GraduationCap, Bell,
  Settings as SettingsIcon, BookMarked, Camera, Video, Code2,
  Sparkles, User, Palette, Lock, Plus, CalendarDays, ChevronDown, Menu, X,
} from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSidebar } from '../context/useSidebar';
import { getNotifications } from '../api/notifications';
import { updateProfile } from '../api/auth';
import toast from 'react-hot-toast';

/* ─── Simple tooltip for collapsed icons without sub-links ─── */
function Tip({ label, children }) {
  return (
    <div className="relative group/tip flex justify-center">
      {children}
      <div className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50
                      opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150
                      bg-slate-800 dark:bg-slate-900 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg
                      whitespace-nowrap shadow-xl border border-slate-600 dark:border-slate-700">
        {label}
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4
                        border-transparent border-r-slate-800 dark:border-r-slate-900" />
      </div>
    </div>
  );
}

/* ─── Flyout panel for collapsed icons that have sub-links ─── */
function CollapsedSubFlyout({ label, icon: Icon, subLinks, to, navigate, currentTab, isOpen, onToggle, onClose }) {
  const ref = useRef(null);

  /* Close on click outside */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  const isActive = location.pathname.startsWith(to);

  return (
    <div ref={ref} className="relative flex justify-center">
      {/* Icon button — click toggles the flyout */}
      <button
        onClick={(e) => { e.preventDefault(); onToggle(); }}
        className={`w-11 h-11 flex items-center justify-center rounded-lg transition-colors
          ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white'}`}
      >
        <Icon className="w-6 h-6 flex-shrink-0" />
      </button>

      {/* Flyout panel — controlled by isOpen state */}
      <div
        className={`absolute left-full ml-3 top-0 z-50
                   transition-all duration-150 origin-left
                   bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl
                   min-w-[180px] overflow-hidden
                   ${isOpen
                     ? 'opacity-100 pointer-events-auto scale-100'
                     : 'opacity-0 pointer-events-none scale-95'}`}
      >
        {/* Arrow pointing left toward the sidebar */}
        <div className="absolute right-full top-4 border-[6px] border-transparent border-r-slate-200 dark:border-r-slate-700" />
        <div className="absolute right-full top-[17px] border-[5px] border-transparent border-r-white dark:border-r-slate-900" />

        {/* Section header */}
        <div className="px-3 pt-3 pb-2 border-b border-slate-200 dark:border-slate-700/60">
          <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">{label}</p>
        </div>

        {/* Sub-link buttons */}
        <div className="p-1.5 space-y-0.5">
          {subLinks.map((sub) => {
            const isSubActive = currentTab === sub.id || (!currentTab && subLinks[0].id === sub.id);
            return (
              <button
                key={sub.id}
                onClick={() => { navigate(`${to}?tab=${sub.id}`); onClose(); }}
                className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm rounded-lg transition-colors
                  ${isSubActive
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/70 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <sub.icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="whitespace-nowrap">{sub.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { collapsed, toggle } = useSidebar();

  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab');
  const [unreadCount, setUnreadCount] = useState(0);
  const [openBadge, setOpenBadge] = useState(null);
  const [openFlyout, setOpenFlyout] = useState(null);
  /* Track which section's sub-tabs are expanded (persists across navigation) */
  const [expandedSection, setExpandedSection] = useState(() => {
    // Initialize from current route
    const path = location.pathname;
    const match = ['/study', '/summary', '/notifications', '/settings'].find(p => path.startsWith(p));
    return match || null;
  });

  const closeFlyout = useCallback(() => setOpenFlyout(null), []);

  /* Close flyout when sidebar expands */
  useEffect(() => { if (!collapsed) setOpenFlyout(null); }, [collapsed]);

  useEffect(() => {
    if (!user) return;
    const fetchCount = async () => {
      try {
        const { data } = await getNotifications();
        setUnreadCount(data.filter((n) => !n.read).length);
      } catch (err) {
        console.error('Failed to fetch notification count:', err);
      }
    };
    fetchCount();
    const interval = setInterval(fetchCount, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => { logout(); navigate('/login'); };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please upload an image file'); return; }
    if (file.size > 1.5 * 1024 * 1024) { toast.error('Image size must be less than 1.5MB'); return; }
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const { data } = await updateProfile({ photo: reader.result });
        setUser((prev) => {
          const updated = { ...prev, photo: data.photo };
          localStorage.setItem('user', JSON.stringify(updated));
          return updated;
        });
        toast.success('Profile picture updated!');
      } catch { toast.error('Failed to update profile picture'); }
    };
    reader.readAsDataURL(file);
  };

  const links = [
    {
      to: '/study', label: 'Study', icon: BookOpen,
      subLinks: [
        { id: 'notes', label: 'Notes', icon: BookOpen },
        { id: 'videos', label: 'YouTube Videos', icon: Video },
        { id: 'leetcode', label: 'LeetCode', icon: Code2 },
        { id: 'quiz', label: 'AI Practice Quiz', icon: Sparkles },
      ],
    },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      to: '/summary', label: 'Summary', icon: BookMarked,
      subLinks: [
        { id: 'saved', label: 'Saved Summary', icon: BookMarked },
        { id: 'quick', label: 'AI Summarizer', icon: Sparkles },
      ],
    },
    {
      to: '/notifications', label: 'Notifications', icon: Bell, badge: unreadCount,
      subLinks: [
        { id: 'list', label: 'Alert Center', icon: Bell },
        { id: 'create', label: 'Add Reminder', icon: Plus },
      ],
    },
    {
      to: '/settings', label: 'Settings', icon: SettingsIcon,
      subLinks: [
        { id: 'profile', label: 'User Profile', icon: User },
        { id: 'academic', label: 'Academic Details', icon: GraduationCap },
        { id: 'preferences', label: 'Preferences', icon: Palette },
        { id: 'security', label: 'Security', icon: Lock },
      ],
    },
    { to: '/activity', label: 'Activity', icon: CalendarDays },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col fixed left-0 top-0 h-screen bg-sidebar text-slate-800 dark:text-white z-40
                  transition-all duration-300 ease-in-out border-r border-slate-200 dark:border-slate-700/50
                  ${collapsed ? 'w-[72px] overflow-visible' : 'w-64 overflow-hidden'}`}
    >
      {/* ── Header ── */}
      <div className={`flex items-center border-b border-slate-200 dark:border-slate-700/50 flex-shrink-0
                       transition-all duration-300
                       ${collapsed ? 'px-3 py-4 justify-center' : 'px-5 py-4 gap-3'}`}>
        {/* Toggle button */}
        <button
          onClick={toggle}
          className="flex-shrink-0 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700/60 transition-colors text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>

        {/* Logo — hidden when collapsed */}
        {!collapsed && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="relative flex items-center justify-center flex-shrink-0">
              <div className="absolute inset-0 bg-indigo-500 blur-[14px] opacity-40 rounded-full" />
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 w-8 h-8 rounded-xl flex items-center justify-center border border-indigo-400/30 shadow-[0_0_12px_rgba(99,102,241,0.4)] relative z-10">
                <GraduationCap className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none whitespace-nowrap">
                Student<span className="text-indigo-500 dark:text-indigo-400">.</span>
              </h1>
              <span className="text-[9px] font-bold tracking-[0.2em] text-slate-500 dark:text-slate-400 uppercase">
                Assistant
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Profile ── */}
      {user && (
        <div className={`flex-shrink-0 border-b border-slate-200 dark:border-slate-700/50 transition-all duration-300
                         ${collapsed ? 'px-3 py-3 flex justify-center' : 'px-5 py-4 flex items-center gap-3'}`}>
          <div className="relative group flex-shrink-0">
            {user.photo ? (
              <img src={user.photo} alt={user.name}
                className={`rounded-full object-cover border-2 border-indigo-500 shadow-sm transition-all duration-300 ${collapsed ? 'w-10 h-10' : 'w-12 h-12'}`} />
            ) : (
              <div className={`rounded-full bg-indigo-700 flex items-center justify-center text-white font-bold border-2 border-indigo-500 shadow-sm transition-all duration-300 ${collapsed ? 'w-10 h-10 text-base' : 'w-12 h-12 text-xl'}`}>
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
            )}
            <label className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full p-1.5 cursor-pointer shadow-md transition-all group-hover:scale-110 border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center z-10">
              <Camera className="w-3 h-3" />
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-grow overflow-hidden">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate leading-tight" title={user.name}>{user.name}</p>
              <p className="text-xs text-indigo-600 dark:text-indigo-300 truncate mt-0.5" title={user.email}>{user.email}</p>
            </div>
          )}
        </div>
      )}

      {/* ── Navigation ── */}
      <nav className={`flex-grow py-3 scrollbar-hide ${collapsed ? 'overflow-visible' : 'overflow-y-auto overflow-x-hidden'}`}>
        {/* New Session Button */}
        <div className={`mb-3 transition-all duration-300 ${collapsed ? 'px-2' : 'px-3'}`}>
          {collapsed ? (
            <Tip label="New Session">
              <button
                onClick={() => {
                  localStorage.removeItem('activeStudySessionId');
                  localStorage.removeItem('activeStudySessionData');
                  navigate('/study', { state: { reset: true } });
                }}
                className="w-11 h-11 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-900/50 transition-all border border-indigo-500 hover:scale-105"
              >
                <Plus className="w-6 h-6" />
              </button>
            </Tip>
          ) : (
            <button
              onClick={() => {
                localStorage.removeItem('activeStudySessionId');
                localStorage.removeItem('activeStudySessionData');
                navigate('/study', { state: { reset: true } });
              }}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-900/50 transition-all border border-indigo-500 hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              New Session
            </button>
          )}
        </div>

        {/* Nav Links */}
        <div className={`transition-all duration-300 ${collapsed ? 'px-2 space-y-2' : 'px-3 space-y-0.5'}`}>
          {links.map(({ to, label, icon: Icon, badge, subLinks }) => {
            const isActive = location.pathname.startsWith(to);
            const navItem = (
              <NavLink
                to={to}
                className={({ isActive: navActive }) =>
                  `flex items-center gap-3 rounded-lg transition-colors
                   ${collapsed ? 'w-11 h-11 justify-center' : 'px-3 py-2.5'}
                   ${navActive ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white'}`
                }
              >
                <Icon className={`flex-shrink-0 ${collapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
                {!collapsed && (
                  <>
                    <span className="flex-grow text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
                    {badge > 0 && (
                      <span className="bg-indigo-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                        {badge}
                      </span>
                    )}
                  </>
                )}
                {collapsed && badge > 0 && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-indigo-400 rounded-full" />
                )}
              </NavLink>
            );

            return (
              <div key={to} className="flex flex-col gap-0.5">
                {collapsed ? (
                  /* Collapsed mode: flyout for items with sub-links, plain tooltip otherwise */
                  subLinks ? (
                    <CollapsedSubFlyout
                      label={label}
                      icon={Icon}
                      subLinks={subLinks}
                      to={to}
                      navigate={navigate}
                      currentTab={currentTab}
                      isOpen={openFlyout === to}
                      onToggle={() => setOpenFlyout(openFlyout === to ? null : to)}
                      onClose={closeFlyout}
                    />
                  ) : (
                    <Tip label={label}>{navItem}</Tip>
                  )
                ) : (
                  /* Expanded mode: click parent to toggle sub-tabs */
                  subLinks ? (
                    <button
                      onClick={() => {
                        navigate(to);
                        setExpandedSection(expandedSection === to ? null : to);
                      }}
                      className={`flex items-center gap-3 rounded-lg transition-colors w-full px-3 py-2.5
                        ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="flex-grow text-sm font-medium text-left">{label}</span>
                      {badge > 0 && (
                        <span className="bg-indigo-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                          {badge}
                        </span>
                      )}
                      <ChevronDown className={`w-4 h-4 text-slate-400 dark:text-slate-400 transition-transform flex-shrink-0 ${expandedSection === to ? 'rotate-180' : ''}`} />
                    </button>
                  ) : navItem
                )}

                {/* Sub-links — shown when section is expanded (stays open across navigation) */}
                {!collapsed && expandedSection === to && subLinks && (
                  <div className="ml-8 space-y-0.5 border-l border-slate-300 dark:border-slate-700 pl-2">
                    {subLinks.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => navigate(`${to}?tab=${sub.id}`)}
                        className={`flex items-center gap-2.5 px-3 py-1.5 text-sm rounded-lg transition-colors w-full ${
                          (currentTab === sub.id || (!currentTab && subLinks[0].id === sub.id))
                            ? 'bg-indigo-600/50 text-white font-medium'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700/60'
                        }`}
                      >
                        <sub.icon className="w-3.5 h-3.5" />
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Achievements (collapsed: icon only with tooltip) ── */}
        {!collapsed && (
          <div className="mt-6 px-3">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-1">Achievements</p>
            <div className="space-y-1">
              {[
                { id: 'questions', emoji: '🥇', title: '100 Questions', subtitle: 'Solved', color: 'amber', description: 'Solve a total of 100 LeetCode questions across any study session.', progress: '23 / 100 solved' },
                { id: 'streak', emoji: '🔥', title: '7 Day Streak', subtitle: 'Keep it up!', color: 'orange', description: 'Study at least one topic every day for 7 consecutive days without missing a day.', progress: 'Current streak: 3 days' },
                { id: 'course', emoji: '📚', title: 'First Course', subtitle: 'Completed', color: 'emerald', description: 'Complete all 4 tabs (Notes, Videos, LeetCode, Quiz) in a single session.', progress: 'Complete all 4 tabs' },
              ].map((badge) => {
                const isOpen = openBadge === badge.id;
                const bgMap = { amber: 'border-amber-500/30 bg-amber-500/5', orange: 'border-orange-500/30 bg-orange-500/5', emerald: 'border-emerald-500/30 bg-emerald-500/5' };
                return (
                  <div key={badge.id}>
                    <button
                      onClick={() => setOpenBadge(isOpen ? null : badge.id)}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl transition-all border cursor-pointer ${isOpen ? `${bgMap[badge.color]}` : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700/50'}`}
                    >
                      <span className="text-base w-7 h-7 flex items-center justify-center flex-shrink-0">{badge.emoji}</span>
                      <div className="flex flex-col flex-grow text-left min-w-0">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{badge.title}</span>
                        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">{badge.subtitle}</span>
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className={`mx-1 mb-1 p-3 rounded-xl border text-xs ${bgMap[badge.color]} space-y-2`}>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{badge.description}</p>
                        <div className="flex items-center gap-1.5 pt-1 border-t border-slate-200 dark:border-slate-700/50">
                          <span className="text-slate-500 dark:text-slate-500 font-medium">Progress:</span>
                          <span className="text-slate-700 dark:text-slate-300 font-semibold">{badge.progress}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* ── Logout ── */}
      <div className={`flex-shrink-0 border-t border-slate-200 dark:border-slate-700 p-3 bg-sidebar ${collapsed ? 'flex justify-center' : ''}`}>
        {collapsed ? (
          <Tip label="Logout">
            <button
              onClick={handleLogout}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </Tip>
        ) : (
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        )}
      </div>
    </aside>
  );
}
