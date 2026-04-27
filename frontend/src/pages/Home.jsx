import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

const item = {
  hidden: { y: 30, opacity: 0, filter: 'blur(10px)' },
  show: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } }
};

export default function Home() {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 20px 60px', textAlign: 'center', position: 'relative', zIndex: 1 }}>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{ width: '100%', maxWidth: 1200 }}
      >
        <motion.div
          variants={item}
          style={{ fontSize: 'clamp(60px, 10vw, 100px)', marginBottom: 10, cursor: 'default' }}
          className="om-symbol"
        >
          ॐ
        </motion.div>

        <motion.h1
          variants={item}
          style={{ 
            fontFamily: 'Cinzel, serif', 
            fontSize: 'clamp(40px, 8vw, 84px)', 
            lineHeight: 1.1, 
            marginBottom: 24,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}
          className="gold-text"
        >
          Yadav Parivar
        </motion.h1>

        <motion.p
          variants={item}
          style={{ 
            fontSize: 'clamp(20px, 3vw, 28px)', 
            color: '#f5a623', 
            marginBottom: 16,
            fontWeight: 500,
            fontFamily: 'Cinzel, serif'
          }}
        >
          जय श्री कृष्ण 🙏
        </motion.p>

        <motion.p
          variants={item}
          style={{ 
            fontSize: 'clamp(16px, 2vw, 20px)', 
            color: 'rgba(255,255,255,0.7)', 
            maxWidth: 650, 
            lineHeight: 1.8, 
            marginBottom: 48,
            margin: '0 auto 48px'
          }}
        >
          Preserve your heritage, connect with your roots, and build a digital legacy for the Yadav community. Join our growing family today.
        </motion.p>

        <motion.div
          variants={item}
          style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 80 }}
        >
          {user ? (
            <Link to="/dashboard">
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="btn-gold" 
                style={{ fontSize: 17, padding: '16px 48px' }}
              >
                Go to Dashboard
              </motion.button>
            </Link>
          ) : (
            <>
              <Link to="/register">
                <motion.button 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="btn-gold" 
                  style={{ fontSize: 17, padding: '16px 48px' }}
                >
                  Join Parivar
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="btn-outline" 
                  style={{ fontSize: 17, padding: '16px 48px' }}
                >
                  Login
                </motion.button>
              </Link>
            </>
          )}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={item}
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
            gap: 24,
            width: '100%'
          }}
        >
          {[
            { icon: '👨‍👩‍👧‍👦', label: 'Family Records', desc: 'Securely store and manage your detailed family lineage.' },
            { icon: '🔐', label: 'Secure Data', desc: 'End-to-end protection for your personal information.' },
            { icon: '📜', label: 'Heritage Preserved', desc: 'Maintain ancestral records for generations to come.' },
            { icon: '🌸', label: 'Gotra & Village', desc: 'Identify shared roots and connect via village ties.' }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ 
                y: -12, 
                backgroundColor: 'rgba(245, 166, 35, 0.08)',
                borderColor: 'rgba(245, 166, 35, 0.4)',
                rotateX: 5,
                rotateY: 5
              }}
              className="glass-premium"
              style={{ 
                padding: '40px 32px', 
                textAlign: 'center', 
                cursor: 'default',
                transition: 'background-color 0.3s ease, border-color 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                perspective: '1000px'
              }}
            >
              <motion.div 
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                style={{ fontSize: 48, marginBottom: 20 }}
              >
                {item.icon}
              </motion.div>
              <h3 style={{ fontSize: 20, color: '#f5d020', fontWeight: 600, marginBottom: 12, fontFamily: 'Cinzel, serif' }}>{item.label}</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

