const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  files: [String], // File URLs or paths
  caption: { type: String, required: true },
  location: { type: String, required: true },
  event: { type: String, required: true },
  reactions: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);