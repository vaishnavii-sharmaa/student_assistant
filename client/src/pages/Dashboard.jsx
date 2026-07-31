import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  Flame, BookOpen, TrendingUp, Calendar, 
  PlayCircle, Lightbulb, Target, Award,
  ChevronRight, Sparkles, Zap
} from 'lucide-react';
import Layout from '../components/Layout';
import ScoreChart from '../components/ScoreChart';
import { getDashboard } from '../api/dashboard';
import { formatDate, getRemarkColor } from '../utils/helpers';

const QUOTES = [
  "The secret of getting ahead is getting started.",
  "It always seems impossible until it's done.",
  "Don't watch the clock; do what it does. Keep going.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The expert in anything was once a beginner."
];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [quote] = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  useEffect(() => {
    getDashboard()
      .then(({ data: d }) => setData(d))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full shadow-lg shadow-violet-500/30" 
          />
        </div>
      </Layout>
    );
  }

  const visibleSessions = showAll ? data.sessions : data.sessions.slice(0, 10);
  const lastSession = data.sessions[0];
  
  // Milestone calculation
  const milestones = [7, 14, 30, 60, 100, 365];
  const nextMilestone = milestones.find(m => m > data.streak) || data.streak + 30;
  const progressPercent = Math.min(100, (data.streak / nextMilestone) * 100);

  const avgScore = data.scoreTrend.length
    ? Math.round(data.scoreTrend.reduce((a, b) => a + b.score, 0) / data.scoreTrend.length)
    : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <Layout>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <motion.h1 variants={itemVariants} className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
              Welcome back, Student!
            </motion.h1>
            <motion.p variants={itemVariants} className="text-slate-600 dark:text-slate-400 text-lg">
              Let's make today count.
            </motion.p>
          </div>
          
          <motion.div variants={itemVariants} className="flex gap-3">
            <Link 
              to="/study" 
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white rounded-xl font-bold shadow-lg shadow-violet-500/25 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4" /> New Session
            </Link>
          </motion.div>
        </div>

        {/* Stats Row */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:border-orange-500/30 transition-colors group relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 bg-orange-100 dark:bg-orange-950/40 rounded-xl group-hover:scale-110 transition-transform">
                <Flame className="w-6 h-6 text-orange-500 dark:text-orange-400" />
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Day Streak</p>
                <p className="text-3xl font-black text-slate-800 dark:text-white">{data.streak}</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 relative z-10">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-500 font-medium">Milestone: {nextMilestone} Days</span>
                <span className="text-orange-600 dark:text-orange-400 font-bold">{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${progressPercent}%` }} 
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full" 
                />
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:border-indigo-500/30 transition-colors group relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-950/40 rounded-xl group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Sessions</p>
                <p className="text-3xl font-black text-slate-800 dark:text-white">{data.totalSessions}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 relative z-10">
               <p className="text-sm text-slate-500">Keep up the great work!</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:border-emerald-500/30 transition-colors group relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-950/40 rounded-xl group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Score</p>
                <p className="text-3xl font-black text-slate-800 dark:text-white">{avgScore}%</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 relative z-10">
               <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium flex items-center justify-end gap-1">
                 Performance is solid <Award className="w-4 h-4" />
               </p>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <motion.div variants={itemVariants} className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Score Trend</h2>
            <ScoreChart data={data.scoreTrend} />
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-pink-500" /> Top Topics
            </h2>
            {data.mostStudied.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                 <p className="text-sm text-slate-400">No topic data yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.mostStudied.map(({ subject, count }, i) => (
                  <div key={subject} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                        {i + 1}
                      </div>
                      <span className="font-semibold text-slate-700 dark:text-slate-200 capitalize">{subject}</span>
                    </div>
                    <span className="text-xs font-bold bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-3 py-1 rounded-full shadow-sm border border-slate-200 dark:border-slate-600">
                      {count} {count === 1 ? 'session' : 'sessions'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
              Study History
            </h2>
          </div>
          
          {data.sessions.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400 mb-4 font-medium">Your study journey begins here.</p>
              <Link to="/study" className="inline-flex px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold transition-colors">
                Start Session
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold">
                    <th className="text-left py-4 px-3">Topic</th>
                    <th className="text-left py-4 px-3">Difficulty</th>
                    <th className="text-left py-4 px-3">Score</th>
                    <th className="text-left py-4 px-3">Status</th>
                    <th className="text-left py-4 px-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {visibleSessions.map((s, i) => (
                      <motion.tr 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={s._id} 
                        className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group"
                      >
                        <td className="py-4 px-3 font-bold text-slate-800 dark:text-slate-200 capitalize">{s.topic}</td>
                        <td className="py-4 px-3 text-slate-500 dark:text-slate-400 capitalize font-medium">{s.difficulty}</td>
                        <td className="py-4 px-3">
                          {s.score !== null ? (
                            <span className={`inline-block px-3 py-1 rounded-md text-xs font-bold border ${getRemarkColor(s.remark)} shadow-sm`}>
                              {s.score}%
                            </span>
                          ) : (
                            <span className="text-slate-400 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs font-bold">—</span>
                          )}
                        </td>
                        <td className="py-4 px-3">
                          <span className={`inline-block px-3 py-1 rounded-md text-xs font-bold capitalize ${
                            s.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border dark:border-emerald-900/40'
                              : s.status === 'quiz'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 dark:border dark:border-amber-900/40'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:border dark:border-slate-700'
                          }`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="py-4 px-3 text-slate-500 dark:text-slate-400 font-medium">{formatDate(s.date)}</td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>

              {data.sessions.length > 10 && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="px-6 py-2.5 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all cursor-pointer"
                  >
                    {showAll ? 'Collapse History' : `View ${data.sessions.length - 10} More Sessions`}
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </Layout>
  );
}
