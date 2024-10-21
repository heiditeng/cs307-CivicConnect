const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require('path');

const mongoose = require('mongoose');

const app = express();

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer to handle file uploads and preserve original file names
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Use the original file name
    }
});

const upload = multer({ storage: storage });

console.log('Serving static files from:', path.join(__dirname,'uploads'));

// Test route for checking static file serving
app.get('/test-file', (req, res) => {
    res.sendFile(path.join(__dirname, 'uploads', 'monkey.jpeg'), (err) => {
        if (err) {
            console.error('File not found:', err);
            res.status(404).send('File not found');
        }
    });
});

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
        eventImage: 'animal.jpeg',
        eventVideo: 'cat.mp4',
    },
    {
        id: 2,
        eventName: 'Local Concert',
        eventDate: '2024-10-15',
        eventStartTime: '06:00 PM',
        eventEndTime: '10:00 PM',
        eventZipcode: '30301',
        eventDescription: 'Enjoy an evening of music with local bands!',
        eventImage: 'duck.jpeg',
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
        eventImage: 'monkey.jpeg',
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

    const newId = events.length > 0 ? events[events.length - 1].id + 1 : 1;

    // Create a new event object
    const newEvent = {
        id: newId,
        eventName: name,
        eventDate: date,
        eventStartTime,
        eventEndTime,
        eventZipcode,
        eventDescription: description,
        eventImage: req.files.eventImage ? req.files.eventImage[0].originalname : null, // Save only the file name
        eventVideo: req.files.eventVideo ? req.files.eventVideo[0].originalname : null, // Save only the file name
    };

    events.push(newEvent);
    return res.status(201).json(newEvent);
});

// Route to fetch all events
// router.get('/events', (req, res) => {
//     res.json(events);
// });

router.get('/events', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching events' });
    }
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
// router.delete('/events/:id', (req, res) => {
//     const { id } = req.params;
//     const eventIndex = events.findIndex(event => event.id === parseInt(id));

//     if (eventIndex === -1) {
//         return res.status(404).json({ error: 'Event not found' });
//     }

//     events.splice(eventIndex, 1);
//     res.status(204).send(); // No content response
// });

router.delete('/events/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findByIdAndDelete(id);

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.status(204).send(); // No content response
    } catch (error) {
        res.status(500).json({ error: 'Error deleting event' });
    }
});

module.exports = router;
