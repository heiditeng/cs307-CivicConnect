const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const Event = require("./event");
const User = require("./user");
const { emailTemplates } = require('./messages');
const Notification = require('./notification');
const CapacityNotification = require('./capacityNotifications');


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
    // get event by ID
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
    }

    // check is event in user RSVP list, if not add
    if (!user.rsvpEvents.includes(event._id.toString())) {
      user.rsvpEvents.push(event._id);
      await user.save();
    }

    // curr capacity
    const capacityReached = event.rsvpUsers.length / event.maxCapacity;

    if (capacityReached === 1.0) {
      // notify the event organizer when the event is full
      const organizerNotification = new CapacityNotification({
        userId: event.userId, 
        eventId: event._id,
        message: `Your event "${event.name}" is now full!`,
      });
      await organizerNotification.save();
    } else if (capacityReached >= 0.75 ){
      // notify all users who have bookmarked the event
      const bookmarkUsers = await User.find({ bookmarks: event._id });

      await Promise.all(
        bookmarkUsers.map(async (bookmarkUser) => {
          const newNotification = new CapacityNotification({
            userId: bookmarkUser._id, // all bookmark users
            eventId: event._id,
            message: `The event "${event.name}" you bookmarked is now 90% full!`,
          });
          await newNotification.save();
        })
      );
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

// route to fetch all RSVP'd events for a specific user
router.get("/rsvp-events/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).populate('rsvpEvents');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ rsvpEvents: user.rsvpEvents });
  } catch (error) {
    console.error("Error fetching RSVP'd events:", error);
    res.status(500).json({ error: "Error fetching RSVP'd events" });
  }
});


router.get('/capacityNotifications/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // finding specific notifs for the curr user
    const notifications = await CapacityNotification.find({ userId });

    res.status(200).json(notifications);
  } catch (err) {
    console.error("Error fetching capacity notifications:", err);
    res.status(500).json({ error: "Error fetching notifications" });
  }
});

router.put('/capacityNotifications/mark-seen/:notificationId', async (req, res) => {
  const { notificationId } = req.params;
  try {
    await CapacityNotification.findByIdAndUpdate(notificationId, { seen: true });
    res.send('marked as seen');
  } catch (err) {
    res.status(500).send('err');
  }
});

module.exports = router;
