import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Flame, BookOpen, TrendingUp, Calendar } from 'lucide-react';
import Layout from '../components/Layout';
import ScoreChart from '../components/ScoreChart';
import { getDashboard } from '../api/dashboard';
import { formatDate, getRemarkColor } from '../utils/helpers';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(({ data: d }) => setData(d))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Study Dashboard</h1>
        <p className="text-slate-500 mb-8">Track your learning progress over time</p>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{data.streak}</p>
                <p className="text-sm text-slate-500">Day Streak</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-indigo-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{data.totalSessions}</p>
                <p className="text-sm text-slate-500">Total Sessions</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">
                  {data.scoreTrend.length
                    ? Math.round(data.scoreTrend.reduce((a, b) => a + b.score, 0) / data.scoreTrend.length)
                    : 0}%
                </p>
                <p className="text-sm text-slate-500">Avg Score</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Score Trend</h2>
            <ScoreChart data={data.scoreTrend} />
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Most Studied</h2>
            {data.mostStudied.length === 0 ? (
              <p className="text-sm text-slate-400">No data yet</p>
            ) : (
              <div className="space-y-3">
                {data.mostStudied.map(({ subject, count }) => (
                  <div key={subject} className="flex items-center justify-between">
                    <span className="text-slate-700 capitalize">{subject}</span>
                    <span className="text-sm bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                      {count} sessions
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            Study History
          </h2>
          {data.sessions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 mb-4">No study sessions yet</p>
              <Link to="/study" className="text-indigo-600 hover:underline font-medium">
                Start your first session
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-3 px-2 text-slate-500 font-medium">Topic</th>
                    <th className="text-left py-3 px-2 text-slate-500 font-medium">Difficulty</th>
                    <th className="text-left py-3 px-2 text-slate-500 font-medium">Score</th>
                    <th className="text-left py-3 px-2 text-slate-500 font-medium">Status</th>
                    <th className="text-left py-3 px-2 text-slate-500 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.sessions.map((s) => (
                    <tr key={s._id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="py-3 px-2 font-medium text-slate-800 capitalize">{s.topic}</td>
                      <td className="py-3 px-2 text-slate-500 capitalize">{s.difficulty}</td>
                      <td className="py-3 px-2">
                        {s.score !== null ? (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getRemarkColor(s.remark)}`}>
                            {s.score}%
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${
                          s.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-700'
                            : s.status === 'quiz'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-100 text-slate-600'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-slate-500">{formatDate(s.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </Layout>
  );
}
