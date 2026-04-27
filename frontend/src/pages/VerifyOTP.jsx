import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function VerifyOTP() {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const role = location.state?.role;
  const form = location.state?.form;

  useEffect(() => {
    if (!email) navigate('/register');
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleDigit = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async () => {
    const otp = digits.join('');
    if (otp.length < 6) { toast.error('Enter all 6 digits'); return; }
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/verify-otp', { email, otp, form });
      login(data.user, data.token);
      toast.success('Sanctity Verified! Welcome to the Parivar 🙏');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification Failed');
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await axios.post('/api/auth/resend-otp', { email, role });
      toast.success('A new code has been broadcasted');
      setCountdown(60);
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend');
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 20px 80px', position: 'relative', zIndex: 1 }}>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
        className="glass-premium"
        style={{ width: '100%', maxWidth: 480, padding: '64px 48px', textAlign: 'center' }}
      >
        <div style={{ position: 'relative', height: 80, marginBottom: 32, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
           <motion.div 
             animate={{ scale: [1, 1.2, 1] }} 
             transition={{ duration: 4, repeat: Infinity }} 
             style={{ position: 'absolute', width: 60, height: 60, background: 'radial-gradient(circle, rgba(245,166,35,0.2) 0%, transparent 70%)', filter: 'blur(10px)' }}
           />
           <motion.div
             animate={{ y: [0, -5, 0] }}
             transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
             style={{ fontSize: 64, color: '#f5d020', textShadow: '0 0 20px rgba(245,166,35,0.4)', position: 'relative', zIndex: 1 }}
             className="om-symbol"
           >ॐ</motion.div>
        </div>

        <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 32, fontWeight: 800, marginBottom: 12, letterSpacing: '1px' }} className="gold-text">
          Refine Verification
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16, marginBottom: 6, lineHeight: 1.6 }}>
          A spiritual link has been sent to
        </p>
        <p style={{ color: '#f5a623', fontSize: 18, fontWeight: 700, marginBottom: 48, letterSpacing: '0.5px' }}>{email}</p>

        {/* OTP Boxes */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 48 }} onPaste={handlePaste}>
          {digits.map((d, i) => (
            <motion.input
              key={i}
              ref={el => inputRefs.current[i] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={e => handleDigit(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              whileFocus={{ scale: 1.1, borderColor: '#f5a623' }}
              style={{
                width: 54,
                height: 64,
                textAlign: 'center',
                fontSize: 28,
                fontWeight: 800,
                background: d ? 'rgba(245,166,35,0.1)' : 'rgba(0,0,0,0.3)',
                border: d ? '2px solid rgba(245,166,35,0.8)' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: 14,
                color: '#fff',
                outline: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                caretColor: '#f5a623',
                fontFamily: 'Poppins, sans-serif'
              }}
            />
          ))}
        </div>

        <motion.button
          onClick={handleSubmit}
          className="btn-gold"
          whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(245,166,35,0.3)' }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          style={{ width: '100%', fontSize: 18, padding: '18px', opacity: loading ? 0.7 : 1, marginBottom: 32, fontWeight: 800 }}
        >
          {loading ? 'Confirming...' : 'Finalize Sanctity 🙏'}
        </motion.button>

        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
          {countdown > 0 ? (
            <span>Request a new link in <span style={{ color: '#f5a623', fontWeight: 800 }}>{countdown}s</span></span>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleResend}
              disabled={resending}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, textDecoration: 'none', color: '#f5d020' }}
            >
              {resending ? 'Broadcasting...' : 'Broadcast Again'}
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

