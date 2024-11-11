const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const Event = require("./event");
const User = require("./user");
const { emailTemplates } = require('./messages');
const Notification = require('./notification');

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'civicconnect075@gmail.com',
    pass: 'qsdg tgcs azwy duqa',
  },
});

const app = express();

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configure multer to handle file uploads and preserve original file names
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage: storage });

console.log("Serving static files from:", path.join(__dirname, "uploads"));

// Route to create a new event
router.post(
  "/events",
  upload.fields([{ name: "eventImages" }, { name: "thumbnailImage" }, { name: "eventVideo" }]),
  async (req, res) => {
    const {
      name,
      date,
      startTime,
      endTime,
      address,
      zipcode,
      maxCapacity,
      type,
      description,
      userId,
    } = req.body;

    // Validate request data
    if (
      !name ||
      !date ||
      !description ||
      !address ||
      !zipcode ||
      !maxCapacity ||
      !type ||
      !userId
    ) {
      return res
        .status(400)
        .json({
          error:
            "Name, date, address, zipcode, maxCapacity, type, description, and userId are required",
        });
    }

    const newEvent = new Event({
      name,
      date,
      startTime,
      endTime,
      address,
      zipcode,
      maxCapacity,
      type,
      description,
      image: req.files.eventImages ? req.files.eventImages.map(file => file.originalname) : [],
      thumbnailImage: req.files.thumbnailImage ? req.files.thumbnailImage[0].originalname : null,
      video: req.files.eventVideo ? req.files.eventVideo[0].originalname : null,
      userId,
    });

    try {
      const savedEvent = await newEvent.save();
      res.status(201).json(savedEvent);
    } catch (error) {
      console.error("Error saving event:", error.message);
      res.status(500).json({ error: "Error saving event" });
    }
  }
);

// note from aysu: updated this from /events to /
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Error fetching events" });
  }
});

// Route to fetch a single event by ID
router.get("/events/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: "Error fetching event" });
  }
});

// Route to delete an event
router.delete("/events/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(204).send(); // No content response
  } catch (error) {
    res.status(500).json({ error: "Error deleting event" });
  }
});

// Route to modify an event
// Route to modify an event and send notification
router.put(
  "/events/:id",
  upload.fields([
    { name: "eventImages" },
    { name: "eventVideo" },
    { name: "thumbnailImage" },
  ]),
  async (req, res) => {
    const { id } = req.params;
    const {
      name,
      date,
      startTime,
      endTime,
      address,
      zipcode,
      maxCapacity,
      type,
      description,
      userId,
    } = req.body;

    // Validate request data
    if (
      !name ||
      !date ||
      !description ||
      !address ||
      !zipcode ||
      !maxCapacity ||
      !type ||
      !userId
    ) {
      return res.status(400).json({
        error:
          "Name, date, address, zipcode, maxCapacity, type, description, and userId are required",
      });
    }

    // Construct updated data object
    const updatedData = {
      name,
      date,
      startTime,
      endTime,
      address,
      zipcode,
      maxCapacity,
      type,
      description,
      image: req.files.eventImages
        ? req.files.eventImages.map((file) => file.originalname)
        : [],
      thumbnailImage: req.files.thumbnailImage
        ? req.files.thumbnailImage[0].originalname
        : null,
      video: req.files.eventVideo
        ? req.files.eventVideo[0].originalname
        : null,
      userId,
    };

    try {
      // Update the event in the database
      const updatedEvent = await Event.findByIdAndUpdate(id, updatedData, {
        new: true, lastModified: new Date(),
      });
      if (!updatedEvent) {
        return res.status(404).json({ error: "Event not found" });
      }

      console.log("Event updated successfully:", updatedEvent);

      // Fetch RSVP’d users and send notifications
      const rsvpUsers = await User.find({
        _id: { $in: updatedEvent.rsvpUsers },
      });

      await Promise.all(
        rsvpUsers.map(async (user) => {
          const mailOptions = {
            from: "civicconnect075@gmail.com",
            to: user.email,
            subject: `Update on Event: ${updatedEvent.name}`,
            html: emailTemplates.eventModification(
              user.username,
              updatedEvent.name,
              updatedEvent,
              `http://localhost:3000/modify-events/${updatedEvent._id}`
            ),
          };

          await transporter.sendMail(mailOptions);
          console.log(`Notification sent to ${user.email}`);

          // save the notification in the database
          const notification = new Notification({
            userId: user._id,
            eventId: updatedEvent._id,
            eventName: updatedEvent.name,
            changes: `Updated details: Date - ${updatedEvent.date}, Time - ${updatedEvent.startTime} to ${updatedEvent.endTime}, Location - ${updatedEvent.address}, ${updatedEvent.zipcode}`,
          });

          await notification.save();
          console.log(`Notification sent and saved for ${user.email} for event ${updatedEvent.name}`);
        })
      );

      // Send the updated event as the response
      res.json(updatedEvent);
    } catch (error) {
      console.error("Error updating event:", error.message);
      res.status(500).json({ error: "Error updating event" });
    }
  }
);

