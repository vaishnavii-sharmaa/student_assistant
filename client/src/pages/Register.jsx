import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { BookOpen, Loader2, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { register as registerApi, googleAuth as googleAuthApi } from '../api/auth';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

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
      });
    };
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  const handleGoogleCredential = async ({ credential }) => {
    setGoogleLoading(true);
    try {
      const { data } = await googleAuthApi(credential);
      loginUser(data);
      toast.success(`Welcome, ${data.name}!`);
      navigate('/welcome');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Google sign-in failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleClick = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || clientId.includes('your-google-client-id')) {
      toast.error('Google Client ID not configured.');
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
      const { data } = await registerApi({ name, email, password });
      loginUser(data);
      toast.success('Registration successful!');
      navigate('/welcome');
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.request && !err.response
          ? 'Cannot reach server. Start the backend with: cd server && npm run dev'
          : 'Registration failed');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const focusColor = '#a855f7';
  const inputCls = (field) =>
    `w-full pl-11 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200 bg-white/[0.04] text-slate-100 placeholder:text-slate-500
     border ${focusedField === field ? 'border-purple-500 ring-2 ring-purple-500/25' : 'border-white/10 hover:border-white/20'}`;

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

      {/* Ambient blobs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', left: '-8%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', bottom: '5%', right: '-5%', width: 450, height: 450, background: 'radial-gradient(circle, rgba(244,63,94,0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(45px)' }} />
        <div style={{ position: 'absolute', top: '60%', left: '30%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', top: '-5%', right: '20%', width: 400, height: 250, background: 'radial-gradient(ellipse, rgba(251,191,36,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(168,85,247,0.12) 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.5 }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: 440,
          borderRadius: 24,
          overflow: 'hidden',
          border: '1px solid rgba(168,85,247,0.15)',
          background: 'rgba(18,14,36,0.85)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(168,85,247,0.08), inset 0 1px 0 rgba(255,255,255,0.07)',
          padding: '2.5rem 2.25rem',
        }}
      >
        {/* Logo + Title */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{
              width: 42, height: 42,
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(168,85,247,0.35)',
            }}>
              <BookOpen size={20} color="white" />
            </div>
            <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9' }}>StudentAssistant</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2rem)', fontWeight: 800, color: '#fff', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: 4 }}>
            Create your account
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'rgba(148,163,184,0.85)', lineHeight: 1.5 }}>
            Join thousands of students studying smarter
          </p>
        </motion.div>

        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>

          {/* Google Button */}
          <motion.button
            type="button"
            onClick={handleGoogleClick}
            disabled={googleLoading}
            whileHover={!googleLoading ? { scale: 1.02, y: -1 } : {}}
            whileTap={!googleLoading ? { scale: 0.98 } : {}}
            style={{
              width: '100%', height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              background: googleLoading ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.07)',
              border: '1.5px solid rgba(255,255,255,0.15)',
              borderRadius: 12, color: '#f1f5f9', fontWeight: 600, fontSize: '0.9rem',
              cursor: googleLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.22s ease', backdropFilter: 'blur(8px)',
            }}
          >
            {googleLoading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <svg width="17" height="17" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
            )}
            {googleLoading ? 'Signing up...' : 'Continue with Google'}
          </motion.button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: '0.72rem', color: 'rgba(100,116,139,0.8)', fontWeight: 500 }}>or register with email</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(148,163,184,0.9)', marginBottom: 5, letterSpacing: '0.02em', textTransform: 'uppercase' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={15} color={focusedField === 'name' ? focusColor : '#475569'} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', transition: 'color 0.2s', pointerEvents: 'none' }} />
              <input type="text" required value={name} onChange={e => setName(e.target.value)}
                onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)}
                placeholder="Your name" className={inputCls('name')} />
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(148,163,184,0.9)', marginBottom: 5, letterSpacing: '0.02em', textTransform: 'uppercase' }}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} color={focusedField === 'email' ? focusColor : '#475569'} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', transition: 'color 0.2s', pointerEvents: 'none' }} />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                placeholder="you@example.com" className={inputCls('email')} />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(148,163,184,0.9)', marginBottom: 5, letterSpacing: '0.02em', textTransform: 'uppercase' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} color={focusedField === 'password' ? focusColor : '#475569'} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', transition: 'color 0.2s', pointerEvents: 'none' }} />
              <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)}
                placeholder="Min 6 characters" className={inputCls('password')} />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(148,163,184,0.9)', marginBottom: 5, letterSpacing: '0.02em', textTransform: 'uppercase' }}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} color={focusedField === 'confirm' ? focusColor : '#475569'} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', transition: 'color 0.2s', pointerEvents: 'none' }} />
              <input type="password" required minLength={6} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                onFocus={() => setFocusedField('confirm')} onBlur={() => setFocusedField(null)}
                placeholder="Confirm password" className={inputCls('confirm')} />
            </div>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={!loading ? { scale: 1.025, y: -2 } : {}}
            whileTap={!loading ? { scale: 0.975 } : {}}
            style={{
              width: '100%', height: 48, marginTop: '0.25rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: loading ? 'rgba(168,85,247,0.5)' : 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f43f5e 100%)',
              backgroundSize: '200% 200%',
              color: 'white', border: 'none', borderRadius: 12,
              fontWeight: 700, fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 8px 28px rgba(168,85,247,0.35), 0 2px 8px rgba(0,0,0,0.3)',
              transition: 'all 0.25s ease',
            }}
          >
            {loading ? (
              <Loader2 size={19} className="animate-spin" />
            ) : (
              <>Create Account <ArrowRight size={16} /></>
            )}
          </motion.button>
        </motion.form>

        <p style={{ marginTop: '1.3rem', textAlign: 'center', fontSize: '0.85rem', color: 'rgba(100,116,139,0.9)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#c084fc', fontWeight: 600, textDecoration: 'none' }}>
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
