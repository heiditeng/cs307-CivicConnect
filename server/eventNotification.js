const mongoose = require('mongoose');

const EventNotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  eventName: { type: String, required: true },
  message: { type: String, required: true }, 
  seen: {type:Boolean, default: false},
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('eventNotification', EventNotificationSchema);