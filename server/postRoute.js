const express = require('express');
const router = express.Router();

// In-memory storage for posts (testing)
let posts = [
  {
    id: 1,
    files: ['https://images.unsplash.com/flagged/photo-1551373916-bdaddbf4f881?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9ja3xlbnwwfHwwfHx8MA%3D%3D'],  // Mocked image URL
    caption: 'event experience desc',
    location: '120 Grant Street',
    event: 'Volunteering',
    reactions: 0,
  }
];

// Route to fetch all posts for "My Posts" page
router.get('/myposts', (req, res) => {
  console.log('Sending posts data to frontend:', posts);  // To verify it's being called
  res.json(posts);  // Send the posts data as JSON
});

// Additional routes for creating posts, handling reactions, etc.
module.exports = router;
