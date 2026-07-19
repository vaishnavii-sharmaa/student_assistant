import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Eye, EyeOff, Loader2, BookOpen, ArrowRight, Mail, Lock,
  Sparkles, Brain, Zap, CheckCircle
} from 'lucide-react';
import { login as loginApi, googleAuth as googleAuthApi } from '../api/auth';
import { useAuth } from '../hooks/useAuth';

const featureCards = [
  { icon: Brain,    text: 'AI-Powered Notes',  sub: 'Instant & structured',   color: '#a78bfa', bg: 'rgba(167,139,250,0.08)' },
  { icon: Zap,      text: 'Instant Quizzes',   sub: 'Test yourself fast',      color: '#fbbf24', bg: 'rgba(251,191,36,0.08)'  },
  { icon: CheckCircle, text: 'Progress Tracking', sub: 'See your growth',     color: '#34d399', bg: 'rgba(52,211,153,0.08)'  },
  { icon: Sparkles, text: 'Smart Roadmaps',    sub: 'Always know what\'s next', color: '#f472b6', bg: 'rgba(244,114,182,0.08)' },
];

export default function Login() {
  const [email, setEmail]                       = useState('');
  const [password, setPassword]                 = useState('');
  const [confirmPassword, setConfirmPassword]   = useState('');
  const [showPassword, setShowPassword]         = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading]                   = useState(false);
  const [googleLoading, setGoogleLoading]       = useState(false);
  const [focusedField, setFocusedField]         = useState(null);
  const googleBtnRef                            = useRef(null);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  /* ── Load Google Identity Services script ── */
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || clientId.includes('your-google-client-id')) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCredential,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
    };
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleGoogleCredential = async ({ credential }) => {
    setGoogleLoading(true);
    try {
      const { data } = await googleAuthApi(credential);
      loginUser(data);
      toast.success(`Welcome, ${data.name}!`);
      navigate('/welcome');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleClick = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || clientId.includes('your-google-client-id')) {
      toast.error('Google Client ID not configured. Add VITE_GOOGLE_CLIENT_ID to client/.env');
      return;
    }
    window.google?.accounts.id.prompt();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { data } = await loginApi({ email, password });
      loginUser(data);
      toast.success('Welcome back!');
      navigate('/welcome');
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.request && !err.response
          ? 'Cannot reach server. Start the backend with: cd server && npm run dev'
          : 'Login failed');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const inputWrap = (name) => ({
    position: 'relative',
    borderRadius: 14,
    transition: 'box-shadow 0.25s ease',
    boxShadow: focusedField === name
      ? '0 0 0 3px rgba(168,85,247,0.25), 0 0 20px rgba(168,85,247,0.12)'
      : 'none',
  });

  const inputStyle = (name) => ({
    width: '100%',
    height: 48,
    padding: '0 44px 0 44px',
    background: focusedField === name ? 'rgba(168,85,247,0.07)' : 'rgba(255,255,255,0.04)',
    border: `1.5px solid ${focusedField === name ? '#a855f7' : 'rgba(255,255,255,0.08)'}`,
    borderRadius: 14,
    color: '#f1f5f9',
    fontSize: 15,
    outline: 'none',
    transition: 'all 0.25s ease',
    boxSizing: 'border-box',
  });

  const inputStylePR = (name) => ({
    ...inputStyle(name),
    paddingRight: 44,
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0a1e 0%, #1a0e30 30%, #12082a 60%, #0d0c20 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>

      {/* Ambient blobs — multi-colour */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', left: '-10%', width: 560, height: 560, background: 'radial-gradient(circle, rgba(168,85,247,0.22) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '-8%', width: 480, height: 480, background: 'radial-gradient(circle, rgba(244,63,94,0.16) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 700, height: 220, background: 'radial-gradient(ellipse, rgba(6,182,212,0.12) 0%, transparent 70%)', filter: 'blur(30px)' }} />
        <div style={{ position: 'absolute', bottom: '30%', left: '20%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }} />
        {/* Dot grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(168,85,247,0.15) 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.5 }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: 980,
          display: 'flex',
          borderRadius: 28,
          overflow: 'hidden',
          border: '1px solid rgba(168,85,247,0.18)',
          background: 'rgba(18,14,36,0.85)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(168,85,247,0.1), inset 0 1px 0 rgba(255,255,255,0.07)',
        }}
      >

        {/* ── LEFT PANEL: Form ── */}
        <div style={{
          width: '45%',
          minWidth: 400,
          padding: '3rem 3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'rgba(22,16,42,0.7)',
          borderRight: '1px solid rgba(168,85,247,0.1)',
        }}>

          {/* Top section */}
          <div>
            {/* Logo + Brand */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 }}
              style={{ marginBottom: '2.5rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{
                  width: 42, height: 42,
                  background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                  borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(168,85,247,0.35)',
                  flexShrink: 0,
                }}>
                  <BookOpen size={20} color="white" />
                </div>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.01em' }}>
                  StudentAssistant
                </span>
              </div>

              <h1 style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '0.5rem',
              }}>
                Welcome back
              </h1>
              <p style={{ fontSize: '0.95rem', color: 'rgba(148,163,184,0.85)', lineHeight: 1.6 }}>
                Sign in to continue your learning journey
              </p>
            </motion.div>

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}
            >
              {/* ── Google Sign-In Button ── */}
              <motion.button
                type="button"
                onClick={handleGoogleClick}
                disabled={googleLoading}
                whileHover={!googleLoading ? { scale: 1.02, y: -1 } : {}}
                whileTap={!googleLoading ? { scale: 0.98 } : {}}
                style={{
                  width: '100%',
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  background: googleLoading ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.07)',
                  border: '1.5px solid rgba(255,255,255,0.15)',
                  borderRadius: 14,
                  color: '#f1f5f9',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: googleLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.22s ease',
                  backdropFilter: 'blur(8px)',
                  letterSpacing: '-0.01em',
                }}
              >
                {googleLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    <path fill="none" d="M0 0h48v48H0z"/>
                  </svg>
                )}
                {googleLoading ? 'Signing in...' : 'Continue with Google'}
              </motion.button>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                <span style={{ fontSize: '0.75rem', color: 'rgba(100,116,139,0.8)', fontWeight: 500, whiteSpace: 'nowrap' }}>or sign in with email</span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
              </div>
              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(148,163,184,0.9)', marginBottom: 7, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                  Email address
                </label>
                <div style={inputWrap('email')}>
                  <Mail size={16} color={focusedField === 'email' ? '#a855f7' : '#475569'} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', transition: 'color 0.2s', pointerEvents: 'none' }} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="you@example.com"
                    style={inputStyle('email')}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(148,163,184,0.9)', marginBottom: 7, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                  Password
                </label>
                <div style={inputWrap('password')}>
                  <Lock size={16} color={focusedField === 'password' ? '#a855f7' : '#475569'} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', transition: 'color 0.2s', pointerEvents: 'none' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••"
                    style={inputStylePR('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex', padding: 2 }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(148,163,184,0.9)', marginBottom: 7, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                  Confirm Password
                </label>
                <div style={inputWrap('confirm')}>
                  <Lock size={16} color={focusedField === 'confirm' ? '#a855f7' : '#475569'} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', transition: 'color 0.2s', pointerEvents: 'none' }} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setFocusedField('confirm')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••"
                    style={inputStylePR('confirm')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex', padding: 2 }}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.025, y: -2 } : {}}
                whileTap={!loading ? { scale: 0.975 } : {}}
                transition={{ duration: 0.2 }}
                style={{
                  width: '100%',
                  height: 50,
                  marginTop: '0.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  background: loading ? 'rgba(168,85,247,0.5)' : 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f43f5e 100%)',
                  backgroundSize: '200% 200%',
                  color: 'white',
                  border: 'none',
                  borderRadius: 14,
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 8px 28px rgba(168,85,247,0.35), 0 2px 8px rgba(0,0,0,0.3)',
                  transition: 'all 0.25s ease',
                  letterSpacing: '-0.01em',
                }}
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>Sign In <ArrowRight size={17} /></>
                )}
              </motion.button>
            </motion.form>

            <p style={{ marginTop: '1.4rem', textAlign: 'center', fontSize: '0.88rem', color: 'rgba(100,116,139,0.9)' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#c084fc', fontWeight: 600, textDecoration: 'none' }}>
                Create one free
              </Link>
            </p>
          </div>

          {/* Feature cards at bottom */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42 }}
            style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.85rem' }}>
              Everything you need to study smarter
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {featureCards.map(({ icon: Icon, text, sub, color, bg }, i) => (
                <FeatureCard key={text} Icon={Icon} text={text} sub={sub} color={color} bg={bg} delay={0.5 + i * 0.07} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT PANEL: Illustration ── */}
        <RightPanel />
      </motion.div>
    </div>
  );
}

function FeatureCard({ Icon, text, sub, color, bg, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '0.7rem 0.85rem',
        borderRadius: 12,
        background: hovered ? bg : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hovered ? color + '40' : 'rgba(255,255,255,0.06)'}`,
        cursor: 'default',
        transition: 'all 0.22s ease',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? `0 6px 20px ${color}18` : 'none',
      }}
    >
      <div style={{
        width: 34, height: 34, minWidth: 34,
        borderRadius: 9,
        background: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: `1px solid ${color}25`,
      }}>
        <Icon size={16} color={color} />
      </div>
      <div>
        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0', margin: 0, lineHeight: 1.2 }}>{text}</p>
        <p style={{ fontSize: '0.7rem', color: '#475569', margin: 0, marginTop: 2 }}>{sub}</p>
      </div>
    </motion.div>
  );
}

function RightPanel() {
  return (
    <div style={{
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
      background: '#0f081f',
      display: 'flex',
      flexDirection: 'column',
    }}
    className="hidden md:flex"
    >
      {/* Background image */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <img
          src="/assets/login_side_art.png"
          alt="Student Studying with AI"
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }}
        />
        {/* Lighter gradient overlay from bottom */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,8,31,0.95) 0%, rgba(15,8,31,0.45) 45%, rgba(15,8,31,0.08) 100%)' }} />
        {/* Side gradient for panel blending */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(22,16,42,0.35) 0%, transparent 35%)' }} />
        {/* Multi-colour tints */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 25%, rgba(168,85,247,0.12) 0%, transparent 50%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 75%, rgba(244,63,94,0.08) 0%, transparent 50%)' }} />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%', padding: '2rem 2.25rem' }}>

        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          style={{ alignSelf: 'flex-end', marginBottom: 'auto' }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7,
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 50,
            padding: '6px 14px',
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399', flexShrink: 0 }} />
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', fontWeight: 500, whiteSpace: 'nowrap' }}>AI Tutor Active</span>
          </div>
        </motion.div>

        {/* Mid — stat highlights */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: '2rem' }}
        >
          {[
            { value: '8+', label: 'Study Tools', color: '#c084fc' },
            { value: 'AI', label: 'Powered Notes', color: '#f472b6' },
            { value: '24/7', label: 'Tutor Access', color: '#34d399' },
            { value: '100%', label: 'Free to Start', color: '#fbbf24' },
          ].map(({ value, label, color }) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 14,
              padding: '0.9rem 1rem',
            }}>
              <p style={{ fontSize: '1.4rem', fontWeight: 800, color, margin: 0, lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</p>
              <p style={{ fontSize: '0.72rem', color: 'rgba(148,163,184,0.7)', margin: 0, marginTop: 4, fontWeight: 500 }}>{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Bottom text content */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48 }}
        >
          <h2 style={{
            fontSize: 'clamp(1.5rem, 2.2vw, 2rem)',
            fontWeight: 900,
            color: '#ffffff',
            lineHeight: 1.2,
            letterSpacing: '-0.03em',
            marginBottom: '0.6rem',
          }}>
            Learn anything.<br />
            <span style={{ background: 'linear-gradient(90deg, #c084fc, #f472b6, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Anytime. Anywhere.
            </span>
          </h2>
          <p style={{ color: 'rgba(148,163,184,0.75)', fontSize: '0.85rem', lineHeight: 1.65, marginBottom: '1.1rem', maxWidth: 280 }}>
            AI-powered study notes, quizzes, and progress tracking — all in one place.
          </p>

          {/* Feature pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {['Free forever', 'No credit card', '24/7 AI tutor'].map((text) => (
              <div key={text} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,0.07)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 50,
                padding: '5px 12px',
              }}>
                <CheckCircle size={12} color="#34d399" />
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', fontWeight: 500 }}>{text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
