const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  postId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  caption: { type: String, required: false },
  location: { type: String, required: false },
  event: { type: String, required: false },
  timestamp: { type: Date, required: true },
  files: { type: [String], required: false } 
});

module.exports = mongoose.model('Post', postSchema);