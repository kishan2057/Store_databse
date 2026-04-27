const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// ─── REGISTER (Direct, No OTP) ────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, citizenshipNumber, phone, address, dob, photo, role } = req.body;

    if (!name || !email || !password || !citizenshipNumber) {
      return res.status(400).json({ message: 'Name, email, password and citizenship number are required' });
    }

    const existing = await User.findOne({ $or: [{ email }, { citizenshipNumber }] });
    if (existing) {
      return res.status(400).json({ message: 'Email or Citizenship Number already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name, email, password: hashedPassword,
      citizenshipNumber, phone, address, dob, photo, role: role || 'user'
    });
    await user.save();

    // Issue JWT immediately
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: err.message });
  }
});

// ─── LOGIN ────────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'No account found with this email' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
});

// ─── GET USER PROFILE ─────────────────────────────────────────────────────────
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
