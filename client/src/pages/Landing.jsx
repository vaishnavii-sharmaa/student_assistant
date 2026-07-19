import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Video, Code2, Brain, BarChart3, Timer,
  MessageSquare, ArrowRight, Sparkles, Zap, Globe,
  TrendingUp, Star, CheckCircle, GraduationCap,
  Target, Lightbulb, Clock, Award, ChevronDown, ChevronUp,
  Users, FileText, Play, Shield, Microscope, Atom, Calculator, Palette, Music
} from 'lucide-react';

/* ─── Data ─────────────────────────────────────────── */

const features = [
  { icon: BookOpen,     title: 'AI Smart Notes',          desc: 'Instantly generate clean, structured notes on any topic. Choose Easy, Medium, or Advanced difficulty to match your level.',          color: 'from-violet-500 to-indigo-500' },
  { icon: Video,        title: 'Video Recommendations',    desc: 'We surface the best YouTube explanations for every concept so you\'re not wasting time watching bad tutorials.',                       color: 'from-rose-500 to-pink-500' },
  { icon: Code2,        title: 'LeetCode Practice',        desc: 'CS students get topic-matched coding problems — from arrays to graphs — with increasing difficulty as you progress.',                   color: 'from-cyan-500 to-blue-500' },
  { icon: Brain,        title: 'AI Quiz Engine',           desc: 'Timed MCQ quizzes generated from your study topic with instant explanations, so you understand why answers are right or wrong.',        color: 'from-amber-400 to-orange-500' },
  { icon: BarChart3,    title: 'Performance Dashboard',    desc: 'Visual charts tracking your quiz scores, study streaks, topic mastery, and weak areas — all in one clear analytics view.',             color: 'from-emerald-500 to-teal-500' },
  { icon: Timer,        title: 'Pomodoro Focus Timer',     desc: 'Built-in 25/5 Pomodoro timer with session history. Stay focused, track deep-work hours, and build better study habits.',                color: 'from-purple-500 to-fuchsia-500' },
  { icon: MessageSquare,title: 'AI Chat Tutor',            desc: 'Ask follow-up questions on any concept and get expert-level answers instantly. Like having a personal tutor available 24/7.',           color: 'from-blue-500 to-indigo-500' },
  { icon: Sparkles,     title: 'Learning Roadmap',         desc: 'The platform suggests what to study next based on your performance — keeping you on the most efficient path to mastery.',               color: 'from-pink-500 to-rose-500' },
];

const steps = [
  { icon: Target,   step: '01', title: 'Enter Your Topic',         desc: 'Type any subject — from "Binary Trees" to "Thermodynamics". Our AI understands academic topics across all disciplines.', color: 'text-violet-400' },
  { icon: Lightbulb,step: '02', title: 'Get Instant Study Content', desc: 'In seconds you receive structured notes, curated videos, AI quizzes, and related coding problems — all tailored to your level.', color: 'text-pink-400' },
  { icon: Clock,    step: '03', title: 'Study With Focus',          desc: 'Use the built-in Pomodoro timer to stay on task. Chat with the AI tutor whenever you hit a roadblock.', color: 'text-amber-400' },
  { icon: Award,    step: '04', title: 'Track & Improve',           desc: 'Review your quiz scores and performance analytics. The platform identifies weak areas and adjusts recommendations accordingly.', color: 'text-cyan-400' },
];

