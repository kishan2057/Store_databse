const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    // req.user is set by the authMiddleware before this
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    // Attach full user object if needed in admin routes
    req.adminUser = user;
    next();
  } catch (err) {
    console.error('Admin middleware error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};
