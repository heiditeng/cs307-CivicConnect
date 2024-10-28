const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  postId: {type: String, required: true},  
  username: {type: String, required: true},  
  commentText: {type: String, required: true}, 
  timestamp: {type: Date, default: Date.now},  
  likeCount: {type: Number, default: 0},  
  likes: [String]  
});

module.exports = mongoose.model('Comments', commentSchema);