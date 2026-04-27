const express = require('express');
const router = express.Router();
const User = require('../models/User');
const FamilyMember = require('../models/FamilyMember');
const authMiddleware = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Apply both middlewares to all routes in this file
router.use(authMiddleware, adminAuth);

// ─── SEARCH USERS ─────────────────────────────────────────────────────────────
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchQuery = {
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { citizenshipNumber: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } }
      ]
    };

    const users = await User.find(searchQuery).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('Search users error:', err);
    res.status(500).json({ message: err.message });
  }
});

// ─── GET ALL USERS ────────────────────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    // Return all users except password field
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('Fetch users error:', err);
    res.status(500).json({ message: err.message });
  }
});

// ─── EDIT USER ────────────────────────────────────────────────────────────────
router.put('/users/:id', async (req, res) => {
  try {
    const { name, phone, address, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone, address, role },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ message: err.message });
  }
});

// ─── DELETE USER ──────────────────────────────────────────────────────────────
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Prevent admin from deleting themselves
    if (userId === req.user.id) {
      return res.status(400).json({ message: 'Admin cannot delete their own account' });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Also delete any family data associated with this user
    await FamilyMember.findOneAndDelete({ userId });

    res.json({ message: 'User and associated family data deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
