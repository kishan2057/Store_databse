import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FiPlus, FiTrash2, FiChevronRight, FiChevronLeft, FiImage, FiBriefcase, FiHash, FiActivity, FiUser, FiCalendar, FiFlag, FiMapPin, FiHeart } from 'react-icons/fi';

const STEPS = ['Grandfather', 'Father', 'Mother', 'Spouse', 'Children', 'Siblings', 'General'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

export default function FamilyForm() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [grandfather, setGrandfather] = useState({ name: '', citizenshipNumber: '', bloodGroup: '', dob: '', occupation: '', image: '' });
  const [father, setFather] = useState({ name: '', citizenshipNumber: '', bloodGroup: '', dob: '', occupation: '', phone: '', image: '' });
  const [mother, setMother] = useState({ name: '', citizenshipNumber: '', bloodGroup: '', dob: '', occupation: '', phone: '', image: '' });
  const [spouse, setSpouse] = useState({ name: '', dob: '', citizenshipNumber: '', phone: '', image: '' });
  const [children, setChildren] = useState([]);
  const [siblings, setSiblings] = useState([]);
  const [general, setGeneral] = useState({ village: '', gotra: '', familyPhoto: '' });

  useEffect(() => {
    axios.get('/api/family', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (res.data) {
          const d = res.data;
          if (d.grandfather) setGrandfather({ name: d.grandfather.name || '', citizenshipNumber: d.grandfather.citizenshipNumber || '', bloodGroup: d.grandfather.bloodGroup || '', dob: d.grandfather.dob || '', occupation: d.grandfather.occupation || '', image: d.grandfather.image || '' });
          if (d.father) setFather({ name: d.father.name || '', citizenshipNumber: d.father.citizenshipNumber || '', bloodGroup: d.father.bloodGroup || '', dob: d.father.dob || '', occupation: d.father.occupation || '', phone: d.father.phone || '', image: d.father.image || '' });
          if (d.mother) setMother({ name: d.mother.name || '', citizenshipNumber: d.mother.citizenshipNumber || '', bloodGroup: d.mother.bloodGroup || '', dob: d.mother.dob || '', occupation: d.mother.occupation || '', phone: d.mother.phone || '', image: d.mother.image || '' });
          if (d.spouse) setSpouse({ name: d.spouse.name || '', dob: d.spouse.dob || '', citizenshipNumber: d.spouse.citizenshipNumber || '', phone: d.spouse.phone || '', image: d.spouse.image || '' });
          if (d.children?.length) setChildren(d.children.map(c => ({ name: c.name || '', dob: c.dob || '', gender: c.gender || '', image: c.image || '' })));
          if (d.siblings?.length) setSiblings(d.siblings.map(s => ({ name: s.name || '', dob: s.dob || '', gender: s.gender || '', citizenshipNumber: s.citizenshipNumber || '', image: s.image || '' })));
          setGeneral({ village: d.village || '', gotra: d.gotra || '', familyPhoto: d.familyPhoto || '' });
        }
      }).catch(() => {});
  }, [token]);

  const handleSubmit = async () => {
    if (!grandfather.name || !grandfather.citizenshipNumber || !grandfather.bloodGroup) {
      toast.error("Grandfather's name, citizenship and blood group are required");
      setStep(0); return;
    }
    if (!father.name || !father.citizenshipNumber || !father.bloodGroup) {
      toast.error("Father's name, citizenship and blood group are required");
      setStep(1); return;
    }
    if (!mother.name || !mother.citizenshipNumber || !mother.bloodGroup) {
      toast.error("Mother's name, citizenship and blood group are required");
      setStep(2); return;
    }

    setLoading(true);
    try {
      await axios.post('/api/family', { grandfather, father, mother, spouse, children, siblings, ...general }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Family details saved! 🙏');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const addChild = () => setChildren(prev => [...prev, { name: '', dob: '', gender: '', image: '' }]);
  const removeChild = (i) => setChildren(prev => prev.filter((_, idx) => idx !== i));
  const updateChild = (i, field, val) => setChildren(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: val } : c));

  const addSibling = () => setSiblings(prev => [...prev, { name: '', dob: '', gender: '', citizenshipNumber: '', image: '' }]);
  const removeSibling = (i) => setSiblings(prev => prev.filter((_, idx) => idx !== i));
  const updateSibling = (i, field, val) => setSiblings(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit">
            <h2 className="section-title" style={{ marginBottom: 32, fontSize: 24, fontWeight: 700 }}><FiUser /> Grandfather's Heritage</h2>
            <div className="grid-2">
              <Field label="Full Name *" value={grandfather.name} onChange={v => setGrandfather(p => ({ ...p, name: v }))} placeholder="The patriarch's name" icon={<FiUser />} />
              <Field label="Citizenship No. *" value={grandfather.citizenshipNumber} onChange={v => setGrandfather(p => ({ ...p, citizenshipNumber: v }))} placeholder="Verification ID" icon={<FiHash />} />
              <SelectField label="Blood Group *" value={grandfather.bloodGroup} onChange={v => setGrandfather(p => ({ ...p, bloodGroup: v }))} options={BLOOD_GROUPS} icon={<FiActivity />} />
              <Field label="Date of Birth" type="date" value={grandfather.dob} onChange={v => setGrandfather(p => ({ ...p, dob: v }))} icon={<FiCalendar />} />
              <Field label="Primary Occupation" value={grandfather.occupation} onChange={v => setGrandfather(p => ({ ...p, occupation: v }))} placeholder="e.g. Farmer" icon={<FiBriefcase />} />
              <ImageUploadField label="Historical Profile (Optional)" image={grandfather.image} onChange={v => setGrandfather(p => ({ ...p, image: v }))} />
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit">
            <h2 className="section-title" style={{ marginBottom: 32, fontSize: 24, fontWeight: 700 }}><FiUser /> Father's Details</h2>
            <div className="grid-2">
              <Field label="Full Name *" value={father.name} onChange={v => setFather(p => ({ ...p, name: v }))} placeholder="Full name" icon={<FiUser />} />
              <Field label="Citizenship No. *" value={father.citizenshipNumber} onChange={v => setFather(p => ({ ...p, citizenshipNumber: v }))} placeholder="Verification ID" icon={<FiHash />} />
              <SelectField label="Blood Group *" value={father.bloodGroup} onChange={v => setFather(p => ({ ...p, bloodGroup: v }))} options={BLOOD_GROUPS} icon={<FiActivity />} />
              <Field label="Date of Birth" type="date" value={father.dob} onChange={v => setFather(p => ({ ...p, dob: v }))} icon={<FiCalendar />} />
              <Field label="Occupation" value={father.occupation} onChange={v => setFather(p => ({ ...p, occupation: v }))} placeholder="e.g. Service" icon={<FiBriefcase />} />
              <Field label="Contact Number" value={father.phone} onChange={v => setFather(p => ({ ...p, phone: v }))} placeholder="98XXXXXXXX" icon={<FiFlag />} />
              <ImageUploadField label="Profile Picture" image={father.image} onChange={v => setFather(p => ({ ...p, image: v }))} />
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit">
            <h2 className="section-title" style={{ marginBottom: 32, fontSize: 24, fontWeight: 700 }}><FiUser /> Mother's Details</h2>
            <div className="grid-2">
              <Field label="Full Name *" value={mother.name} onChange={v => setMother(p => ({ ...p, name: v }))} placeholder="Full name" icon={<FiUser />} />
              <Field label="Citizenship No. *" value={mother.citizenshipNumber} onChange={v => setMother(p => ({ ...p, citizenshipNumber: v }))} placeholder="Verification ID" icon={<FiHash />} />
              <SelectField label="Blood Group *" value={mother.bloodGroup} onChange={v => setMother(p => ({ ...p, bloodGroup: v }))} options={BLOOD_GROUPS} icon={<FiActivity />} />
              <Field label="Date of Birth" type="date" value={mother.dob} onChange={v => setMother(p => ({ ...p, dob: v }))} icon={<FiCalendar />} />
              <Field label="Occupation" value={mother.occupation} onChange={v => setMother(p => ({ ...p, occupation: v }))} placeholder="e.g. Homemaker" icon={<FiBriefcase />} />
              <Field label="Contact Number" value={mother.phone} onChange={v => setMother(p => ({ ...p, phone: v }))} placeholder="98XXXXXXXX" icon={<FiFlag />} />
              <ImageUploadField label="Profile Picture" image={mother.image} onChange={v => setMother(p => ({ ...p, image: v }))} />
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit">
            <h2 className="section-title" style={{ marginBottom: 32, fontSize: 24, fontWeight: 700 }}><FiHeart /> Spouse's Details</h2>
            <div className="grid-2">
              <Field label="Full Name" value={spouse.name} onChange={v => setSpouse(p => ({ ...p, name: v }))} placeholder="Spouse's name" icon={<FiUser />} />
              <Field label="Citizenship ID" value={spouse.citizenshipNumber} onChange={v => setSpouse(p => ({ ...p, citizenshipNumber: v }))} placeholder="Verification ID" icon={<FiHash />} />
              <Field label="Date of Birth" type="date" value={spouse.dob} onChange={v => setSpouse(p => ({ ...p, dob: v }))} icon={<FiCalendar />} />
              <Field label="Contact Number" value={spouse.phone} onChange={v => setSpouse(p => ({ ...p, phone: v }))} placeholder="98XXXXXXXX" icon={<FiFlag />} />
              <ImageUploadField label="Profile Picture" image={spouse.image} onChange={v => setSpouse(p => ({ ...p, image: v }))} />
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit">
            <h2 className="section-title" style={{ marginBottom: 32, fontSize: 24, fontWeight: 700 }}>Next Generation (Children)</h2>
            <div style={{ display: 'grid', gap: 24 }}>
              {children.map((child, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  className="glass-premium" 
                  style={{ padding: '32px', position: 'relative', border: '1px solid rgba(255,215,0,0.1)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <span style={{ color: '#f5a623', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Child Information #{i + 1}</span>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} type="button" onClick={() => removeChild(i)} style={{ background: 'rgba(255,107,107,0.1)', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: 8, borderRadius: '50%' }}><FiTrash2 /></motion.button>
                  </div>
                  <div className="grid-2">
                    <Field label="Child's Name" value={child.name} onChange={v => updateChild(i, 'name', v)} placeholder="Full name" icon={<FiUser />} />
                    <Field label="Date of Birth" type="date" value={child.dob} onChange={v => updateChild(i, 'dob', v)} icon={<FiCalendar />} />
                    <SelectField label="Gender" value={child.gender} onChange={v => updateChild(i, 'gender', v)} options={['Male', 'Female', 'Other']} icon={<FiActivity />} />
                    <ImageUploadField label="Current Photo" image={child.image} onChange={v => updateChild(i, 'image', v)} />
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              type="button" 
              onClick={addChild} 
              className="btn-outline" 
              style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, padding: '14px 28px', marginTop: 32, width: '100%', justifyContent: 'center' }}
            >
              <FiPlus /> Add Child to Lineage
            </motion.button>
          </motion.div>
        );

      case 5:
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit">
            <h2 className="section-title" style={{ marginBottom: 32, fontSize: 24, fontWeight: 700 }}>Siblings & Relations</h2>
            <div style={{ display: 'grid', gap: 24 }}>
              {siblings.map((sib, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  className="glass-premium" 
                  style={{ padding: '32px', position: 'relative', border: '1px solid rgba(255,215,0,0.1)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <span style={{ color: '#f5a623', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Sibling Information #{i + 1}</span>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} type="button" onClick={() => removeSibling(i)} style={{ background: 'rgba(255,107,107,0.1)', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: 8, borderRadius: '50%' }}><FiTrash2 /></motion.button>
                  </div>
                  <div className="grid-2">
                    <Field label="Sibling's Name" value={sib.name} onChange={v => updateSibling(i, 'name', v)} placeholder="Full name" icon={<FiUser />} />
                    <Field label="Citizenship No." value={sib.citizenshipNumber} onChange={v => updateSibling(i, 'citizenshipNumber', v)} placeholder="Verification ID" icon={<FiHash />} />
                    <Field label="Date of Birth" type="date" value={sib.dob} onChange={v => updateSibling(i, 'dob', v)} icon={<FiCalendar />} />
                    <SelectField label="Gender" value={sib.gender} onChange={v => updateSibling(i, 'gender', v)} options={['Male', 'Female', 'Other']} icon={<FiActivity />} />
                    <ImageUploadField label="Profile Picture" image={sib.image} onChange={v => updateSibling(i, 'image', v)} />
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              type="button" 
              onClick={addSibling} 
              className="btn-outline" 
              style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, padding: '14px 28px', marginTop: 32, width: '100%', justifyContent: 'center' }}
            >
              <FiPlus /> Add Sibling to Lineage
            </motion.button>
          </motion.div>
        );

      case 6:
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit">
            <h2 className="section-title" style={{ marginBottom: 32, fontSize: 24, fontWeight: 700 }}><FiMapPin /> Family Heritage & Roots</h2>
            <div className="grid-2">
              <Field label="Village / Cultural Town" value={general.village} onChange={v => setGeneral(p => ({ ...p, village: v }))} placeholder="Your ancestral roots" icon={<FiMapPin />} />
              <Field label="Family Gotra" value={general.gotra} onChange={v => setGeneral(p => ({ ...p, gotra: v }))} placeholder="e.g. Kashyap, Garg" icon={<FiFlag />} />
              <ImageUploadField label="Grand Family Portrait (Optional)" image={general.familyPhoto} onChange={v => setGeneral(p => ({ ...p, familyPhoto: v }))} />
            </div>
            <div style={{ marginTop: 32, padding: '20px', background: 'rgba(245,166,35,0.05)', borderRadius: '16px', border: '1px solid rgba(245,166,35,0.1)' }}>
               <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: 0, lineHeight: 1.6 }}>🙏 By saving these details, you are preserving your family's digital heritage for generations to come. All data is encrypted and secure.</p>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '120px 20px 80px', maxWidth: 840, margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(28px, 5vw, 48px)', marginBottom: 12, fontWeight: 800 }} className="gold-text">
          Preserve My Lineage
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 48, fontSize: 16 }}>Complete your ancestral records to build your interactive Family Tree</p>
      </motion.div>

      {/* Step Indicator */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 48, flexWrap: 'wrap', justifyContent: 'center' }}>
        {STEPS.map((s, i) => (
          <motion.button
            key={i}
            type="button"
            onClick={() => setStep(i)}
            whileHover={{ scale: 1.05 }}
            style={{
              padding: '10px 20px',
              borderRadius: 30,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 700,
              fontFamily: 'Poppins, sans-serif',
              background: i === step ? 'linear-gradient(135deg, #f5d020, #f5a623)' : 'rgba(255,255,255,0.05)',
              color: i === step ? '#1a0a00' : i < step ? '#f5a623' : 'rgba(255,255,255,0.4)',
              border: i < step ? '1px solid rgba(245,166,35,0.3)' : '1px solid transparent',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: i === step ? '0 10px 20px rgba(245,166,35,0.3)' : 'none'
            }}
          >
            {i < step ? '✓ ' : ''}{s}
          </motion.button>
        ))}
      </div>

      {/* Form Card */}
      <motion.div className="glass-premium" style={{ padding: '48px' }}>
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '40px 0' }}></div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className="btn-outline"
            style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: step === 0 ? 0.3 : 1, padding: '14px 28px' }}
          >
            <FiChevronLeft size={20} /> Back
          </motion.button>

          {step < STEPS.length - 1 ? (
            <motion.button 
              whileHover={{ x: 2, scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              type="button" 
              onClick={() => setStep(s => s + 1)} 
              className="btn-gold" 
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 32px' }}
            >
              Continue <FiChevronRight size={20} />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 10px 30px rgba(245,166,35,0.4)' }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={handleSubmit}
              className="btn-gold"
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1, fontSize: 17, padding: '14px 40px', fontWeight: 800 }}
            >
              {loading ? 'Securing Data...' : 'Finalize & Save Legacy 🙏'}
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text', icon }) {
  return (
    <div className="form-group" style={{ marginBottom: 24 }}>
      <label style={{ color: 'rgba(245, 166, 35, 0.8)', fontSize: 14, fontWeight: 600, marginBottom: 10, display: 'block' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        {icon && <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(245,166,35,0.6)', fontSize: 18 }}>{icon}</div>}
        <input
          type={type}
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ paddingLeft: icon ? 48 : 20, height: 50, borderRadius: 12, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,215,0,0.1)', fontSize: 15 }}
        />
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange, options, icon }) {
  return (
    <div className="form-group" style={{ marginBottom: 24 }}>
      <label style={{ color: 'rgba(245, 166, 35, 0.8)', fontSize: 14, fontWeight: 600, marginBottom: 10, display: 'block' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        {icon && <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(245,166,35,0.6)', fontSize: 18 }}>{icon}</div>}
        <select 
          value={value ?? ''} 
          onChange={e => onChange(e.target.value)}
          style={{ width: '100%', height: 50, borderRadius: 12, border: '1px solid rgba(255,215,0,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', paddingLeft: icon ? 48 : 20, appearance: 'none', fontSize: 15 }}
        >
          <option value="" style={{ background: '#1c1c1c' }}>Select Option</option>
          {options.map((opt, i) => <option key={i} value={opt} style={{ background: '#1c1c1c' }}>{opt}</option>)}
        </select>
        <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'rgba(245,166,35,0.6)', fontSize: 12 }}>▼</div>
      </div>
    </div>
  );
}

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
    <div className="form-group" style={{ marginBottom: 24 }}>
      <label style={{ color: 'rgba(245, 166, 35, 0.8)', fontSize: 14, fontWeight: 600, marginBottom: 10, display: 'block' }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,215,0,0.1)' }}>
        {image ? (
          <div style={{ position: 'relative', width: 64, height: 64 }}>
            <img src={image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px', border: '2px solid rgba(245,166,35,0.4)' }} />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onChange('')}
              style={{ position: 'absolute', top: -10, right: -10, background: '#ff6b6b', color: '#fff', border: 'none', borderRadius: '50%', width: 24, height: 24, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
            >×</motion.button>
          </div>
        ) : (
          <div style={{ width: 64, height: 64, borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(245,166,35,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(245,166,35,0.4)', fontSize: 28 }}>
            <FiImage />
          </div>
        )}
        <div style={{ flex: 1 }}>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFile}
            style={{ padding: 0, height: 'auto', border: 'none', background: 'none', fontSize: 13 }}
          />
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 6, margin: 0 }}>Compressed automatically, max 10MB</p>
        </div>
      </div>
    </div>
  );
}

