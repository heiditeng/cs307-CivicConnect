const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  eventName: { type: String, required: true },
  changes: { type: String, required: true }, 
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);