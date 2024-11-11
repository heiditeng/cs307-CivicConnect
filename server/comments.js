const mongoose = require('mongoose');

// Define the Reply schema
const ReplySchema = new mongoose.Schema({
  user: { type: String, required: true }, // Username of the user who replied
  text: { type: String, required: true }, // Text of the reply
  timestamp: { type: Date, default: Date.now }, // When the reply was created
});

// Define the Comment schema
const CommentSchema = new mongoose.Schema({
  postId: { type: String, ref: 'Post', required: true }, // ID of the associated post
  text: { type: String, required: true }, // The comment text
  user: { type: String, required: true }, // Username of the commenter
  likeCount: { type: Number, default: 0 }, // Number of likes on the comment
  likes: { type: [String], default: [] }, // Array of usernames who liked the comment
  replies: { type: [ReplySchema], default: [] }, // Array of replies with each reply's user and text
  timestamp: { type: Date, default: Date.now }, // When the comment was created
});

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;
