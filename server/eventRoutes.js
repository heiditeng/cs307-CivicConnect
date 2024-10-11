const express = require('express');
const multer = require('multer');
const router = express.Router();

// Configure multer to handle file uploads
const upload = multer({ dest: 'uploads/' }); // Specify the uploads directory

// Mock data for events -- replace later with MongoDB
let events = [
    {
        id: 1,
        eventName: 'Community Cleanup',
        eventDate: '2024-10-10',
        eventStartTime: '09:00 AM',
        eventEndTime: '12:00 PM',
        eventZipcode: '94101',
        eventDescription: 'Join us for a community cleanup to keep our park beautiful!',
        eventImage: null,
        eventVideo: null,
    },
    {
        id: 2,
        eventName: 'Local Concert',
        eventDate: '2024-10-15',
        eventStartTime: '06:00 PM',
        eventEndTime: '10:00 PM',
        eventZipcode: '30301',
        eventDescription: 'Enjoy an evening of music with local bands!',
        eventImage: null,
        eventVideo: null,
    },
    {
        id: 3,
        eventName: 'Charity Run',
        eventDate: '2024-10-20',
        eventStartTime: '08:00 AM',
        eventEndTime: '11:00 AM',
        eventZipcode: '94102',
        eventDescription: 'Participate in a charity run to support local charities.',
        eventImage: null,
        eventVideo: null,
    },
];

// Route to create a new event
router.post('/events', upload.fields([{ name: 'eventImage' }, { name: 'eventVideo' }]), (req, res) => {
    const { name, date, eventStartTime, eventEndTime, eventZipcode, description } = req.body;

    // Validate request data
    if (!name || !date || !description || !eventZipcode) {
        return res.status(400).json({ error: 'Name, date, eventZipcode, and description are required' });
    }

    if (events.length > 0) {
        newId = events[events.length - 1].id + 1; 
    } else {
        newId = 1;
    }

    // Create a new event object
    const newEvent = {
        id: newId,
        eventName: name,
        eventDate: date,
        eventStartTime,
        eventEndTime,
        eventZipcode,
        eventDescription: description,
        eventImage: req.files.eventImage ? req.files.eventImage[0].path : null, // Save the file path
        eventVideo: req.files.eventVideo ? req.files.eventVideo[0].path : null, // Save the file path
    };

    events.push(newEvent);
    return res.status(201).json(newEvent);
});

// Route to fetch all events
router.get('/events', (req, res) => {
    res.json(events);
});

// Route to fetch a single event by ID
router.get('/events/:id', (req, res) => {
    const { id } = req.params;
    const event = events.find(event => event.id === parseInt(id));

    if (!event) {
        return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
});


// Route to delete an event
router.delete('/events/:id', (req, res) => {
    const { id } = req.params;
    const eventIndex = events.findIndex(event => event.id === parseInt(id));

    if (eventIndex === -1) {
        return res.status(404).json({ error: 'Event not found' });
    }

    events.splice(eventIndex, 1);
    res.status(204).send(); // No content response
});

module.exports = router;
