const express = require('express');
const router = express.Router();

// mock data for community members -- will replace later with MongoDB
let communityMembers = [
    {
        username: 'aysuaysu',
        availability: 'Weekdays',
        location: '94101',
        occupation: 'Culinary',
        interests: 'Cooking',
        hobbies: 'Baking'
    }
];

// route to update availability & location for community members
router.post('/update-profile', (req, res) => {
    const { username, availability, location, occupation, interests, hobbies } = req.body;

    // validate request data
    if (!username || !availability || !location || !occupation || !interests || !hobbies) {
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
    member.occupation = occupation;
    member.interests = interests;
    member.hobbies = hobbies;

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

// route to add a new community member with default values
router.post('/add-member', (req, res) => {
    const { username } = req.body;
    console.log(username);

    // Add new member with other fields initialized to null
    const newMember = {
        username: username,
        availability: null,
        location: null,
        occupation: null,
        interests: null,
        hobbies: null
    };

    communityMembers.push(newMember);
    return res.status(201).json({ message: 'New member added successfully!', member: newMember });
});

module.exports = router;