// rsvp
router.post("/:id/rsvp", async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;

  try {
    // get event by id
    const event = await Event.findById(id);

    // get user by username
    const user = await User.findOne({ username });

    if (!event || !user) {
      return res.status(404).json({ error: "Event or User not found" });
    }

    // check if user in event RSVP list, if not add
    if (!event.rsvpUsers.includes(user._id.toString())) {
      event.rsvpUsers.push(user._id);
      await event.save();
      console.log("User added RSVP list");
    }
    // check is event in user RSVP list, if not add
    if (!user.rsvpEvents.includes(event._id.toString())) {
      user.rsvpEvents.push(event._id);
      await user.save();
    }

    res.status(200).json({ message: "RSVP successful" });
  } catch (error) {
    console.error("Error processing RSVP:", error);
    res.status(500).json({ error: "Error processing RSVP" });
  }
});

// removing rsvp
router.post("/:id/remove-rsvp", async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;
  try {
    console.log(
      "Remove RSVP endpoint hit with Event ID:",
      id,
      "and Username:",
      username
    );

    // get event by id
    const event = await Event.findById(id);

    // get user by username
    const user = await User.findOne({ username });

    if (!event || !user) {
      return res.status(404).json({ error: "Event or User not found" });
    }

    // remove user from event's list if present
    const userIndexInEvent = event.rsvpUsers.indexOf(user._id.toString());
    if (userIndexInEvent !== -1) {
      event.rsvpUsers.splice(userIndexInEvent, 1);
      await event.save();
    }

    // remove event from user's list if present
    const eventIndexInUser = user.rsvpEvents.indexOf(event._id.toString());
    if (eventIndexInUser !== -1) {
      user.rsvpEvents.splice(eventIndexInUser, 1);
      await user.save();
    }
    res.status(200).json({ message: "RSVP removed successfully" });
  } catch (error) {
    console.error("Error removing RSVP:", error);
    res.status(500).json({ error: "Error removing RSVP" });
  }
});

router.get("/rsvp-list/:id", async (req, res) => {
  const { id } = req.params;  // Corrected to `id`
  try {
    // Find the event by its ID and populate the rsvpUsers field with full user details
    const event = await Event.findById(id).populate('rsvpUsers');
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json({ rsvpUsers: event.rsvpUsers });
  } catch (error) {
    console.error('Error fetching RSVP list:', error);
    res.status(500).json({ error: 'An error occurred while fetching the RSVP list' });
  }
});

//event feedback
router.get("/events/:id/feedback", async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findById(id).populate('userRatings.username', 'name');
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event.userRatings); // Return the userRatings array
  } catch (error) {
    console.error("Error fetching feedback:", error.message);
    res.status(500).json({ error: "Error fetching feedback" });
  }
});

//add event feedback
router.post("/events/:id/feedback", async (req, res) => {
  const { id } = req.params;
  const { username, rating, feedback } = req.body;

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Push new feedback into the userRatings array
    event.userRatings.push({ username, rating, feedback });
    await event.save();

    res.status(201).json({ message: "Feedback added successfully" });
  } catch (error) {
    console.error("Error adding feedback:", error.message);
    res.status(500).json({ error: "Error adding feedback" });
  }
});

// Calculate average rating for a user
router.get("/user/:userId/average-rating", async (req, res) => {
  const { userId } = req.params;
  try {
    //get username
    const events = await Event.find({ "userRatings.username": userId });

    //collect ratings
    const ratings = events
      .flatMap(event => event.userRatings)
      .filter(rating => rating.username.toString() === userId)
      .map(rating => rating.rating);

    //calculate average
    const averageRating = ratings.length > 0
      ? (ratings.reduce((acc, val) => acc + val, 0) / ratings.length).toFixed(2)
      : null;

    res.json({ averageRating });
  } catch (error) {
    console.error("Error fetching average rating:", error.message);
    res.status(500).json({ error: "Error fetching average rating" });
  }
});

module.exports = router;
