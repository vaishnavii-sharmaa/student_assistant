import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Star, Zap, Globe, TrendingUp, ShieldCheck, ArrowRight,
  CheckCircle, Sparkles, Brain, Code2, BarChart3, MessageSquare,
  Video, Timer, ChevronDown, GraduationCap, Rocket, Award,
  Microscope, Atom, Compass, Lightbulb, Music, Calculator, Palette
} from 'lucide-react';

const FEATURES = [
  { icon: Brain, title: 'AI-Powered Notes', desc: 'Get instant, structured study notes on any topic tailored to your level.', color: 'from-violet-500 to-indigo-500', glow: 'rgba(139,92,246,0.25)' },
  { icon: Video, title: 'Video Learning', desc: 'Curated YouTube recommendations to reinforce concepts visually.', color: 'from-rose-500 to-pink-500', glow: 'rgba(244,63,94,0.25)' },
  { icon: Code2, title: 'LeetCode Practice', desc: 'CS topic-specific coding problems to sharpen your skills.', color: 'from-cyan-500 to-sky-500', glow: 'rgba(6,182,212,0.25)' },
  { icon: Zap, title: 'AI Quizzes', desc: 'Timed MCQ quizzes with detailed explanations and instant feedback.', color: 'from-amber-400 to-orange-500', glow: 'rgba(251,146,60,0.25)' },
  { icon: BarChart3, title: 'Progress Analytics', desc: 'Visual dashboards tracking streaks, scores, and weak areas.', color: 'from-emerald-500 to-teal-500', glow: 'rgba(16,185,129,0.25)' },
  { icon: Timer, title: 'Pomodoro Timer', desc: 'Built-in focus timer for structured, distraction-free sessions.', color: 'from-purple-500 to-fuchsia-500', glow: 'rgba(168,85,247,0.25)' },
  { icon: MessageSquare, title: 'AI Chat Tutor', desc: 'Ask anything about your topic and get instant expert explanations.', color: 'from-blue-500 to-indigo-500', glow: 'rgba(59,130,246,0.25)' },
  { icon: Sparkles, title: 'Learning Roadmap', desc: 'Personalized next-topic suggestions based on your progress.', color: 'from-pink-500 to-rose-500', glow: 'rgba(236,72,153,0.25)' },
];

