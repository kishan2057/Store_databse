const express = require('express');
const router = express.Router();
const FamilyMember = require('../models/FamilyMember');
const authMiddleware = require('../middleware/auth');

// Save or update family details
router.post('/', authMiddleware, async (req, res) => {
  try {
    const existing = await FamilyMember.findOne({ userId: req.user.id });
    if (existing) {
      const updated = await FamilyMember.findOneAndUpdate(
        { userId: req.user.id },
        { ...req.body, userId: req.user.id },
        { new: true }
      );
      return res.json(updated);
    }
    const family = new FamilyMember({ ...req.body, userId: req.user.id });
    await family.save();
    res.status(201).json(family);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get family details
router.get('/', authMiddleware, async (req, res) => {
  try {
    const family = await FamilyMember.findOne({ userId: req.user.id });
    
    res.json(family);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
