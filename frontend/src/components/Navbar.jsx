import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser, FiHome, FiUsers, FiMessageSquare } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { path: '/dashboard', icon: <FiHome />, label: 'Dashboard', show: !!user },
    { path: '/posts', icon: <FiMessageSquare />, label: 'Post', show: !!user },
    { path: '/family', icon: <FiUsers />, label: 'Family', show: !!user && user.role !== 'admin' },
    { path: '/admin', icon: <FiUsers />, label: 'Admin Panel', show: !!user && user.role === 'admin', color: '#ff6b6b' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '0 32px',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(10,5,20,0.6)',
        backdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid rgba(245,166,35,0.15)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)'
      }}
    >
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
        <motion.span 
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.8 }}
          className="om-symbol" 
          style={{ fontSize: 32, color: '#f5a623', cursor: 'pointer' }}
        >
          ॐ
        </motion.span>
        <span style={{ fontFamily: 'Cinzel, serif', fontSize: 22, fontWeight: 700, letterSpacing: '1px' }} className="gold-text">
          Yadav Parivar
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {user ? (
          <>
            {navLinks.filter(link => link.show).map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                style={{ 
                  color: location.pathname === link.path ? '#f5a623' : 'rgba(255,255,255,0.7)', 
                  textDecoration: 'none', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8, 
                  fontSize: 14,
                  fontWeight: 500,
                  padding: '8px 16px',
                  borderRadius: '12px',
                  position: 'relative',
                  transition: 'color 0.3s ease'
                }}
              >
                {link.icon} {link.label}
                {location.pathname === link.path && (
                  <motion.div 
                    layoutId="nav-active"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(245,166,35,0.1)',
                      borderRadius: '12px',
                      zIndex: -1,
                      border: '1px solid rgba(245,166,35,0.2)'
                    }}
                  />
                )}
              </Link>
            ))}
            
            <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)', margin: '0 8px' }} />
            
            <span style={{ color: '#f5a623', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
              <FiUser /> {user.name}
            </span>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout} 
              className="btn-outline" 
              style={{ padding: '8px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, border: '1px solid rgba(245,166,35,0.4)' }}
            >
              <FiLogOut /> Logout
            </motion.button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/login">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-outline" style={{ padding: '8px 24px', fontSize: 14 }}>Login</motion.button>
            </Link>
            <Link to="/register">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-gold" style={{ padding: '8px 24px', fontSize: 14 }}>Register</motion.button>
            </Link>
          </div>
        )}
      </div>
    </motion.nav>
  );
}

