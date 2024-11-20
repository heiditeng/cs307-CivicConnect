const mongoose = require("mongoose");

const CapacityNotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // recipient!!! important
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  }, 
  message: { type: String, required: true },
  seen: { type: Boolean, default: false }, 
  createdAt: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model(
  "CapacityNotification",
  CapacityNotificationSchema
);
