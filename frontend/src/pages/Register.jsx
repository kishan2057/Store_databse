import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import nepal from 'info-nepal';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiCreditCard, FiEye, FiEyeOff, FiImage, FiCalendar } from 'react-icons/fi';

const containerVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.8, 
      ease: [0.33, 1, 0.68, 1],
      staggerChildren: 0.05,
      delayChildren: 0.1
    } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

function Field({ icon: Icon, label, name, type = 'text', placeholder, required = false, value, onChange, showPass, onTogglePass }) {
  return (
    <motion.div variants={itemVariants} className="form-group">
      <label style={{ fontSize: 13, marginBottom: 8, display: 'block', color: 'rgba(245, 166, 35, 0.8)' }}>{label}{required && <span style={{ color: '#f5a623' }}> *</span>}</label>
      <div style={{ position: 'relative' }}>
        <Icon style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(245,166,35,0.6)', fontSize: 18 }} />
        {name === 'password' ? (
          <>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              style={{ paddingLeft: 48, paddingRight: 48, fontSize: 14 }}
              required={required}
            />
            <button
              type="button"
              onClick={onTogglePass}
              style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(245,166,35,0.6)', cursor: 'pointer', fontSize: 18 }}
            >
              {showPass ? <FiEyeOff /> : <FiEye />}
            </button>
          </>
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            style={{ paddingLeft: 48, fontSize: 14 }}
            required={required}
          />
        )}
      </div>
    </motion.div>
  );
}

function SelectField({ icon: Icon, label, name, required = false, value, onChange, options, placeholder }) {
  return (
    <motion.div variants={itemVariants} className="form-group" style={{ marginBottom: 20 }}>
      <label style={{ fontSize: 13, marginBottom: 8, display: 'block', color: 'rgba(245, 166, 35, 0.8)' }}>{label}{required && <span style={{ color: '#f5a623' }}> *</span>}</label>
      <div style={{ position: 'relative' }}>
        <Icon style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(245,166,35,0.6)', fontSize: 18 }} />
        <select
          name={name}
          value={value}
          onChange={onChange}
          style={{ paddingLeft: 48, width: '100%', paddingRight: 16, height: 50, borderRadius: 12, border: '1px solid rgba(255,215,0,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', appearance: 'none', fontSize: 14 }}
          required={required}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt, i) => (
            <option key={i} value={opt.value || opt} style={{ background: '#1c1c1c', color: '#fff' }}>
              {opt.label || opt}
            </option>
          ))}
        </select>
        <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'rgba(245,166,35,0.6)', fontSize: 12 }}>
          ▼
        </div>
      </div>
    </motion.div>
  );
}

const PROVINCES = [
  { value: '1', label: 'Koshi (Province 1)' },
  { value: '2', label: 'Madhesh (Province 2)' },
  { value: '3', label: 'Bagmati (Province 3)' },
  { value: '4', label: 'Gandaki (Province 4)' },
  { value: '5', label: 'Lumbini (Province 5)' },
  { value: '6', label: 'Karnali (Province 6)' },
  { value: '7', label: 'Sudurpashchim (Province 7)' }
];