const STATS = [
  { value: '10K+', label: 'Active Learners', icon: GraduationCap, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
  { value: '500+', label: 'Topics Covered', icon: Globe, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  { value: '98%', label: 'Satisfaction Rate', icon: Award, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  { value: '24/7', label: 'AI Availability', icon: Rocket, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
];

const TESTIMONIALS = [
  { name: 'Priya S.', role: 'Computer Science Student', text: 'StudentAssistant completely changed how I study. I went from failing to acing my DSA exams!', avatar: '👩‍💻', accent: 'from-violet-500 to-indigo-500' },
  { name: 'Arjun M.', role: 'Medical Student', text: 'The AI notes are insanely good. It explains complex physiology in a way no textbook can.', avatar: '👨‍⚕️', accent: 'from-cyan-500 to-teal-500' },
  { name: 'Sneha R.', role: 'High School Student', text: 'I used to spend hours searching for resources. Now everything is in one place. Game changer!', avatar: '👩‍🎓', accent: 'from-rose-500 to-pink-500' },
];

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

export default function Intro() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const timer = setInterval(() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(timer);
  }, []);

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

      {/* ── Navbar ── */}
      <nav className="fixed w-full z-50 top-0">
        <div className="bg-slate-950/70 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 h-18 py-4 flex items-center justify-between">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight">Student<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">Assistant</span></span>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-6">
                {['About', 'Features', 'Community'].map(item => (
                  <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">{item}</a>
                ))}
              </div>
              <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Sign In</Link>
              <Link to="/register" className="text-sm font-bold bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white px-5 py-2.5 rounded-full transition-all hover:shadow-lg hover:shadow-violet-500/30 hover:scale-105">
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background blobs — multi-colour */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-rose-600/15 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-cyan-900/20 rounded-full blur-[80px]" />
          <div className="absolute top-2/3 left-1/4 w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[100px]" />
          {particles.map((p, i) => <FloatingParticle key={i} {...p} />)}
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-7xl mx-auto px-6 w-full py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left copy */}
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/15 to-pink-500/15 border border-violet-500/25 text-violet-300 font-medium text-sm mb-8"
              >
                <Star className="w-4 h-4 fill-violet-400 text-violet-400" />
                Revolutionizing student learning with AI
              </motion.div>

              <h1 className="text-6xl md:text-7xl font-black tracking-tight mb-8 leading-[1.08]">
                Study Smarter.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400">
                  Learn Faster.
                </span>
              </h1>

              <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-xl">
                Your all-in-one AI tutor — notes, quizzes, videos, coding problems and progress tracking, for every subject, instantly.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link to="/register" className="group px-8 py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-500 hover:via-purple-500 hover:to-pink-500 text-white rounded-2xl font-bold text-lg transition-all hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] hover:scale-105 flex items-center justify-center gap-2">
                  Start For Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/login" className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/30 text-white rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2">
                  Sign In
                </Link>
              </div>
            </motion.div>

            {/* Right hero image */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Glow ring — multi-colour */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500/30 via-pink-500/20 to-cyan-500/20 blur-2xl scale-110" />
                <img src="/assets/hero_study_ai.png" alt="AI Study Platform" className="relative w-full rounded-3xl shadow-2xl border border-white/10" />
                <motion.div
                  animate={{ y: [0, 8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -bottom-4 -right-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Score: 94%</p>
                    <p className="text-emerald-400 text-xs">↑ 12% this week</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Scroll hint */}
          <motion.div
            animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
          >
            <span className="text-xs font-medium uppercase tracking-widest">Scroll to explore</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>



      {/* ── Stats Bar ── */}
      <section className="py-14 border-y border-white/5 bg-gradient-to-r from-slate-900 via-violet-950/20 to-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(({ value, label, icon: Icon, color, bg }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                <div className={`w-12 h-12 ${bg} border rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <div className={`text-4xl font-black ${color} mb-1`}>{value}</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/10 to-violet-500/10 border border-pink-500/20 text-pink-400 font-medium text-sm mb-6">
              <Sparkles className="w-4 h-4" /> Everything you need
            </span>
            <h2 className="text-4xl md:text-6xl font-black mb-6">One platform.<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400">Infinite possibilities.</span></h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">Stop switching between apps. Get every study tool you need, supercharged by AI, in a single beautiful interface.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {FEATURES.map(({ icon: Icon, title, desc, color, glow }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-white/20 transition-all cursor-default overflow-hidden"
                style={{ '--glow': glow }}
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-8 bg-gradient-to-br ${color} transition-opacity rounded-3xl`} />
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Features mockup image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-violet-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
            <img src="/assets/features_mockup.png" alt="Platform Dashboard" className="w-full object-cover" />
          </motion.div>
        </div>
      </section>

      {/* ── Why choose us ── */}
      <section id="about" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium text-sm mb-6">
                <CheckCircle className="w-4 h-4" /> Why Students Choose Us
              </span>
              <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Designed for the<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">modern student.</span></h2>

              {[
                { icon: Zap, title: 'Instant Clarity', desc: 'Our AI breaks down complex subjects into simple, digestible explanations tailored to your level.', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20 group-hover:bg-amber-500/20' },
                { icon: Globe, title: 'All-in-One Platform', desc: 'Notes, videos, quizzes, LeetCode, and chat — all in one beautiful interface.', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20 group-hover:bg-cyan-500/20' },
                { icon: TrendingUp, title: 'Guaranteed Progress', desc: 'Spaced-repetition quizzes and performance tracking ensure you actually retain what you study.', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-500/20' },
              ].map(({ icon: Icon, title, desc, color, bg }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex gap-5 mb-8 group"
                >
                  <div className={`flex-shrink-0 w-12 h-12 border rounded-2xl flex items-center justify-center transition-colors ${bg}`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{title}</h3>
                    <p className="text-slate-400 leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-violet-500/15 to-rose-500/10 rounded-3xl blur-3xl" />
              <img src="/assets/intro_hero.png" alt="Student studying with AI" className="relative w-full rounded-3xl border border-white/10 shadow-2xl" />
              <motion.div
                animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-6 -left-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Quiz Master!</p>
                    <p className="text-slate-400 text-xs">10-day study streak 🔥</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="community" className="py-24 bg-slate-900/50 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-medium text-sm mb-8">
              <Star className="w-4 h-4 fill-rose-400" /> What students say
            </span>
            <h2 className="text-4xl font-black mb-16">Loved by students <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">worldwide.</span></h2>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="relative p-10 mb-8 rounded-3xl overflow-hidden border border-white/10"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                {/* Coloured accent glow per testimonial */}
                <div className={`absolute inset-0 bg-gradient-to-br ${TESTIMONIALS[activeTestimonial].accent} opacity-5 rounded-3xl`} />
                <div className="relative">
                  <div className="text-5xl mb-6">{TESTIMONIALS[activeTestimonial].avatar}</div>
                  <p className="text-xl text-slate-200 font-light leading-relaxed mb-6 italic">
                    "{TESTIMONIALS[activeTestimonial].text}"
                  </p>
                  <div>
                    <p className="font-bold text-white">{TESTIMONIALS[activeTestimonial].name}</p>
                    <p className="text-slate-400 text-sm">{TESTIMONIALS[activeTestimonial].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-2">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`h-2 rounded-full transition-all ${i === activeTestimonial ? `w-8 bg-gradient-to-r ${t.accent}` : 'w-2 bg-slate-700'}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Security ── */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <ShieldCheck className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4">Your data is 100% safe</h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">Enterprise-grade security keeps your study data, notes, and personal information completely private.</p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { text: 'End-to-end encryption', color: 'text-emerald-300', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: 'text-emerald-400' },
                { text: 'No data sold', color: 'text-cyan-300', bg: 'bg-cyan-500/10 border-cyan-500/20', icon: 'text-cyan-400' },
                { text: 'GDPR compliant', color: 'text-violet-300', bg: 'bg-violet-500/10 border-violet-500/20', icon: 'text-violet-400' },
                { text: 'Secure JWT auth', color: 'text-amber-300', bg: 'bg-amber-500/10 border-amber-500/20', icon: 'text-amber-400' },
              ].map(({ text, color, bg, icon }) => (
                <div key={text} className={`flex items-center gap-2 px-4 py-2 ${bg} border rounded-full`}>
                  <CheckCircle className={`w-4 h-4 ${icon}`} />
                  <span className={`${color} text-sm font-medium`}>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-pink-600/20 to-amber-600/15 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-5xl md:text-6xl font-black mb-6">Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400">ace your studies?</span></h2>
            <p className="text-xl text-slate-400 mb-10">Join thousands of students already studying smarter. No credit card required.</p>
            <Link to="/register" className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-500 hover:via-purple-500 hover:to-pink-500 text-white rounded-2xl font-bold text-xl transition-all hover:shadow-[0_0_60px_rgba(139,92,246,0.5)] hover:scale-105">
              Start For Free Today
              <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 border-t border-white/5 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-pink-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">Student<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">Assistant</span></span>
          </div>
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} StudentAssistant. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Contact'].map(item => (
              <a key={item} href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
