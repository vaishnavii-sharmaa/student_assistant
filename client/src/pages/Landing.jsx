import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Video,
  Code2,
  Brain,
  BarChart3,
  Timer,
  MessageSquare,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const features = [
  { icon: BookOpen, title: 'Smart Notes', desc: 'AI-generated structured notes at your difficulty level' },
  { icon: Video, title: 'Video Recommendations', desc: 'Curated educational YouTube videos for every topic' },
  { icon: Code2, title: 'LeetCode Practice', desc: 'Coding questions suggested for CS topics' },
  { icon: Brain, title: 'AI Quizzes', desc: 'Timed MCQ quizzes with instant feedback' },
  { icon: BarChart3, title: 'Performance Analysis', desc: 'Track scores, weak areas, and study streaks' },
  { icon: Timer, title: 'Pomodoro Timer', desc: 'Built-in focus timer for productive study sessions' },
  { icon: MessageSquare, title: 'Ask Anything', desc: 'Chat with AI about your current topic' },
  { icon: Sparkles, title: 'Learning Roadmap', desc: 'Get personalized suggestions for what to learn next' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
      <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-indigo-400" />
          <span className="text-xl font-bold">Student Assistant</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-slate-300 hover:text-white transition-colors">
            Login
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-full text-sm font-medium mb-6">
            AI-Powered Learning
          </span>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Your Personal
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Study Assistant
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Enter any topic and get AI-generated notes, video recommendations,
            quizzes, and personalized feedback — all in one place.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold text-lg transition-all hover:scale-105"
          >
            Start Learning Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Everything you need to study smarter</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
            >
              <Icon className="w-8 h-8 text-indigo-400 mb-4" />
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm text-slate-400">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-slate-500 text-sm">
        Student Assistant — Learn anything, anywhere.
      </footer>
    </div>
  );
}
