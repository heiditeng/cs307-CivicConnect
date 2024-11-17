const mongoose = require('mongoose');

// user model class
// includes the information that will be stored in the db about each user
// used keys of required (needs to be included or throw error), default (optional), 
// and unique (meaning that only one of each)
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  enableMFAEmail: { type: Boolean, default: false },
  enableMFAPhone: { type: Boolean, default: false },
  isOrganization: { type: Boolean, default: false },
  rsvpEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  userProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile' }, // Reference to UserProfile
  organizationProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'OrganizationProfile', default: null },
});

module.exports = mongoose.model('User', UserSchema);
