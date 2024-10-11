const express = require('express');
const router = express.Router();


// mock data for organizations — to be replaced with a database later
let organizations = [
    {
        name: 'Community Helpers',
        bio: 'A non-profit organization focused on helping the local community.',
        socials: {
            facebook: 'https://facebook.com/communityhelpers',
            twitter: 'https://twitter.com/communityhelpers'
        },
        events: [
            { title: 'Food Drive', date: '2024-12-01' },
            { title: 'Beach Cleanup', date: '2024-11-15' }
        ]
    }
];

// fetching org info
router.get('/organization/:name', (req, res) => {
    const { name } = req.params;

    // finding org by name
    const organization = organizations.find(org => org.name === name);
    if (!organization) {
        return res.status(404).json({ error: 'Organization not found' });
    }

    res.json(organization);
});

// updating orf
router.post('/update-organization', (req, res) => {
    const { name, bio, socials, events } = req.body;

    // valid request data?
    if (!name || !bio || !socials || !events) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // finding by name
    const organization = organizations.find(org => org.name === name);
    if (!organization) {
        return res.status(404).json({ error: 'Organization not found' });
    }

    // update data
    organization.bio = bio;
    organization.socials = socials;
    organization.events = events;

    return res.status(200).json({ message: 'Organization profile updated successfully!' });
});

module.exports = router;
