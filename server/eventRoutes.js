const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require('path');
const Event = require('./event');

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

// Route to create a new event
router.post('/events', upload.fields([{ name: 'eventImage' }, { name: 'eventVideo' }]), async (req, res) => {
    const { name, date, startTime, endTime, location, maxCapacity, type, description, userId } = req.body;

    // Validate request data
    if (!name || !date || !description || !location || !maxCapacity || !type || !userId) {
        return res.status(400).json({ error: 'Name, date, location, maxCapacity, type, description, and userId are required' });
    }

    const newEvent = new Event({
        name,
        date,
        startTime,
        endTime,
        location,
        maxCapacity,
        type,
        description,
        image: req.files.eventImage ? req.files.eventImage[0].originalname : null,
        video: req.files.eventVideo ? req.files.eventVideo[0].originalname : null,
        userId,
    });

    try {
        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        console.error('Error saving event:', error.message);
        res.status(500).json({ error: 'Error saving event' });
    }
});

// router.post('/events', upload.fields([{ name: 'eventImage' }, { name: 'eventVideo' }]), async (req, res) => {
//     const userId = req.user._id;

//     const { name, date, startTime, endTime, location, maxCapacity, type, description } = req.body;

//     if (!name || !date || !description || !location || !maxCapacity || !type) {
//         return res.status(400).json({ error: 'Name, date, location, maxCapacity, type, and description are required' });
//     }

//     const newEvent = new Event({
//         name,
//         date,
//         startTime,
//         endTime,
//         location,
//         maxCapacity,
//         type,
//         description,
//         image: req.files.eventImage ? req.files.eventImage[0].originalname : null,
//         video: req.files.eventVideo ? req.files.eventVideo[0].originalname : null,
//         userId,
//     });

//     try {
//         const savedEvent = await newEvent.save();
//         res.status(201).json(savedEvent);
//     } catch (error) {
//         console.error('Error saving event:', error.message);
//         res.status(500).json({ error: 'Error saving event' });
//     }
// });



// Route to fetch all events
// router.get('/events', async (req, res) => {
//     try {
//         const events = await Event.find();
//         res.json(events);
//     } catch (error) {
//         res.status(500).json({ error: 'Error fetching events' });
//     }
// });

// Route to fetch all events for a specific user
router.get('/events/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const events = await Event.find({ userId });
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching events' });
    }
});


// Route to fetch a single event by ID
router.get('/events/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching event' });
    }
});


// Route to delete an event
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