const testimonials = [
  { name: 'Priya S.',  role: 'Computer Science, 3rd Year', text: 'I used to spend 2 hours just gathering resources before I could start studying. StudentAssistant cuts that to under a minute. My DSA prep has genuinely improved.', avatar: '👩‍💻', rating: 5, accent: 'from-violet-500 to-indigo-500' },
  { name: 'Arjun M.',  role: 'MBBS Student',               text: 'The AI notes explain complex physiology better than most textbooks. The quizzes after each topic helped me retain so much more before internals.', avatar: '👨‍⚕️', rating: 5, accent: 'from-cyan-500 to-teal-500' },
  { name: 'Sneha R.',  role: 'High School, Grade 12',       text: 'I used this to prep for my board exams. The roadmap feature told me exactly what to study next — I stopped feeling overwhelmed.', avatar: '👩‍🎓', rating: 5, accent: 'from-rose-500 to-pink-500' },
  { name: 'Karan T.',  role: 'Mechanical Engineering',      text: 'Even for non-CS subjects the notes and quiz features are excellent. I used it for Thermodynamics — highly recommended.', avatar: '👨‍🔬', rating: 5, accent: 'from-amber-500 to-orange-500' },
];

const faqs = [
  { q: 'Is StudentAssistant completely free?',            a: 'Yes — signing up is free with no credit card required. You get full access to notes generation, quizzes, video recommendations, and the AI tutor from day one.' },
  { q: 'What subjects does it support?',                  a: 'Any academic topic works — Computer Science, Medicine, Mathematics, Physics, Chemistry, History, Economics, and more. The AI is generalist and adapts to your subject.' },
  { q: 'How accurate are the AI-generated notes?',        a: 'Notes are generated by a large language model and are highly accurate for mainstream academic topics. For niche or very advanced topics we recommend cross-referencing with your course material.' },
  { q: 'Can I use it for competitive exam preparation?',  a: 'Absolutely. Many students use it for JEE, NEET, GATE, UPSC, and placement preparation. The LeetCode feature is specifically built for coding interviews.' },
  { q: 'Does the AI tutor remember my previous sessions?',a: 'Within a session the AI maintains full context of your topic and conversation. Across sessions, your saved notes and quiz history persist so you can pick up where you left off.' },
];

const inView = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardV = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

/* ─── Components ────────────────────────────────────── */

