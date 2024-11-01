const express = require('express');
const router = express.Router();
const UserProfile = require('./userprofile'); 

router.post('/update-profile', async (req, res) => {
    const { userId, availability, location, occupation, interests, hobbies } = req.body;

    // Validate request data
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
        // Find the user's profile by userId and update the information
        const updatedProfile = await UserProfile.findOneAndUpdate(
            { userId },
            { 
                availability, 
                location, 
                occupation, 
                interests, 
                hobbies 
            },
            { new: true, runValidators: true } // Return the updated document and run validation checks
        );

        if (!updatedProfile) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'Profile updated successfully!', profile: updatedProfile });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'An error occurred while updating the profile.' });
    }
});
// route to fetch community member profile data by userId
router.get('/profile/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // find the user's profile by userId
        const member = await UserProfile.findOne({ userId });
        if (!member) {
            return res.status(404).json({ error: 'Community member not found' });
        }

        // return the member data
        res.status(200).json(member);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'An error occurred while fetching the profile.' });
    }
});

// route to add a new community member with default values (This should happen on user signup)
router.post('/add-member', async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
        // Add new member with other fields initialized to null
        const newMember = new UserProfile({
            userId,
            availability: null,
            location: null,
            occupation: null,
            interests: null,
            hobbies: null
        });

        await newMember.save();

        return res.status(201).json({ message: 'New member profile added successfully!', member: newMember });
    } catch (error) {
        console.error('Error adding new member:', error);
        res.status(500).json({ error: 'An error occurred while adding the member.' });
    }
});

module.exports = router;