function ImageUploadField({ label, image, onChange }) {
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image is too large! Please upload under 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const MAX_DIM = 800; // max width or height

        if (width > height) {
          if (width > MAX_DIM) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        onChange(compressedBase64);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.div variants={itemVariants} className="form-group" style={{ marginBottom: 20 }}>
      <label style={{ fontSize: 13, marginBottom: 8, display: 'block', color: 'rgba(245, 166, 35, 0.8)' }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,215,0,0.1)' }}>
        {image ? (
          <div style={{ position: 'relative', width: 56, height: 56 }}>
            <img src={image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px', border: '2px solid rgba(245,166,35,0.4)' }} />
            <button
              type="button"
              onClick={() => onChange('')}
              style={{ position: 'absolute', top: -8, right: -8, background: '#ff6b6b', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
            >×</button>
          </div>
        ) : (
          <div style={{ width: 56, height: 56, borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,215,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(245,166,35,0.4)', fontSize: 24 }}>
            <FiImage />
          </div>
        )}
        <div style={{ flex: 1 }}>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFile}
            style={{ padding: '0', height: 'auto', background: 'none', border: 'none', fontSize: 12 }}
          />
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 4 }}>JPG/PNG, max 10MB</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', citizenshipNumber: '', phone: '', province: '', district: '', municipality: '', wardOrVillage: '', role: 'user', dob: '', photo: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm(prev => {
      const newForm = { ...prev, [field]: value };
      if (field === 'province') {
        newForm.district = '';
        newForm.municipality = '';
      }
      if (field === 'district') {
        newForm.municipality = '';
      }
      return newForm;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const provName = PROVINCES.find(p => p.value === form.province)?.label || '';
      const addressParts = [form.wardOrVillage, form.municipality, form.district, provName].filter(Boolean);
      const submitData = {
        ...form,
        address: addressParts.join(', ')
      };
      
      const { data } = await axios.post('/api/auth/register', submitData);

      login(data.user, data.token);
      toast.success('Account created! Welcome 🙏');

      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
      
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 20px 80px', position: 'relative', zIndex: 1 }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="glass-premium"
        style={{ width: '100%', maxWidth: 540, padding: '56px 48px' }}
      >
        <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: 40 }}>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            style={{ fontSize: 64, marginBottom: 16, display: 'inline-block' }}
            className="om-symbol"
          >ॐ</motion.div>
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 32, fontWeight: 700, letterSpacing: '1px' }} className="gold-text">Join Yadav Parivar</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginTop: 10 }}>Create your account to connect with your heritage</p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <SelectField 
            icon={FiUser} 
            label="Account Type / Role" 
            name="role" 
            options={[
              { value: 'user', label: 'Standard User' },
              { value: 'admin', label: 'Administrator' }
            ]} 
            value={form.role} 
            onChange={handleChange('role')} 
            placeholder="Select Account Type" 
            required 
          />
          
          <div className="grid-2">
            <Field icon={FiUser} label="Full Name" name="name" placeholder="Your full name" required value={form.name} onChange={handleChange('name')} />
            <Field icon={FiMail} label="Email Address" name="email" type="email" placeholder="your@email.com" required value={form.email} onChange={handleChange('email')} />
          </div>
          
          <div className="grid-2">
            <Field icon={FiLock} label="Password" name="password" placeholder="Create password" required value={form.password} onChange={handleChange('password')} showPass={showPass} onTogglePass={() => setShowPass(p => !p)} />
            <Field icon={FiCreditCard} label="Citizenship No." name="citizenshipNumber" placeholder="Citizenship number" required value={form.citizenshipNumber} onChange={handleChange('citizenshipNumber')} />
          </div>

          <div className="grid-2">
            <Field icon={FiPhone} label="Phone Number" name="phone" placeholder="98XXXXXXXX" value={form.phone} onChange={handleChange('phone')} />
            <Field icon={FiCalendar} label="Date of Birth" name="dob" type="date" value={form.dob} onChange={handleChange('dob')} />
          </div>
          
          <ImageUploadField 
            label="Profile Photo (Optional)" 
            image={form.photo} 
            onChange={(img) => setForm(p => ({ ...p, photo: img }))} 
          />

          <motion.h3 variants={itemVariants} className="section-title" style={{ marginTop: 20, fontSize: 16 }}>Location Details</motion.h3>

          <div className="grid-2">
            <SelectField 
              icon={FiMapPin} 
              label="Province" 
              name="province" 
              options={PROVINCES} 
              value={form.province} 
              onChange={handleChange('province')} 
              placeholder="Select Province" 
              required 
            />

            <AnimatePresence>
              {form.province && (
                <SelectField 
                  icon={FiMapPin} 
                  label="District" 
                  name="district" 
                  options={nepal.districtsOfProvince[form.province] || []} 
                  value={form.district} 
                  onChange={handleChange('district')} 
                  placeholder="Select District" 
                  required 
                />
              )}
            </AnimatePresence>
          </div>

          <div className="grid-2">
            <AnimatePresence>
              {form.district && (
                <SelectField 
                  icon={FiMapPin} 
                  label="Municipality" 
                  name="municipality" 
                  options={nepal.localBodies[form.district] || []} 
                  value={form.municipality} 
                  onChange={handleChange('municipality')} 
                  placeholder="Select Municipality" 
                  required 
                />
              )}
            </AnimatePresence>

            <Field 
              icon={FiMapPin} 
              label="Ward / Village"      
              name="wardOrVillage"           
              placeholder="Ward, Village/Tole"          
              value={form.wardOrVillage}           
              onChange={handleChange('wardOrVillage')} 
            />
          </div>

          <motion.div variants={itemVariants} style={{ marginTop: 20 }}>
            <motion.button
              type="submit"
              className="btn-gold"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              style={{ width: '100%', fontSize: 17, padding: '15px', opacity: loading ? 0.7 : 1, fontWeight: 700 }}
            >
              {loading ? 'Creating Account...' : 'Create Account & Login 🙏'}
            </motion.button>
          </motion.div>
        </form>

        <motion.p variants={itemVariants} style={{ textAlign: 'center', marginTop: 32, color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#f5a623', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid currentColor', paddingBottom: 2 }}>Login here</Link>
        </motion.p>
      </motion.div>
    </div>
  );
}

