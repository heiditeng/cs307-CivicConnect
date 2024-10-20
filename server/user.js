const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  enableMFAEmail: { type: Boolean, default: false },
  enableMFAPhone: { type: Boolean, default: false },
  isOrganization: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', UserSchema);