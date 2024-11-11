const mongoose = require('mongoose');

// Organization Profile model schema
const OrganizationProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio: { type: String, default: null }
});

module.exports = mongoose.model('OrganizationProfile', OrganizationProfileSchema);