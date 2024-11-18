const express = require('express');
const router = express.Router();
const OrganizationProfile = require('./organizationProfile');

// Route to fetch organization profile by userId
router.get('/organization/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Find the organization profile by userId
        const organization = await OrganizationProfile.findOne({ userId });
        if (!organization) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        // Return the organization profile data
        res.status(200).json(organization);
    } catch (error) {
        console.error('Error fetching organization:', error);
        res.status(500).json({ error: 'An error occurred while fetching the organization.' });
    }
});

// Route to update organization profile
router.post('/update-organization', async (req, res) => {
    const { userId, bio } = req.body; // The body must contain userId and bio

    // Validate request data
    if (!userId || !bio) {
        return res.status(400).json({ error: 'User ID and bio are required' });
    }

    try {
        // Find the organization profile by userId and update it
        const updatedOrganization = await OrganizationProfile.findOneAndUpdate(
            { userId }, // Find by userId
            { bio }, // Update bio
            { new: true, runValidators: true } // Return updated profile and validate the data
        );

        if (!updatedOrganization) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        res.status(200).json({ message: 'Organization profile updated successfully!', organization: updatedOrganization });
    } catch (error) {
        console.error('Error updating organization:', error);
        res.status(500).json({ error: 'An error occurred while updating the organization profile.' });
    }
});

// Route to add a new organization profile (on signup or creation)
router.post('/add-organization', async (req, res) => {
    const { userId, bio } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        // Create a new organization profile with the provided data
        const newOrganization = new OrganizationProfile({
            userId,
            bio: null
        });

        await newOrganization.save();

        return res.status(201).json({ message: 'Organization profile added successfully!', organization: newOrganization });
    } catch (error) {
        console.error('Error adding new organization:', error);
        res.status(500).json({ error: 'An error occurred while adding the organization.' });
    }
});

module.exports = router;
