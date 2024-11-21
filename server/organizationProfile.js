const mongoose = require('mongoose');

// Define the subscriber subdocument schema
const SubscriberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }
});

// Organization Profile model schema
const OrganizationProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  username: { type: String, required: true },
  bio: { type: String, default: null },
  subscribers: [SubscriberSchema],  // Store the subscriber's name and email directly
});

module.exports = mongoose.model('OrganizationProfile', OrganizationProfileSchema);
