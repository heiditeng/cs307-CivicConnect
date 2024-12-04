const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true },
  filename: { type: String, required: true },
});

const postSchema = new mongoose.Schema({
  postId: {type: String, required: true, unique: true},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  caption: {type: String, required: false},
  location: {type: String, required: false},
  event: {type: String, required: false},
  timestamp: {type: Date, required: true},
  likeCount: { type: Number, default: 0},
  likes: {type: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, default: []},
  files: {type: [FileSchema], default: []} 
});

module.exports = mongoose.model('Post', postSchema);