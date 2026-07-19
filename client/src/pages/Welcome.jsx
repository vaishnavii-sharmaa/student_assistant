import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, Video, Code2, Brain, BarChart3, Timer, MessageSquare, ArrowRight, Sparkles, LogOut,
  Target, Zap, Shield, CheckCircle2, LayoutDashboard, Search, FileText, Activity
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

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

const steps = [
  { icon: Search, title: 'Choose a Topic', desc: 'Type in absolutely any subject or coding concept you want to learn.' },
  { icon: Brain, title: 'AI Generation', desc: 'Our AI instantly creates a comprehensive, personalized study guide for you.' },
  { icon: LayoutDashboard, title: 'Study & Practice', desc: 'Read notes, watch videos, take quizzes, and track your progress all in one dashboard.' },
];

const faqs = [
  { q: "How does the AI generate notes?", a: "We use advanced large language models to structure complex information into easily digestible formats tailored to your requested difficulty." },
  { q: "Can I use it for non-programming topics?", a: "Absolutely! While we have specific features for CS students like LeetCode, the note generation works for History, Science, Literature, and more." },
  { q: "Does the Pomodoro timer run in the background?", a: "Yes, once you start the timer on your study dashboard, it will keep tracking your focus sessions while you study." },
  { q: "Are my study sessions saved?", a: "Yes! All your searched topics, quiz scores, and highlighted notes are saved permanently so you can review them anytime." }
];

export default function Welcome() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between sticky top-0 z-50 bg-slate-900/50 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-indigo-400" />
          <span className="text-xl font-bold">Student Assistant</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-300 hidden sm:inline">Hi, {user?.name || 'Student'}!</span>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32 min-h-[80vh] flex flex-col justify-center relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-full text-sm font-medium mb-6 border border-indigo-500/30">
              Welcome Back!
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Ready to continue your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Learning Journey?
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-xl mb-10 leading-relaxed">
              Jump back into your dashboard to generate new AI study notes, practice LeetCode, or review your past sessions.
            </p>
            <Link
              to="/study"
              className="inline-flex items-center gap-2 px-10 py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-semibold text-xl transition-all hover:scale-105 shadow-[0_0_40px_rgba(79,70,229,0.4)] border border-indigo-500/50"
            >
              Enter Dashboard
              <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative hidden md:block group"
          >
            <div className="absolute inset-0 bg-indigo-500/20 rounded-[2rem] blur-2xl group-hover:bg-purple-500/30 transition-colors duration-700"></div>
            <img 
              src="/assets/welcome_hero.png" 
              alt="Dashboard Analytics" 
              className="relative z-10 w-full h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2rem] border border-white/10 hover:-translate-y-4 hover:shadow-[0_30px_60px_rgba(79,70,229,0.3)] transition-all duration-500"
            />
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-slate-900/50 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How it works</h2>
            <p className="text-slate-400 text-lg">Master any subject in three simple steps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-indigo-500/0"></div>
            {steps.map((step, i) => (
              <motion.div 
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative text-center z-10"
              >
                <div className="w-24 h-24 mx-auto bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center mb-6 shadow-xl">
                  <step.icon className="w-10 h-10 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 py-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Your Ultimate Toolkit</h2>
          <p className="text-slate-400 text-lg">Everything you need to study smarter, not harder.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits / Why Us */}
      <section className="py-32 bg-indigo-950/30 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold mb-6">Stop wasting time searching for resources.</h2>
            <p className="text-xl text-slate-400 mb-8 leading-relaxed">
              We aggregate the best notes, videos, and practice problems instantly. Focus entirely on learning rather than organizing.
            </p>
            <ul className="space-y-4">
              {[
                "10x faster than reading textbooks",
                "Curated high-quality video content",
                "Instant feedback on quizzes",
                "Completely personalized to you"
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-slate-300 font-medium">{text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-4">
            <div className="space-y-4 mt-8">
              <div className="bg-slate-800 rounded-2xl p-6 border border-white/5 shadow-2xl">
                <Activity className="w-10 h-10 text-purple-400 mb-4" />
                <h4 className="font-bold mb-2">Track Progress</h4>
                <p className="text-sm text-slate-400">Watch your scores improve over time.</p>
              </div>
              <div className="bg-slate-800 rounded-2xl p-6 border border-white/5 shadow-2xl">
                <Target className="w-10 h-10 text-rose-400 mb-4" />
                <h4 className="font-bold mb-2">Stay Focused</h4>
                <p className="text-sm text-slate-400">Integrated timer keeps you in the zone.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-800 rounded-2xl p-6 border border-white/5 shadow-2xl">
                <Zap className="w-10 h-10 text-amber-400 mb-4" />
                <h4 className="font-bold mb-2">Learn Faster</h4>
                <p className="text-sm text-slate-400">AI distills complex topics into simple concepts.</p>
              </div>
              <div className="bg-slate-800 rounded-2xl p-6 border border-white/5 shadow-2xl">
                <Shield className="w-10 h-10 text-emerald-400 mb-4" />
                <h4 className="font-bold mb-2">Exam Ready</h4>
                <p className="text-sm text-slate-400">Test yourself before the real thing.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-6 py-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <h3 className="text-xl font-bold mb-3">{faq.q}</h3>
              <p className="text-slate-400 leading-relaxed">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600/10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-5xl font-bold mb-8">Ready to ace your next exam?</h2>
          <p className="text-xl text-slate-300 mb-10">Your dashboard is waiting for you.</p>
          <Link
            to="/study"
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-indigo-900 hover:bg-slate-100 rounded-2xl font-bold text-xl transition-all hover:scale-105 shadow-2xl"
          >
            Go to Dashboard Now
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950 py-12 text-center">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
          <BookOpen className="w-8 h-8 text-indigo-500 mb-4" />
          <p className="text-slate-500">Student Assistant Platform &copy; {new Date().getFullYear()}</p>
          <p className="text-slate-600 text-sm mt-2">Empowering learners worldwide.</p>
        </div>
      </footer>
    </div>
  );
}
