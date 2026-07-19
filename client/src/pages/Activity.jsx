import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import Layout from '../components/Layout';
import { getDashboard } from '../api/dashboard';
import toast from 'react-hot-toast';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday = 0
}

function formatDateKey(dateObj) {
  return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
}

export default function Activity() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    getDashboard()
      .then(({ data }) => setSessions(data.sessions || []))
      .catch(() => toast.error('Failed to load activity data'))
      .finally(() => setLoading(false));
  }, []);

  // Build a map: dateKey -> [sessions]
  const activityMap = useMemo(() => {
    const map = {};
    sessions.forEach((s) => {
      const d = new Date(s.date);
      const key = formatDateKey(d);
      if (!map[key]) map[key] = [];
      map[key].push(s);
    });
    return map;
  }, [sessions]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  const handleDayClick = (day) => {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (activityMap[key]) {
      setSelectedDate(selectedDate === key ? null : key);
    }
  };

  const selectedSessions = selectedDate ? activityMap[selectedDate] || [] : [];

  const today = formatDateKey(new Date());

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold flex items-center gap-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
            <CalendarDays className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            Study Activity
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Track which topics you studied and when. Click on a highlighted date to see details.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 md:p-8">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={prevMonth}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                {monthName} {year}
              </h2>
              <button
                onClick={nextMonth}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Day Labels */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS_OF_WEEK.map((d) => (
                <div key={d} className="text-center text-xs font-bold text-slate-400 dark:text-slate-500 py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Date Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty offset cells */}
              {Array.from({ length: startDay }).map((_, i) => (
                <div key={`empty-${i}`} className="h-10" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const hasActivity = !!activityMap[key];
                const isToday = key === today;
                const isSelected = selectedDate === key;
                const sessionCount = activityMap[key]?.length || 0;

                return (
                  <button
                    key={day}
                    onClick={() => handleDayClick(day)}
                    className={`
                      relative h-10 w-full rounded-xl flex flex-col items-center justify-center transition-all text-sm font-medium
                      ${isSelected
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 scale-105'
                        : hasActivity
                          ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 cursor-pointer border border-indigo-200 dark:border-indigo-700/50'
                          : isToday
                            ? 'border-2 border-indigo-400 text-indigo-600 dark:text-indigo-400'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-default'
                      }
                    `}
                  >
                    <span>{day}</span>
                    {hasActivity && !isSelected && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {Array.from({ length: Math.min(sessionCount, 3) }).map((_, si) => (
                          <span key={si} className="w-1 h-1 rounded-full bg-indigo-500 dark:bg-indigo-400" />
                        ))}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700/50" />
                <span>Study day</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-indigo-600" />
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded border-2 border-indigo-400" />
                <span>Today</span>
              </div>
            </div>
          </div>
        )}

        {/* Selected Date Topics Panel */}
        <AnimatePresence>
          {selectedDate && selectedSessions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.2 }}
              className="mt-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6"
            >
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-indigo-500" />
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>

              <div className="space-y-3">
                {selectedSessions.map((s) => (
                  <div
                    key={s._id}
                    onClick={() => navigate(`/study?session=${s._id}`)}
                    className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all cursor-pointer group"
                  >
                    <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-white capitalize truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {s.topic}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 capitalize mt-0.5">
                        {s.difficulty} · {s.status}
                        {s.score !== null && ` · Score: ${s.score}%`}
                      </p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${
                      s.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
