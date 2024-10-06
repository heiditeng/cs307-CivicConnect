const express = require('express');
const router = express.Router();

// mock data for community members -- will replace later with mongDB 
let communityMembers = [
    {
        username: 'aysu',
        availability: 'Weekdays, 9 AM - 5 PM',
        location: 'San Diego, CA'
    },
    {
        username: 'heidi',
        availability: 'Weekends',
        location: 'Los Angeles, CA'
    }
];

// route to update availability & location for community members
router.post('/update-profile', (req, res) => {
    const { username, availability, location } = req.body;

    // validate request data
    if (!username || !availability || !location) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // find the user by username, alert if not found
    const member = communityMembers.find(member => member.username === username);
    if (!member) {
        return res.status(404).json({ error: 'User not found' });
    }

    // update the user's availability and location
    member.availability = availability;
    member.location = location;

    return res.status(200).json({ message: 'Profile updated successfully!' });
});

// route to fetch community member profile data
router.get('/profile/:username', (req, res) => {
    const { username } = req.params;

    // find the user by username in communityMembers array
    const member = communityMembers.find(member => member.username === username);
    if (!member) {
        return res.status(404).json({ error: 'Community member not found' });
    }

    // return the member data
    res.json(member);
});

module.exports = router;
