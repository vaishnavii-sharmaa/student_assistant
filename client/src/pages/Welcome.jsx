import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import {
  BookOpen, Video, Code2, Brain, BarChart3, Timer, MessageSquare, ArrowRight, Sparkles, LogOut,
  Target, Zap, Shield, CheckCircle2, LayoutDashboard, Search, FileText, Activity, Globe, Clock, ChevronRight,
  Flame, Trophy, CalendarDays
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const recentActivity = [
  { topic: 'Data Structures: Trees', time: '2 hours ago', icon: Code2, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { topic: 'Machine Learning Basics', time: 'Yesterday', icon: Brain, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  { topic: 'System Design Patterns', time: '3 days ago', icon: LayoutDashboard, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
];

const recommendedTopics = [
  { topic: 'Advanced React Patterns', desc: 'Master custom hooks and context', icon: Code2, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { topic: 'Algorithm Design', desc: 'Dynamic programming essentials', icon: Brain, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  { topic: 'Cloud Architecture', desc: 'AWS and microservices', icon: Globe, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
];

const achievements = [
  { title: '7-Day Scholar', desc: 'Studied 7 days in a row', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { title: 'Quiz Master', desc: 'Scored 100% on 5 quizzes', icon: Target, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  { title: 'Note Taker', desc: 'Generated 50 pages of notes', icon: BookOpen, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { title: 'Deep Focus', desc: '10 hours of Pomodoro', icon: Timer, color: 'text-purple-400', bg: 'bg-purple-500/10' },
];

const dailyQuests = [
  { title: 'Read 1 New Topic', progress: 1, total: 1, xp: 50, color: 'text-emerald-400', bg: 'bg-emerald-500' },
  { title: 'Take 2 Quizzes', progress: 1, total: 2, xp: 100, color: 'text-blue-400', bg: 'bg-blue-500' },
  { title: 'Study for 30 mins', progress: 15, total: 30, xp: 20, color: 'text-purple-400', bg: 'bg-purple-500' },
];

const weeklyStats = [
  { day: 'Mon', hours: 2 },
  { day: 'Tue', hours: 3.5 },
  { day: 'Wed', hours: 1 },
  { day: 'Thu', hours: 4 },
  { day: 'Fri', hours: 2.5 },
  { day: 'Sat', hours: 0 },
  { day: 'Sun', hours: 5 },
];

export default function Welcome() {
  const { user, logout } = useAuth();
  
  // Performance fix: Use motion values instead of React state to avoid re-rendering the whole page on mousemove
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });



  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX - 500);
      mouseY.set(e.clientY - 500);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);



  return (
    <div className="min-h-screen relative bg-slate-950 text-slate-50 overflow-x-hidden selection:bg-indigo-500/30">
      {/* Ambient sleek background (Fixed) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-slate-950" />
        
        {/* Animated Aurora Effect */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15], rotate: [0, 90, 0] }}
          
          className="absolute -top-1/4 -left-1/4 w-[70vw] h-[70vw] bg-indigo-600/30 rounded-full blur-[150px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.25, 0.1], x: [0, 100, 0], y: [0, 50, 0] }}
          
          className="absolute -bottom-1/4 -right-1/4 w-[60vw] h-[60vw] bg-purple-600/20 rounded-full blur-[150px]"
        />

        {/* Interactive Mouse Spotlight Glow */}
        <motion.div className="absolute w-[1000px] h-[1000px] bg-indigo-600/10 rounded-full blur-[120px]"
          style={{ x: smoothX, y: smoothY }}
        />

        {/* Elegant grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)]" />
      </div>

      {/* Scrollable Ambient Glows & Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Glows */}
        <div className="absolute top-[800px] -left-32 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[120px]" />
        <div className="absolute top-[1600px] -right-32 w-[700px] h-[700px] bg-cyan-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-[2400px] left-1/4 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[3200px] right-1/4 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[150px]" />

        {/* Chic Geometric Background Elements (Icons) */}
        <Brain className="absolute top-[400px] -left-[100px] w-[500px] h-[500px] text-indigo-500 opacity-20 -rotate-12" />
        <Code2 className="absolute top-[1200px] -right-[150px] w-[600px] h-[600px] text-purple-500 opacity-20 rotate-12" />
        <Globe className="absolute top-[2200px] -left-[200px] w-[700px] h-[700px] text-cyan-500 opacity-20 -rotate-6" />
        <Target className="absolute top-[3000px] -right-[100px] w-[500px] h-[500px] text-pink-500 opacity-20 rotate-6" />
      </div>

      {/* Navigation */}
      <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between sticky top-0 z-50 bg-slate-950/95  border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
             <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Student<span className="text-indigo-400">Assistant</span></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-300 hidden sm:inline font-medium">Hi, {user?.name || 'Student'}!</span>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900/95 hover:bg-slate-800/95 border border-white/10 rounded-xl text-slate-300 hover:text-white transition-all shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline font-semibold text-sm">Logout</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-24 md:py-32 min-h-[80vh] flex flex-col justify-center">
        
        {/* Subtle hero glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/4 -left-10 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div   >
            <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/15 to-purple-500/15 border border-indigo-500/25 text-indigo-300 font-medium text-sm mb-6 shadow-lg shadow-indigo-500/10">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Welcome Back!
            </motion.div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-6 tracking-tight">
              Ready to continue your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Learning Journey?
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-xl mb-10 leading-relaxed">
              Jump back into your dashboard to generate new AI study notes, practice LeetCode, or review your past sessions. Your progress is waiting.
            </p>
            <div className="flex gap-4">
              <Link
                to="/study"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] hover:bg-right hover:scale-105 rounded-2xl font-bold text-lg transition-all shadow-[0_0_40px_rgba(79,70,229,0.45)] text-white"
              >
                Enter Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
          <motion.div className="relative hidden md:block"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-cyan-500/20 rounded-[2rem] blur-2xl group-hover:blur-3xl group-hover:bg-indigo-500/40 transition-all duration-700"></div>
              <img 
                src="/assets/welcome_hero.png" 
                alt="Dashboard Analytics" 
                className="relative z-10 w-full h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2rem] border border-white/10 group-hover:-translate-y-2 group-hover:shadow-[0_30px_60px_rgba(79,70,229,0.3)] transition-all duration-500"
              />

              {/* Floating badges around the image */}
              <motion.div animate={{ y: [0, -10, 0] }} 
                className="absolute -top-6 -left-6 bg-slate-800/95  border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl z-20">
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Welcome Back</p>
                  <p className="text-slate-300 text-xs">Ready to learn?</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="relative z-10 border-y border-white/5 bg-slate-900/95 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: 'AI',   label: 'Powered Notes', icon: Sparkles, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
              { num: '∞', label: 'Topics Supported',       icon: Globe, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
              { num: '24/7', label: 'AI Tutor Available',     icon: MessageSquare, color: 'text-rose-400', bg: 'bg-rose-500/10' },
              { num: '100%', label: 'Personalized',          icon: Shield, color: 'text-amber-400', bg: 'bg-amber-500/10' },
            ].map(({ num, label, icon: Icon, color, bg }, i) => (
              <motion.div key={label}  
                 >
                <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <div className="text-3xl font-black text-white mb-1">{num}</div>
                <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Information & Quick Links Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-16 z-10 mb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Recent Activity */}
          <motion.div className="lg:col-span-2 bg-slate-900/95 border border-white/10 rounded-3xl p-8  shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Clock className="text-indigo-400" /> Recent Activity
              </h3>
              <Link to="/activity" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-white/10 transition-colors group">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activity.bg}`}>
                    <activity.icon className={`w-6 h-6 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white group-hover:text-indigo-300 transition-colors">{activity.topic}</h4>
                    <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                  </div>
                  <Link to="/study" className="px-4 py-2 rounded-lg bg-slate-900/95 hover:bg-slate-800/95 text-sm font-medium transition-colors">
                    Resume
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions & Stats */}
          <motion.div className="space-y-6">
            
            <div className="bg-slate-900/95 border border-indigo-500/30 rounded-3xl p-6  shadow-xl text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-500/30 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-indigo-300" />
              </div>
              <h4 className="text-3xl font-black mb-1">5 Day</h4>
              <p className="text-indigo-200 text-sm font-medium">Study Streak! 🔥</p>
            </div>

            <div className="bg-slate-900/95 border border-white/10 rounded-3xl p-6  shadow-xl">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-300">
                <Target className="w-4 h-4 text-pink-400" /> Jump Right In
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/study" className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-900/95 hover:bg-indigo-500/20 hover:border-indigo-500/30 border border-transparent transition-all">
                  <BookOpen className="w-6 h-6 text-indigo-400" />
                  <span className="text-xs font-medium">New Topic</span>
                </Link>
                <Link to="/quiz/new" className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-900/95 hover:bg-pink-500/20 hover:border-pink-500/30 border border-transparent transition-all">
                  <Brain className="w-6 h-6 text-pink-400" />
                  <span className="text-xs font-medium">Take Quiz</span>
                </Link>
              </div>
            </div>

          </motion.div>
        </div>
      </section>

      {/* Recommended Topics */}
      <section className="relative max-w-7xl mx-auto px-6 py-20 z-10 border-t border-white/5">
        <div className="mb-10">
          <h2 className="text-3xl font-black mb-2">Recommended for You</h2>
          <p className="text-slate-400">Based on your recent activity and goals.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {recommendedTopics.map((item, i) => (
            <motion.div key={i}    
              className="bg-slate-900/95 border border-white/10 rounded-3xl p-6  hover:bg-slate-900/95 hover:-translate-y-1 transition-all group">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${item.bg}`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{item.topic}</h3>
              <p className="text-sm text-slate-400 mb-6">{item.desc}</p>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mb-3 overflow-hidden">
                <div className={`h-full ${item.bg.replace('/10', '/50')} w-[35%] rounded-full`} />
              </div>
              <p className="text-xs text-slate-500 font-medium">35% Match</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Weekly Activity & Quests */}
      <section className="relative max-w-7xl mx-auto px-6 py-20 z-10 border-t border-white/5">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Weekly Chart */}
          <motion.div   >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <CalendarDays className="text-cyan-400" /> Weekly Activity
              </h3>
            </div>
            <div className="bg-slate-900/95 border border-white/10 rounded-3xl p-8  h-[300px] flex items-end gap-4 justify-between">
              {weeklyStats.map((stat, i) => (
                <div key={i} className="flex flex-col items-center gap-4 flex-1 group">
                  <div className="w-full bg-slate-800 rounded-t-xl relative overflow-hidden transition-all duration-500 group-hover:bg-slate-700 h-[200px]">
                    <div 
                      className="absolute bottom-0 w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-xl transition-all duration-1000"
                      style={{ height: `${(stat.hours / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-400 group-hover:text-white transition-colors">{stat.day}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Daily Quests */}
          <motion.div    >
             <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Flame className="text-orange-400" /> Daily Quests
              </h3>
              <span className="text-sm text-slate-400">Resets in 12h</span>
            </div>
            <div className="space-y-4">
              {dailyQuests.map((quest, i) => (
                <div key={i} className="bg-slate-900/95 border border-white/10 rounded-2xl p-5 hover:bg-slate-800/95 transition-colors">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-white flex items-center gap-2">
                      {quest.progress === quest.total && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                      {quest.title}
                    </h4>
                    <span className="text-xs font-bold px-2 py-1 rounded bg-slate-800 text-slate-300">+{quest.xp} XP</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 mb-2 overflow-hidden">
                    <div className={`h-full ${quest.bg} rounded-full transition-all duration-1000`} style={{ width: `${(quest.progress / quest.total) * 100}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 font-medium">
                    <span>{quest.progress} / {quest.total}</span>
                    <span>{Math.round((quest.progress / quest.total) * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
        </div>
      </section>

      {/* Your Achievements */}
      <section className="relative max-w-7xl mx-auto px-6 py-20 z-10 mb-20 border-t border-white/5">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black mb-2 flex items-center gap-2">
              Your Badges <Sparkles className="text-amber-400 w-6 h-6" />
            </h2>
            <p className="text-slate-400">Keep studying to unlock more achievements.</p>
          </div>
          <Link to="/activity" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 hidden sm:flex">
            View All Badges <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((badge, i) => (
            <motion.div key={i}    
              className="bg-gradient-to-br from-slate-900 to-slate-900/50 border border-white/10 rounded-3xl p-6 text-center hover:border-white/20 transition-colors">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 border-2 border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] ${badge.bg}`}>
                <badge.icon className={`w-8 h-8 ${badge.color}`} />
              </div>
              <h4 className="font-bold text-white text-sm mb-1">{badge.title}</h4>
              <p className="text-xs text-slate-400">{badge.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950 py-12 text-center relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <p className="text-slate-500 font-medium text-sm">Student Assistant Platform &copy; {new Date().getFullYear()}</p>
          <p className="text-slate-600 text-xs mt-2">Empowering learners worldwide.</p>
        </div>
      </footer>
    </div>
  );
}
