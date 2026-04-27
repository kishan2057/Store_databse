const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  text: { type: String },
  image: { type: String }, // Base64 compressed image
  videoUrl: { type: String }, // Direct link or YouTube URL
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
