import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const containerVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.8, 
      ease: [0.33, 1, 0.68, 1],
      staggerChildren: 0.1,
      delayChildren: 0.2
    } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', form);
      login(data.user, data.token);
      toast.success('Welcome back! 🙏');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 20px 60px', position: 'relative', zIndex: 1 }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="glass-premium"
        style={{ width: '100%', maxWidth: 460, padding: '48px 40px' }}
      >
        <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: 40 }}>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
            style={{ fontSize: 64, marginBottom: 16, display: 'inline-block' }}
            className="om-symbol"
          >ॐ</motion.div>
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 28, fontWeight: 700, letterSpacing: '1px' }} className="gold-text">Welcome Back</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 8 }}>Sign in to continue your journey</p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <motion.div variants={itemVariants} className="form-group">
            <label style={{ fontSize: 13, marginBottom: 8, display: 'block', color: 'rgba(245, 166, 35, 0.8)' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <FiMail style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(245,166,35,0.6)', fontSize: 18 }} />
              <input
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={{ paddingLeft: 48, fontSize: 15 }}
                required
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="form-group" style={{ marginBottom: 32 }}>
            <label style={{ fontSize: 13, marginBottom: 8, display: 'block', color: 'rgba(245, 166, 35, 0.8)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(245,166,35,0.6)', fontSize: 18 }} />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Enter password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                style={{ paddingLeft: 48, paddingRight: 48, fontSize: 15 }}
                required
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(245,166,35,0.6)', cursor: 'pointer', fontSize: 18 }}>
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <div style={{ textAlign: 'right', marginTop: 10 }}>
              <Link to="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: 12 }}>Forgot Password?</Link>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              className="btn-gold"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              style={{ width: '100%', fontSize: 16, padding: '14px', opacity: loading ? 0.7 : 1, fontWeight: 700 }}
            >
              {loading ? 'Logging in...' : 'Login 🙏'}
            </motion.button>
          </motion.div>
        </form>

        <motion.p variants={itemVariants} style={{ textAlign: 'center', marginTop: 32, color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
          New to Yadav Parivar?{' '}
          <Link to="/register" style={{ color: '#f5a623', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid currentColor', paddingBottom: 2 }}>Create Account</Link>
        </motion.p>
      </motion.div>
    </div>
  );
}

