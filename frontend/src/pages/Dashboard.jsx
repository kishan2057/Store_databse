import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FiEdit, FiUsers, FiUser, FiMapPin, FiCalendar, FiSmartphone, FiHash, FiActivity, FiMail } from 'react-icons/fi';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

export default function Dashboard() {
  const { user, token } = useAuth();
  const [family, setFamily] = useState(null);
  const [loading, setLoading] = useState(true);

  const [userProfile, setUserProfile] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    Promise.all([
      axios.get('/api/family', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: null })),
      axios.get('/api/auth/profile', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: null }))
    ]).then(([familyRes, profileRes]) => {
      setFamily(familyRes.data);
      if (profileRes.data) setUserProfile(profileRes.data);
      setLoading(false);
    });
  }, [token]);

  useEffect(() => {
    if (showProfile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showProfile]);

  return (
    <div style={{ minHeight: '100vh', padding: '120px 20px 80px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(28px, 5vw, 48px)', marginBottom: 12, fontWeight: 800 }} className="gold-text">
          🙏 Jai Shri Krishna, {user?.name}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 48, fontSize: 16, letterSpacing: '0.5px' }}>Welcome to your family heritage dashboard</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 48 }}
      >
        {[
          { icon: <FiUser size={28} />, label: 'Your Profile', value: user?.name, color: '#f5a623', active: true },
          { icon: <FiUsers size={28} />, label: 'Family Status', value: family ? 'Registered' : 'Not Added', color: family ? '#51cf66' : '#ff6b6b' },
          { icon: <FiMapPin size={28} />, label: 'Village / Gotra', value: family?.gotra || family?.village || 'Not set', color: '#74c0fc' },
          { icon: <FiActivity size={28} />, label: 'Account Role', value: user?.role === 'admin' ? 'Main Admin' : 'Family Member', color: '#cc5de8' }
        ].map((stat, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{ 
              y: -8, 
              scale: 1.02,
              rotateX: 2,
              rotateY: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.08)'
            }}
            className="glass-premium"
            onClick={stat.active ? () => setShowProfile(true) : undefined}
            style={{ padding: '32px 24px', textAlign: 'center', cursor: stat.active ? 'pointer' : 'default', perspective: '1000px' }}
          >
            <div style={{ color: stat.color, marginBottom: 16, display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>{stat.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{stat.value}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Hero Action Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.6 }}
        className="glass-premium" 
        style={{ 
          padding: '48px', 
          marginBottom: 48, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          textAlign: 'center', 
          background: 'linear-gradient(135deg, rgba(245,166,35,0.1) 0%, rgba(10,5,20,0.4) 100%)',
          border: '1px solid rgba(245,166,35,0.2)'
        }}
      >
        <div style={{ fontSize: 64, marginBottom: 24, filter: 'drop-shadow(0 0 20px rgba(245,166,35,0.3))' }}>📢</div>
        <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 32, marginBottom: 16, fontWeight: 700 }} className="gold-text">Community Newsfeed</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 32, fontSize: 18, maxWidth: 700, lineHeight: 1.6 }}>Stay synchronized with the latest broadcasts, events, and important notices from the Yadav Parivar community leaders.</p>
        <Link to="/posts">
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(245,166,35,0.4)' }} 
            whileTap={{ scale: 0.95 }}
            className="btn-gold" 
            style={{ padding: '16px 48px', fontSize: 17 }}
          >
            Explore Newsfeed
          </motion.button>
        </Link>
      </motion.div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }}>
          <div className="glass loading-shimmer" style={{ height: 300, borderRadius: 24 }}></div>
          <div className="glass loading-shimmer" style={{ height: 400, borderRadius: 24 }}></div>
        </div>
      ) : user?.role !== 'admin' ? (
        family ? (
          <>
            {/* Enhanced Family Tree */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: 0.3 }} 
              className="glass-premium" 
              style={{ padding: '64px 32px', marginBottom: 48, textAlign: 'center', background: 'rgba(0,0,0,0.2)' }}
            >
              <h2 className="section-title" style={{ marginBottom: 64, fontSize: 28, fontWeight: 700 }}>🌳 Ancestral Family Tree</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40, position: 'relative' }}>
                {/* Visual connectors using absolute lines can be complex, using simple vertical spacers for now */}
                
                {/* Grandparents Layer */}
                {family.grandfather?.name && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <TreeCard title="Grandfather" name={family.grandfather.name} blood={family.grandfather.bloodGroup} image={family.grandfather.image} />
                    <div style={{ width: 2, height: 40, background: 'linear-gradient(to bottom, var(--gold), transparent)', opacity: 0.4 }}></div>
                  </div>
                )}
                
                {/* Parents Layer */}
                <div style={{ display: 'flex', gap: '48px', justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <TreeCard title="Father" name={family.father?.name} blood={family.father?.bloodGroup} image={family.father?.image} />
                    <div style={{ width: 2, height: 40, background: 'linear-gradient(to bottom, var(--gold), transparent)', opacity: 0.4 }}></div>
                  </div>
                  {family.mother?.name && (
                    <TreeCard title="Mother" name={family.mother.name} blood={family.mother.bloodGroup} image={family.mother.image} />
                  )}
                </div>

                {/* User Layer */}
                <div style={{ display: 'flex', gap: '48px', justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <TreeCard title="You" name={user?.name} highlight />
                    {family.children?.length > 0 && <div style={{ width: 2, height: 40, background: 'linear-gradient(to bottom, var(--gold), transparent)', opacity: 0.4 }}></div>}
                  </div>
                  {family.spouse?.name && (
                    <TreeCard title="Spouse" name={family.spouse.name} image={family.spouse.image} />
                  )}
                </div>

                {/* Children Layer */}
                {family.children?.length > 0 && (
                  <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {family.children.map((child, i) => (
                      <TreeCard key={i} title="Child" name={child.name} image={child.image} />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Family Photo */}
            {family.familyPhoto && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-premium" style={{ padding: '48px', marginBottom: 48, textAlign: 'center' }}>
                 <h2 className="section-title" style={{ marginBottom: 32 }}>Our Family Heritage</h2>
                 <motion.img 
                  whileHover={{ scale: 1.02 }}
                  src={family.familyPhoto} 
                  alt="Family" 
                  style={{ maxWidth: '100%', maxHeight: 500, borderRadius: 20, border: '3px solid rgba(245,166,35,0.3)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }} 
                 />
              </motion.div>
            )}

            {/* Detailed Records */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-premium" style={{ padding: '48px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
                <h2 className="section-title" style={{ margin: 0 }}>Comprehensive Records</h2>
                <Link to="/family">
                  <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                    className="btn-outline" 
                    style={{ padding: '10px 24px', fontSize: 14, display: 'flex', alignItems: 'center', gap: 10 }}
                  >
                    <FiEdit /> Update Lineage
                  </motion.button>
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
                {/* Grandfather Section */}
                {family.grandfather?.name && (
                  <RecordCard 
                    title="Grandfather" 
                    icon={<FiUser color="#f5a623" />} 
                    data={[
                      { label: 'Full Name', value: family.grandfather.name },
                      { label: 'Citizenship No.', value: family.grandfather.citizenshipNumber },
                      { label: 'Blood Group', value: family.grandfather.bloodGroup },
                      { label: 'Primary Occupation', value: family.grandfather.occupation }
                    ]}
                  />
                )}

                {/* Father Section */}
                <RecordCard 
                  title="Father" 
                  icon={<FiUser color="#f5a623" />} 
                  data={[
                    { label: 'Full Name', value: family.father?.name },
                    { label: 'Citizenship No.', value: family.father?.citizenshipNumber },
                    { label: 'Blood Group', value: family.father?.bloodGroup },
                    { label: 'Primary Occupation', value: family.father?.occupation },
                    { label: 'Contact Number', value: family.father?.phone }
                  ]}
                />

                {/* Mother Section */}
                <RecordCard 
                  title="Mother" 
                  icon={<FiUser color="#f5a623" />} 
                  data={[
                    { label: 'Full Name', value: family.mother?.name },
                    { label: 'Citizenship No.', value: family.mother?.citizenshipNumber },
                    { label: 'Blood Group', value: family.mother?.bloodGroup },
                    { label: 'Primary Occupation', value: family.mother?.occupation }
                  ]}
                />

                {/* Heritage Section */}
                <RecordCard 
                  title="Heritage & Roots" 
                  icon={<FiMapPin color="#74c0fc" />} 
                  data={[
                    { label: 'Village of Origin', value: family.village },
                    { label: 'Family Gotra', value: family.gotra },
                    { label: 'Total Descendants', value: family.children?.length ? `${family.children.length} registered` : 'None yet' },
                    { label: 'Sibling Connections', value: family.siblings?.length ? `${family.siblings.length} registered` : 'None yet' }
                  ]}
                />
              </div>
            </motion.div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-premium" style={{ padding: '80px 48px', textAlign: 'center' }}>
            <div style={{ fontSize: 80, marginBottom: 24, filter: 'grayscale(1) opacity(0.5)' }}>👨‍👩‍👧‍👦</div>
            <h3 style={{ color: '#f5a623', fontFamily: 'Cinzel, serif', fontSize: 28, marginBottom: 16 }}>Legacy Awaits</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 40, fontSize: 16, maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.6 }}>Your family records are currently empty. Start building your digital heritage profile to generate your Family Tree.</p>
            <Link to="/family">
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="btn-gold" 
                style={{ fontSize: 17, padding: '16px 48px' }}
              >
                Register Family Details
              </motion.button>
            </Link>
          </motion.div>
        )
      ) : null}

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfile && userProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)' }}
            onClick={() => setShowProfile(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 40, opacity: 0 }}
              className="glass-premium"
              style={{ width: '90%', maxWidth: 500, padding: 48, position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}
              onClick={e => e.stopPropagation()}
            >
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 90 }}
                onClick={() => setShowProfile(false)}
                style={{ position: 'absolute', top: 24, right: 24, background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 32, cursor: 'pointer' }}
              >
                ×
              </motion.button>
              
              <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, #f5a623, #f5d020)', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, color: '#1a0a00', boxShadow: '0 10px 30px rgba(245,166,35,0.4)' }}>
                  <FiUser />
                </div>
                <h2 style={{ margin: 0, fontSize: 32, fontWeight: 700 }} className="gold-text">{userProfile.name}</h2>
                <div style={{ color: '#f5a623', fontSize: 14, marginTop: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Verified Parivar Member</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <ModalRow icon={<FiMail size={18} />} label="Email Address" value={userProfile.email} />
                <ModalRow icon={<FiHash size={18} />} label="Citizenship ID" value={userProfile.citizenshipNumber} />
                <ModalRow icon={<FiSmartphone size={18} />} label="Phone Number" value={userProfile.phone || 'Not provided'} />
                <ModalRow icon={<FiMapPin size={18} />} label="Current Location" value={userProfile.address || 'Not provided'} />
                <ModalRow icon={<FiCalendar size={18} />} label="Joining Date" value={new Date(userProfile.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} />
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowProfile(false)}
                className="btn-gold"
                style={{ width: '100%', marginTop: 40, padding: '14px' }}
              >
                Close Profile
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TreeCard({ title, name, blood, highlight, image }) {
  if (!name) return null;
  return (
    <motion.div 
      whileHover={{ scale: 1.15, y: -5, boxShadow: '0 10px 30px rgba(245,166,35,0.2)' }}
      className="card-3d"
      style={{ 
        padding: '16px 28px', 
        borderRadius: 16, 
        border: highlight ? '2px solid #f5a623' : '1px solid rgba(245,166,35,0.2)',
        background: highlight ? 'rgba(245,166,35,0.15)' : 'rgba(255,255,255,0.03)',
        minWidth: 180,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backdropFilter: 'blur(10px)',
        zIndex: 10
      }}
    >
      {image ? (
        <img src={image} alt={name} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', marginBottom: 12, border: '2px solid #f5a623', padding: 2, background: 'rgba(255,255,255,0.1)' }} />
      ) : (
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(245,166,35,0.1)', color: '#f5a623', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 12, border: '2px solid rgba(245,166,35,0.3)' }}>
          <FiUser />
        </div>
      )}
      <div style={{ fontSize: 11, color: highlight ? '#f5d020' : 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6, fontWeight: 700 }}>{title}</div>
      <div style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>{name}</div>
      {blood && <div style={{ fontSize: 13, color: '#ff6b6b', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>🩸 {blood}</div>}
    </motion.div>
  );
}

function RecordCard({ title, icon, data }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      style={{ background: 'rgba(255,255,255,0.02)', padding: 32, borderRadius: 20, border: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 16 }}>
        <div style={{ fontSize: 20 }}>{icon}</div>
        <h3 style={{ fontSize: 18, color: '#f5d020', fontFamily: 'Cinzel, serif', fontWeight: 600 }}>{title}</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {data.map((row, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 11, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', fontWeight: 600 }}>{row.label}</span>
            <span style={{ fontSize: 15, color: '#fff', fontWeight: 500 }}>{row.value || '---'}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ModalRow({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ color: '#f5a623' }}>{icon}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>{label}</span>
        <span style={{ fontWeight: 500, color: '#fff' }}>{value}</span>
      </div>
    </div>
  );
}
