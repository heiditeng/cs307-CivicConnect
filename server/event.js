const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  address: { type: String, required: true },
  zipcode: { type: Number, required: true },
  maxCapacity: { type: Number, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  image: [{ type: String }],
  thumbnailImage: { type: String },
  video: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  rsvpUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  bookmarkUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  userRatings: [{username: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    rating: { type: Number, required: true, min: 1, max: 5 },
    feedback: { type: String }}],
  isRecurring: { type: Boolean, default: false }, 
  recurrenceInterval: { 
    type: String, 
    enum: ['daily', 'weekly', 'biweekly', 'monthly', 'annually'], 
    required: function () { return this.isRecurring; } //only required if event is recurring
  },
  recurrenceRule: { type: String }, //recurrence rule to implement recurrence
});

module.exports = mongoose.model('Event', EventSchema);