function FloatingParticle({ delay, x, y, size, color }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-sm ${color}`}
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
      animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3], scale: [1, 1.2, 1] }}
      transition={{ duration: 4 + delay, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  );
}

function FloatingIconElement({ Icon, delay, x, y, size, color }) {
  return (
    <motion.div
      className={`absolute flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl ${color}`}
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
      animate={{ y: [0, -20, 0], rotate: [0, 8, -8, 0] }}
      transition={{ duration: 5 + delay, repeat: Infinity, delay, ease: 'easeInOut' }}
    >
      <Icon className="w-1/2 h-1/2" />
    </motion.div>
  );
}

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null);

  const particles = [
    { x: 10, y: 20, size: 70, delay: 0,   color: 'bg-violet-500/20' },
    { x: 85, y: 15, size: 50, delay: 1,   color: 'bg-rose-500/20'   },
    { x: 70, y: 60, size: 90, delay: 2,   color: 'bg-cyan-500/15'   },
    { x: 5,  y: 70, size: 55, delay: 1.5, color: 'bg-amber-500/15'  },
    { x: 50, y: 80, size: 40, delay: 0.5, color: 'bg-emerald-500/15'},
    { x: 92, y: 85, size: 65, delay: 3,   color: 'bg-pink-500/20'   },
    { x: 30, y: 10, size: 50, delay: 2.5, color: 'bg-indigo-500/20' },
  ];

  const floatingIcons = [
    { Icon: Microscope, x: 12, y: 32, size: 64, delay: 0.5, color: 'text-violet-400 shadow-violet-500/20' },
    { Icon: Calculator, x: 82, y: 22, size: 56, delay: 1.2, color: 'text-rose-400 shadow-rose-500/20' },
    { Icon: Atom, x: 75, y: 75, size: 72, delay: 2.5, color: 'text-cyan-400 shadow-cyan-500/20' },
    { Icon: Palette, x: 8, y: 65, size: 50, delay: 1.8, color: 'text-amber-400 shadow-amber-500/20' },
    { Icon: Music, x: 88, y: 60, size: 48, delay: 3.0, color: 'text-emerald-400 shadow-emerald-500/20' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 overflow-x-hidden selection:bg-violet-500/30">

      {/* Ambient bg */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-violet-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-cyan-600/6 rounded-full blur-[80px]" />
      </div>

      {/* ── Navbar ─────────────────────────────────────── */}
      <nav className="relative z-50 max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-white/5">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-black tracking-tight">
            Student<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">Assistant</span>
          </span>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#testimonials" className="hover:text-white transition-colors">Reviews</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
          <Link to="/login" className="text-slate-300 hover:text-white font-medium transition-colors text-sm">Sign In</Link>
          <Link to="/register" className="px-5 py-2.5 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:shadow-violet-500/30 hover:scale-105">
            Get Started Free
          </Link>
        </motion.div>
      </nav>

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-28">
        
        {/* Multi-colour background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-rose-600/15 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-cyan-900/20 rounded-full blur-[80px]" />
          <div className="absolute top-2/3 left-1/4 w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[100px]" />
          {particles.map((p, i) => <FloatingParticle key={i} {...p} />)}
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/15 to-pink-500/15 border border-violet-500/25 text-violet-300 font-medium text-sm mb-8">
              <Star className="w-4 h-4 fill-violet-400 text-violet-400" />
              AI-Powered Learning Platform
            </motion.div>

            <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-[1.05] mb-6 tracking-tight">
              Your Personal<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400">Study Assistant</span>
            </h1>

            <p className="text-lg text-slate-400 max-w-xl mb-10 leading-relaxed">
              Enter any topic and get AI-generated notes, video recommendations, quizzes, coding practice,
              and personalised feedback — all in one seamless place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link to="/register"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 rounded-2xl font-bold text-lg transition-all hover:shadow-[0_0_40px_rgba(168,85,247,0.45)] hover:scale-105">
                Start Learning Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/30 rounded-2xl font-semibold text-lg transition-all">
                I have an account
              </Link>
            </div>

            <div className="flex flex-wrap gap-5">
              {[
                { icon: CheckCircle, text: 'Free forever plan', color: 'text-violet-400' },
                { icon: Zap,         text: 'No setup required', color: 'text-pink-400' },
                { icon: GraduationCap, text: 'Works for all subjects', color: 'text-cyan-400' },
              ].map(({ icon: Icon, text, color }) => (
                <div key={text} className="flex items-center gap-2 text-slate-400 text-sm">
                  <Icon className={`w-4 h-4 ${color}`} /> {text}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Hero visual */}
          <motion.div initial={{ opacity: 0, x: 40, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }} className="relative hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 via-pink-500/20 to-cyan-500/20 rounded-3xl blur-3xl scale-110" />
              <img src="/assets/hero_study_ai.png" alt="AI Study Platform Interface"
                className="relative w-full rounded-3xl shadow-2xl border border-white/10 object-cover" />

              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-5 -left-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl">
                <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Notes Generated!</p>
                  <p className="text-slate-400 text-xs">DNA Replication · 3s</p>
                </div>
              </motion.div>

              <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                className="absolute -bottom-5 -right-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl">
                <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Score: 94%</p>
                  <p className="text-emerald-400 text-xs">↑ 12% this week</p>
                </div>
              </motion.div>

              <motion.div animate={{ x: [0, 8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                className="absolute top-1/2 -right-8 -translate-y-1/2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl">
                <div className="w-9 h-9 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Quiz Ready</p>
                  <p className="text-slate-400 text-xs">10 questions · AI</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>



      {/* ── Stats Strip ────────────────────────────────── */}
      <section className="relative z-10 border-b border-white/5 bg-white/5 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '8+',   label: 'Integrated Study Tools', icon: Sparkles, color: 'text-violet-400', bg: 'bg-violet-500/10' },
              { num: '500+', label: 'Topics Supported',       icon: Globe, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
              { num: '24/7', label: 'AI Tutor Available',     icon: MessageSquare, color: 'text-rose-400', bg: 'bg-rose-500/10' },
              { num: '100%', label: 'Free to Start',          icon: Shield, color: 'text-amber-400', bg: 'bg-amber-500/10' },
            ].map(({ num, label, icon: Icon, color, bg }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className={`w-11 h-11 ${bg} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div className="text-3xl font-black text-white mb-1">{num}</div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ──────────────────────────────── */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-28">
        <motion.div variants={inView} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 font-medium text-sm mb-6">
            <Sparkles className="w-4 h-4" /> Everything you need
          </span>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Study smarter with<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400">every tool built-in</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            From AI note generation to live chat tutoring — every feature is designed to make learning faster, deeper, and less frustrating.
          </p>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <motion.div key={title} variants={cardV} whileHover={{ y: -6, scale: 1.02 }}
              className="group relative p-6 rounded-3xl bg-white/4 backdrop-blur border border-white/8 hover:border-white/15 hover:bg-white/8 transition-all cursor-default overflow-hidden">
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br ${color} rounded-3xl transition-opacity`} />
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2 text-base">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── How It Works ───────────────────────────────── */}
      <section id="how-it-works" className="relative z-10 py-24 border-y border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 via-pink-950/10 to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div variants={inView} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-medium text-sm mb-6">
              <Play className="w-4 h-4" /> How It Works
            </span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              From topic to mastery<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">in four steps</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              No setup. No configuration. Just type what you want to learn and everything is ready instantly.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ icon: Icon, step, title, desc, color }, i) => (
              <motion.div key={step} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className="relative p-6 rounded-3xl bg-slate-900/60 border border-white/6 hover:border-white/20 hover:bg-slate-900/80 transition-all group overflow-hidden">
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-[0.03] bg-${color.split('-')[1]}-500 transition-opacity`} />
                <div className="flex items-center gap-3 mb-5">
                  <span className={`text-xs font-bold ${color} tracking-widest`}>{step}</span>
                  <div className="flex-1 h-px bg-white/5" />
                  <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-colors`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                </div>
                <h3 className="font-bold text-white text-base mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Showcase (side-by-side) ────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-violet-500/10 rounded-3xl blur-3xl" />
            <img src="/assets/features_mockup.png" alt="Platform feature showcase"
              className="relative w-full rounded-3xl border border-white/10 shadow-2xl" />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-medium text-sm mb-6">
              <Globe className="w-4 h-4" /> Unified Learning Workspace
            </span>
            <h2 className="text-4xl font-black mb-5 leading-tight">
              Every resource you need,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">organised in one place.</span>
            </h2>
            <p className="text-slate-400 text-base mb-8 leading-relaxed">
              Stop context-switching between apps. StudentAssistant brings AI notes, video lessons, quizzes,
              coding problems, an AI tutor, and progress tracking together into one focused workspace.
            </p>
            <div className="space-y-3 mb-8">
              {[
                { text: 'Generate structured notes on any topic in seconds',     sub: 'Adjustable difficulty: Easy / Medium / Hard' },
                { text: 'Auto-curated YouTube videos — no more bad tutorials',   sub: 'Ranked by relevance and educational quality' },
                { text: 'AI chat tutor available 24/7 on any concept',           sub: 'Ask follow-ups, get examples, clarify doubts' },
                { text: 'Detailed analytics to identify weak areas',             sub: 'Score trends, streak tracking, topic mastery' },
              ].map(({ text, sub }) => (
                <div key={text} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/3 transition-colors group">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-200 text-sm font-medium">{text}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/register"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-violet-500/30 hover:scale-105">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Subject Coverage ───────────────────────────── */}
      <section className="relative z-10 py-20 border-y border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-950/20 to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div variants={inView} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-3">Works across every discipline</h2>
            <p className="text-slate-400">From engineering to medicine, humanities to competitive coding.</p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3">
            {[
              'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
              'Medicine', 'Economics', 'History', 'Data Structures', 'Machine Learning',
              'Thermodynamics', 'Organic Chemistry', 'Calculus', 'Statistics', 'English Literature',
              'Psychology', 'Civil Engineering', 'Business Management', 'Competitive Programming',
            ].map((subject, i) => (
              <motion.span key={subject} variants={cardV}
                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-medium hover:bg-violet-500/10 hover:border-violet-500/30 hover:text-violet-300 transition-all cursor-default">
                {subject}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────── */}
      <section id="testimonials" className="relative z-10 max-w-7xl mx-auto px-6 py-28">
        <motion.div variants={inView} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-medium text-sm mb-6">
            <Users className="w-4 h-4" /> Student Reviews
          </span>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Loved by students<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">across every stream</span>
          </h2>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map(({ name, role, text, avatar, rating, accent }) => (
            <motion.div key={name} variants={cardV}
              className="p-6 rounded-3xl bg-white/4 border border-white/8 hover:border-white/15 hover:bg-white/6 transition-all group overflow-hidden relative">
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br ${accent} transition-opacity`} />
              <div className="flex text-amber-400 text-sm mb-4">{'★'.repeat(rating)}</div>
              <p className="text-slate-300 text-sm leading-relaxed mb-5 italic">"{text}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${accent} flex items-center justify-center text-base`}>{avatar}</div>
                <div>
                  <p className="text-white font-semibold text-sm">{name}</p>
                  <p className="text-slate-500 text-xs">{role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── FAQ ────────────────────────────────────────── */}
      <section id="faq" className="relative z-10 max-w-3xl mx-auto px-6 pb-28">
        <motion.div variants={inView} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 font-medium text-sm mb-6">
            <FileText className="w-4 h-4" /> Frequently Asked
          </span>
          <h2 className="text-3xl md:text-4xl font-black">Common questions</h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map(({ q, a }, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="rounded-2xl bg-white/4 border border-white/8 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left text-white font-semibold text-sm hover:bg-white/3 transition-colors">
                <span>{q}</span>
                {openFaq === i
                  ? <ChevronUp className="w-4 h-4 text-violet-400 flex-shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />}
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
                    <p className="px-6 pb-5 text-slate-400 text-sm leading-relaxed">{a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────── */}
      <section className="relative z-10 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden border border-violet-500/20 bg-gradient-to-br from-violet-600/20 via-pink-600/15 to-amber-600/10 p-16 text-center">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-4">Ready to study smarter?</h2>
              <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
                Join thousands of students already using StudentAssistant to learn faster and perform better. No credit card needed.
              </p>
              <Link to="/register"
                className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white rounded-2xl font-bold text-xl transition-all hover:shadow-[0_0_60px_rgba(168,85,247,0.5)] hover:scale-105">
                Start Learning Free <ArrowRight className="w-6 h-6" />
              </Link>
              <p className="text-slate-600 text-sm mt-5">Free forever · No credit card · Instant access</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/8 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-pink-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-base">Student<span className="text-violet-400">Assistant</span></span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
              <a href="#features" className="hover:text-slate-300 transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-slate-300 transition-colors">How It Works</a>
              <a href="#testimonials" className="hover:text-slate-300 transition-colors">Reviews</a>
              <a href="#faq" className="hover:text-slate-300 transition-colors">FAQ</a>
              <Link to="/login" className="hover:text-slate-300 transition-colors">Sign In</Link>
              <Link to="/register" className="hover:text-slate-300 transition-colors">Sign Up</Link>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-slate-600 text-xs">© {new Date().getFullYear()} StudentAssistant. Built to make learning better.</p>
            <p className="text-slate-700 text-xs">AI-powered · Works for all subjects · Free forever</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
