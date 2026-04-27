import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiImage, FiVideo, FiX, FiTrash2, FiMessageSquare, FiHeart, FiSend } from 'react-icons/fi';

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
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] } }
};

export default function Newsfeed() {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Composer State
  const [showPostModal, setShowPostModal] = useState(false);
  const [post, setPost] = useState({ text: '', image: '', videoUrl: '' });
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [token]);

  useEffect(() => {
    if (showPostModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showPostModal]);

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get('/api/posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(data);
    } catch (err) {
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!post.text && !post.image && !post.videoUrl) {
      toast.error('Post must contain at least text, image, or video link');
      return;
    }
    setPosting(true);
    try {
      const { data } = await axios.post('/api/posts', post, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Announcement broadcasted!');
      setPosts([data, ...posts]);
      setPost({ text: '', image: '', videoUrl: '' });
      setShowPostModal(false);
    } catch (err) {
      toast.error('Failed to create post');
    } finally {
      setPosting(false);
    }
  };

  const handleToggleLike = async (postId) => {
    try {
      const { data } = await axios.post(`/api/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(posts.map(p => p._id === postId ? { ...p, likes: data.likes } : p));
    } catch (err) {
      toast.error('Failed to update like');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    
    try {
      await axios.delete(`/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Post deleted');
      setPosts(posts.filter(p => p._id !== postId));
    } catch (err) {
      toast.error('Failed to delete post');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error('Image is too large! (Limit 10MB)'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setPost({ ...post, image: ev.target.result });
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '120px 20px 80px', maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(32px, 6vw, 56px)', marginBottom: 16, textAlign: 'center', fontWeight: 800 }} className="gold-text">
          Community Newsfeed
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 64, fontSize: 18, textAlign: 'center', maxWidth: 600, margin: '0 auto 64px' }}>
          Real-time broadcasts and heritage updates for the Yadav Parivar.
        </p>
      </motion.div>

      {/* Admin Post Composer Trigger */}
      {user?.role === 'admin' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="glass-premium" 
          style={{ padding: '32px', marginBottom: 48, borderRadius: 24 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
             <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #f5a623, #f5d020)', color: '#1a0a00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, boxShadow: '0 8px 16px rgba(245,166,35,0.3)' }}>
               <FiUser />
             </div>
             <div 
               onClick={() => setShowPostModal(true)}
               style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 28, padding: '16px 24px', color: 'rgba(255,255,255,0.4)', fontSize: 17, cursor: 'text', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
               onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(245,166,35,0.3)'; }}
               onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
             >
               Broadcast a message to the Parivar...
             </div>
          </div>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '24px 0 20px 0' }}></div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40 }}>
            <motion.div whileHover={{ scale: 1.05 }} onClick={() => setShowPostModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'rgba(255,255,255,0.7)', fontSize: 15, cursor: 'pointer', padding: '12px 24px', borderRadius: 12, background: 'rgba(255,255,255,0.03)' }}>
              <FiImage style={{ color: '#51cf66', fontSize: 22 }} /> <span style={{ fontWeight: 500 }}>Photo</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} onClick={() => setShowPostModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'rgba(255,255,255,0.7)', fontSize: 15, cursor: 'pointer', padding: '12px 24px', borderRadius: 12, background: 'rgba(255,255,255,0.03)' }}>
              <FiVideo style={{ color: '#ff6b6b', fontSize: 22 }} /> <span style={{ fontWeight: 500 }}>Media Link</span>
            </motion.div>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="glass loading-shimmer" style={{ height: 300, borderRadius: 24 }}></div>
          ))}
        </div>
      ) : posts.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', flexDirection: 'column', gap: 40 }}
        >
          {posts.map((p, i) => (
            <motion.div 
              key={p._id} 
              variants={itemVariants} 
              className="glass-premium" 
              style={{ padding: 40, position: 'relative' }}
            >
              {user?.role === 'admin' && (
                <motion.button 
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,107,107,0.2)' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDeletePost(p._id)}
                  style={{ position: 'absolute', top: 32, right: 32, background: 'rgba(255,107,107,0.1)', border: 'none', color: '#ff6b6b', padding: 10, borderRadius: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Delete Announcement"
                >
                  <FiTrash2 size={20} />
                </motion.button>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #f5a623, #f5d020)', color: '#1a0a00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: '0 8px 20px rgba(245,166,35,0.2)' }}>
                  <FiUser />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#f5d020', fontSize: 18, letterSpacing: '0.5px' }}>{p.authorName}</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginTop: 4, fontWeight: 500 }}>
                    {new Date(p.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • {new Date(p.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>

              {p.text && <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18, lineHeight: 1.8, marginBottom: 32, whiteSpace: 'pre-wrap', fontWeight: 400 }}>{p.text}</p>}
              
              {p.image && (
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  style={{ marginBottom: 32, borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 12px 30px rgba(0,0,0,0.5)' }}
                >
                  <img src={p.image} alt="Announcement" style={{ width: '100%', maxHeight: 600, objectFit: 'contain', background: 'rgba(0,0,0,0.4)' }} />
                </motion.div>
              )}

              {p.videoUrl && (
                <div style={{ width: '100%', borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', marginBottom: 32, boxShadow: '0 12px 30px rgba(0,0,0,0.3)' }}>
                  {p.videoUrl.includes('youtube.com') || p.videoUrl.includes('youtu.be') ? (
                    <iframe 
                      width="100%" 
                      height="450" 
                      src={`https://www.youtube.com/embed/${p.videoUrl.split('v=')[1]?.split('&')[0] || p.videoUrl.split('/').pop()}`} 
                      title="YouTube video player" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div style={{ padding: 32, background: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
                      <a href={p.videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#f5a623', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, textDecoration: 'none', fontWeight: 600 }}>
                         🔗 Community Media Link: {p.videoUrl.substring(0, 40)}...
                      </a>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, color: 'rgba(255,255,255,0.4)', fontSize: 15, justifyContent: 'space-between', alignItems: 'center' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600, letterSpacing: '0.5px' }}>
                    <FiSend style={{ color: '#f5a623' }} /> OFFICIAL BROADCAST
                 </div>
                 
                 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                   <motion.button
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.9 }}
                     onClick={() => handleToggleLike(p._id)}
                     style={{ 
                       background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', outline: 'none', 
                       display: 'flex', alignItems: 'center', gap: 10, 
                       padding: '10px 24px', borderRadius: '30px',
                       color: (p.likes || []).includes(user?.id) ? '#ff4b4b' : 'rgba(255,255,255,0.6)',
                       transition: 'all 0.3s ease'
                     }}
                   >
                     <FiHeart fill={(p.likes || []).includes(user?.id) ? '#ff4b4b' : 'none'} style={{ fontSize: 22 }} />
                     <span style={{ fontWeight: 700, fontSize: 16 }}>{(p.likes || []).length}</span>
                   </motion.button>
                 </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-premium" style={{ padding: '80px 48px', textAlign: 'center' }}>
          <div style={{ fontSize: 80, marginBottom: 32, filter: 'grayscale(1) opacity(0.5)' }}>📭</div>
          <h3 style={{ color: '#f5a623', fontFamily: 'Cinzel, serif', fontSize: 28, marginBottom: 16 }}>The Feed is Empty</h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18, maxWidth: 500, margin: '0 auto' }}>No announcements have been broadcasted to the community yet. Please check back later.</p>
        </motion.div>
      )}

      {/* Post Composer Modal */}
      <AnimatePresence>
        {showPostModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(16px)' }}
            onClick={() => setShowPostModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 40, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 40, opacity: 0 }}
              className="glass-premium"
              style={{ width: '95%', maxWidth: 650, padding: 0, position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ padding: '32px 40px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: 24, color: '#fff', fontFamily: 'Cinzel, serif', fontWeight: 700 }} className="gold-text">New Broadcast</h3>
                <motion.button whileHover={{ rotate: 90 }} onClick={() => setShowPostModal(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', fontSize: 28, width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><FiX /></motion.button>
              </div>

              <div style={{ padding: 40 }}>
                <div style={{ display: 'flex', gap: 20, marginBottom: 32 }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #f5a623, #f5d020)', color: '#1a0a00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0, boxShadow: '0 8px 20px rgba(245,166,35,0.3)' }}>
                    <FiUser />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 20 }}>{user?.name}</div>
                    <span style={{ fontSize: 13, background: 'rgba(245,166,35,0.15)', color: '#f5a623', padding: '4px 14px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 8, fontWeight: 700, letterSpacing: '0.5px' }}>GLOBAL BROADCASTER</span>
                  </div>
                </div>

                <form onSubmit={handleCreatePost}>
                  <textarea
                    autoFocus
                    placeholder={`Compose your announcement, ${user?.name}...`}
                    value={post.text}
                    onChange={e => setPost({ ...post, text: e.target.value })}
                    style={{ width: '100%', minHeight: 200, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 22, resize: 'none', marginBottom: 32, lineHeight: 1.6 }}
                  />

                  <AnimatePresence>
                    {post.image && (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} style={{ position: 'relative', marginBottom: 32, borderRadius: 20, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
                        <img src={post.image} alt="Preview" style={{ width: '100%', maxHeight: 300, objectFit: 'cover' }} />
                        <button type="button" onClick={() => setPost({...post, image: ''})} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', borderRadius: '50%', padding: 10, cursor: 'pointer', backdropFilter: 'blur(4px)' }}><FiX size={20} /></button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div style={{ width: '100%', height: 60, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '0 20px', display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32, transition: 'border-color 0.3s' }}>
                    <FiVideo style={{ color: '#ff6b6b', fontSize: 24 }} />
                    <input type="text" placeholder="YouTube URL or Video Link..." value={post.videoUrl} onChange={e => setPost({ ...post, videoUrl: e.target.value })} style={{ background: 'transparent', border: 'none', color: '#fff', flex: 1, outline: 'none', fontSize: 17 }} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', border: '1px solid rgba(255,215,0,0.1)', borderRadius: 16, marginBottom: 40, background: 'rgba(245, 166, 35, 0.03)' }}>
                    <span style={{ fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.5px' }}>ADD TO YOUR BROADCAST</span>
                    <div style={{ display: 'flex', gap: 24 }}>
                      <motion.label whileHover={{ scale: 1.1 }} htmlFor="newsfeed-img" style={{ cursor: 'pointer' }} title="Attach Photo"><FiImage style={{ color: '#51cf66', fontSize: 32 }} /><input type="file" accept="image/*" onChange={handleImageUpload} id="newsfeed-img" hidden /></motion.label>
                    </div>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    disabled={posting || (!post.text && !post.image && !post.videoUrl)} 
                    style={{ width: '100%', padding: '18px', borderRadius: 16, border: 'none', background: (!post.text && !post.image && !post.videoUrl) ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #f5a623, #f5d020)', color: (!post.text && !post.image && !post.videoUrl) ? 'rgba(255,255,255,0.2)' : '#1a0a00', fontSize: 20, fontWeight: 800, cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
                  >
                    {posting ? 'Broadcasting...' : 'Broadcast to Parivar 🙏'}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
