const mongoose = require('mongoose');

// User Profile model schema
const UserProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  availability: { type: String, default: null },
  location: { type: String, default: null },
  occupation: { type: String, default: null },
  interests: { type: String, default: null },
  hobbies: { type: String, default: null },
  subscriptions: { type: [String], default: [] }
});

module.exports = mongoose.model('UserProfile', UserProfileSchema);