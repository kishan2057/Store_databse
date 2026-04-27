const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// ─── GET ALL POSTS (All Authenticated Users) ──────────────────────────────────
router.get('/', authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // Newest first
    res.json(posts);
  } catch (err) {
    console.error('Fetch posts error:', err);
    res.status(500).json({ message: err.message });
  }
});

// ─── CREATE POST (Admin Only) ──────────────────────────────────────────────────
router.post('/', authMiddleware, adminAuth, async (req, res) => {
  try {
    const { text, image, videoUrl } = req.body;
    
    if (!text && !image && !videoUrl) {
      return res.status(400).json({ message: 'Post must contain at least text, an image, or a video URL' });
    }

    const post = new Post({
      text,
      image,
      videoUrl,
      authorId: req.user.id,
      authorName: req.adminUser ? req.adminUser.name : 'System Admin'
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ message: err.message });
  }
});

// ─── DELETE POST (Admin Only) ──────────────────────────────────────────────────
router.delete('/:id', authMiddleware, adminAuth, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Delete post error:', err);
    res.status(500).json({ message: err.message });
  }
});

// ─── TOGGLE LIKE (All Authenticated Users) ──────────────────────────────────
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user.id;
    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex === -1) {
      // User hasn't liked the post yet -> Add like
      post.likes.push(userId);
    } else {
      // User already liked -> Remove like
      post.likes.splice(likeIndex, 1);
    }

    await post.save();
    res.json({ likes: post.likes });
  } catch (err) {
    console.error('Like toggle error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
