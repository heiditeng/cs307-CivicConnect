const express = require('express');
const Notification = require('./notification');
const router = express.Router();

// endpoint to get notification history for a specific user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // find notifications for the user, sorted by the most recent first
    const notifications = await Notification.find({ userId })
      .sort({ timestamp: -1 })
      .populate('eventId', 'name'); // Populate event details if needed

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Error fetching notifications' });
  }
});

module.exports = router;
