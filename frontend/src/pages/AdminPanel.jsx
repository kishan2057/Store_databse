import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiUser, FiPhone, FiMapPin, FiX, FiSearch, FiShield, FiUsers, FiPlus, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      staggerChildren: 0.1 
    } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', citizenshipNumber: '', phone: '', address: '', role: 'user' });
  const [searchQuery, setSearchQuery] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (editingUser || isAdding) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [editingUser, isAdding]);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length === 0) {
      fetchUsers();
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/search?q=${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(data);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user and all associated family data? This action is irreversible.')) return;
    
    try {
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User deleted successfully');
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/api/admin/users/${editingUser._id}`, editingUser, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User profile successfully refined');
      setUsers(users.map(u => u._id === data._id ? data : u));
      setEditingUser(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user');
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/auth/register', newUser);
      toast.success('New user added to the Parivar');
      setUsers(prev => [data.user, ...prev]);
      setIsAdding(false);
      setNewUser({ name: '', email: '', password: '', citizenshipNumber: '', phone: '', address: '', role: 'user' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add user');
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '120px 20px 80px', position: 'relative', zIndex: 1, maxWidth: 1400, margin: '0 auto' }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="glass-premium"
        style={{ padding: '48px', width: '100%' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, gap: 32, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(28px, 4vw, 42px)', margin: '0 0 12px 0', fontWeight: 800 }} className="gold-text">Administrative Vault</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0, fontSize: 16 }}>Curate and oversee the digital lineage of the Yadav Parivar.</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 24px', borderRadius: '16px', border: '1px solid rgba(245,166,35,0.2)', display: 'flex', alignItems: 'center', gap: 12 }}>
               <FiUsers style={{ color: '#f5a623', fontSize: 20 }} />
               <div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Active Parivars</div>
                  <div style={{ color: '#fff', fontSize: 18, fontWeight: 800 }}>{users.length}</div>
               </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAdding(true)} 
              className="btn-gold" 
              style={{ padding: '16px 32px', fontSize: 15, display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700 }}
            >
              <FiPlus /> New Record
            </motion.button>
          </div>
        </div>

        <div style={{ marginBottom: 40, width: '100%', position: 'relative' }}>
          <FiSearch style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', color: 'rgba(245,166,35,0.6)', fontSize: 20 }} />
          <input 
            type="text" 
            placeholder="Search lineage by name, citizenship number, or contact..." 
            value={searchQuery}
            onChange={handleSearch}
            className="admin-search-input"
            style={{ 
              width: '100%', 
              padding: '20px 24px 20px 64px', 
              borderRadius: '20px', 
              border: '1px solid rgba(255,255,255,0.05)', 
              background: 'rgba(255,255,255,0.03)', 
              color: '#fff',
              fontSize: 17,
              outline: 'none',
              transition: 'all 0.3s ease'
            }} 
          />
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="glass loading-shimmer" style={{ height: 60, borderRadius: 12 }}></div>)}
          </div>
        ) : (
          <div style={{ overflowX: 'auto', borderRadius: '24px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(245,166,35,0.6)', fontSize: 13, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>
                  <th style={{ padding: '24px 32px' }}>Member Information</th>
                  <th style={{ padding: '24px 32px' }}>Contact & Access</th>
                  <th style={{ padding: '24px 32px' }}>ID Context</th>
                  <th style={{ padding: '24px 32px' }}>Privilege</th>
                  <th style={{ padding: '24px 32px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <motion.tr 
                    key={user._id} 
                    variants={itemVariants}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.3s' }} 
                    className="table-row-hover"
                  >
                    <td style={{ padding: '24px 32px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ position: 'relative' }}>
                          {user.photo ? (
                            <img src={user.photo} alt={user.name} style={{ width: 48, height: 48, borderRadius: '16px', objectFit: 'cover', border: '2px solid rgba(245,166,35,0.2)' }} />
                          ) : (
                            <div style={{ width: 48, height: 48, borderRadius: '16px', background: 'linear-gradient(135deg, rgba(245,166,35,0.2), transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f5a623', fontSize: 20, border: '1px solid rgba(245,166,35,0.1)' }}><FiUser /></div>
                          )}
                          {user.role === 'admin' && <div style={{ position: 'absolute', bottom: -5, right: -5, background: '#f5a623', border: '2px solid #0a0a0a', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiShield size={10} color="#000" /></div>}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 16, color: '#fff' }}>{user.name}</div>
                          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>Registered {new Date(user.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '24px 32px' }}>
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 500 }}>{user.email}</div>
                      {user.phone && <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{user.phone}</div>}
                    </td>
                    <td style={{ padding: '24px 32px', color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
                      <span style={{ fontFamily: 'monospace', letterSpacing: '0.5px' }}>{user.citizenshipNumber || 'N/A'}</span>
                    </td>
                    <td style={{ padding: '24px 32px' }}>
                      <span style={{ 
                        padding: '6px 14px', borderRadius: '10px', fontSize: 11, fontWeight: 800, letterSpacing: '0.5px',
                        background: user.role === 'admin' ? 'rgba(245,166,35,0.15)' : 'rgba(255,255,255,0.05)',
                        color: user.role === 'admin' ? '#f5a623' : 'rgba(255,255,255,0.5)',
                        border: '1px solid ' + (user.role === 'admin' ? 'rgba(245,166,35,0.2)' : 'rgba(255,255,255,0.05)')
                      }}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '24px 32px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setEditingUser(user)} style={{ background: 'rgba(77,171,247,0.1)', border: 'none', color: '#4dabf7', cursor: 'pointer', padding: 10, borderRadius: '12px', fontSize: 18 }} title="Refine Record">
                          <FiEdit2 />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDelete(user._id)} style={{ background: 'rgba(255,107,107,0.1)', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: 10, borderRadius: '12px', fontSize: 18 }} title="Expunge Data">
                          <FiTrash2 />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingUser && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}
            onClick={() => setEditingUser(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 40, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 40, opacity: 0 }}
              className="glass-premium"
              style={{ width: '100%', maxWidth: 550, padding: 0, position: 'relative', border: '1px solid rgba(255,215,0,0.15)' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ padding: '32px 40px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: 24, color: '#fff', fontFamily: 'Cinzel, serif', fontWeight: 700 }} className="gold-text">Refine Member</h3>
                <motion.button whileHover={{ rotate: 90 }} onClick={() => setEditingUser(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', fontSize: 24, width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><FiX /></motion.button>
              </div>
              
              <div style={{ padding: 40 }}>
                <form onSubmit={handleUpdateUser}>
                  <div className="form-group" style={{ marginBottom: 24 }}>
                    <label style={{ color: 'rgba(245,166,35,0.8)', fontSize: 14, fontWeight: 700, marginBottom: 12, display: 'block' }}>Full Name</label>
                    <div style={{ position: 'relative' }}>
                      <FiUser style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(245,166,35,0.6)', fontSize: 18 }} />
                      <input type="text" value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} style={{ paddingLeft: 48, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,215,0,0.1)', height: 50, borderRadius: 12 }} required />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                    <div className="form-group">
                      <label style={{ color: 'rgba(245,166,35,0.8)', fontSize: 14, fontWeight: 700, marginBottom: 12, display: 'block' }}>Phone Number</label>
                      <div style={{ position: 'relative' }}>
                        <FiPhone style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(245,166,35,0.6)', fontSize: 18 }} />
                        <input type="text" value={editingUser.phone} onChange={e => setEditingUser({...editingUser, phone: e.target.value})} style={{ paddingLeft: 48, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,215,0,0.1)', height: 50, borderRadius: 12 }} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label style={{ color: 'rgba(245,166,35,0.8)', fontSize: 14, fontWeight: 700, marginBottom: 12, display: 'block' }}>User Privilege</label>
                      <select 
                        value={editingUser.role} 
                        onChange={e => setEditingUser({...editingUser, role: e.target.value})}
                        style={{ width: '100%', height: 50, borderRadius: 12, border: '1px solid rgba(255,215,0,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', padding: '0 16px', appearance: 'none' }}
                      >
                        <option value="user" style={{ background: '#1c1c1c' }}>Standard User</option>
                        <option value="admin" style={{ background: '#1c1c1c' }}>Vault Admin</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 40 }}>
                    <label style={{ color: 'rgba(245,166,35,0.8)', fontSize: 14, fontWeight: 700, marginBottom: 12, display: 'block' }}>Residential Address</label>
                    <div style={{ position: 'relative' }}>
                      <FiMapPin style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(245,166,35,0.6)', fontSize: 18 }} />
                      <input type="text" value={editingUser.address} onChange={e => setEditingUser({...editingUser, address: e.target.value})} style={{ paddingLeft: 48, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,215,0,0.1)', height: 50, borderRadius: 12 }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 16 }}>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn-gold" style={{ flex: 1, padding: '16px', borderRadius: 14, fontWeight: 800, fontSize: 16 }}>Apply Changes</motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add User Modal */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}
            onClick={() => setIsAdding(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 40, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 40, opacity: 0 }}
              className="glass-premium"
              style={{ width: '100%', maxWidth: 550, padding: 0, border: '1px solid rgba(255,215,0,0.15)' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ padding: '32px 40px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: 24, color: '#fff', fontFamily: 'Cinzel, serif', fontWeight: 700 }} className="gold-text">Forge New Identity</h3>
                <motion.button whileHover={{ rotate: 90 }} onClick={() => setIsAdding(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', fontSize: 24, width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><FiX /></motion.button>
              </div>

              <div style={{ padding: 40 }}>
                <form onSubmit={handleAddUser}>
                  <div className="form-group" style={{ marginBottom: 20 }}>
                    <label style={{ color: 'rgba(245,166,35,0.8)', fontSize: 14, fontWeight: 700, marginBottom: 12, display: 'block' }}>Full Name *</label>
                    <div style={{ position: 'relative' }}>
                      <FiUser style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(245,166,35,0.6)', fontSize: 18 }} />
                      <input type="text" placeholder="Member's full legal name" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} style={{ paddingLeft: 48, height: 50, borderRadius: 12, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,215,0,0.1)' }} required />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 20 }}>
                    <label style={{ color: 'rgba(245,166,35,0.8)', fontSize: 14, fontWeight: 700, marginBottom: 12, display: 'block' }}>Email Address *</label>
                    <input type="email" placeholder="member@parivar.com" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} style={{ height: 50, borderRadius: 12, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,215,0,0.1)' }} required />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                    <div className="form-group">
                      <label style={{ color: 'rgba(245,166,35,0.8)', fontSize: 14, fontWeight: 700, marginBottom: 12, display: 'block' }}>Secure Password *</label>
                      <input type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} style={{ height: 50, borderRadius: 12, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,215,0,0.1)' }} required />
                    </div>
                    <div className="form-group">
                      <label style={{ color: 'rgba(245,166,35,0.8)', fontSize: 14, fontWeight: 700, marginBottom: 12, display: 'block' }}>Citizenship No. *</label>
                      <input type="text" placeholder="ID Number" value={newUser.citizenshipNumber} onChange={e => setNewUser({...newUser, citizenshipNumber: e.target.value})} style={{ height: 50, borderRadius: 12, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,215,0,0.1)' }} required />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 40 }}>
                    <label style={{ color: 'rgba(245,166,35,0.8)', fontSize: 14, fontWeight: 700, marginBottom: 12, display: 'block' }}>Administrative Role</label>
                    <select 
                      value={newUser.role} 
                      onChange={e => setNewUser({...newUser, role: e.target.value})}
                      style={{ width: '100%', height: 50, borderRadius: 12, border: '1px solid rgba(255,215,0,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', padding: '0 16px', appearance: 'none' }}
                    >
                      <option value="user" style={{ background: '#1c1c1c' }}>Standard Member</option>
                      <option value="admin" style={{ background: '#1c1c1c' }}>Vault Admin</option>
                    </select>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }} 
                    type="submit" 
                    className="btn-gold" 
                    style={{ width: '100%', padding: '18px', borderRadius: 14, fontWeight: 800, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}
                  >
                    Commit to Vault <FiArrowRight />
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .table-row-hover:hover { background: rgba(255,255,255,0.04) !important; }
        .admin-search-input:focus { border-color: rgba(245,166,35,0.5) !important; background: rgba(255,255,255,0.06) !important; box-shadow: 0 0 20px rgba(0,0,0,0.3); }
      `}</style>
    </div>
  );
}

