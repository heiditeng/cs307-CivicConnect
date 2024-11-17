// Dependencies
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');

// Setup
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 4000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/CS307', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Mongoose schemas and models
const UserSchema = new mongoose.Schema({
  user_id: String,
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
});
const User = mongoose.model('User', UserSchema);

const RoomSchema = new mongoose.Schema({
  room_id: String,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});
const Room = mongoose.model('Room', RoomSchema);

const MessageSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  image_url: String,
  link: String,
  timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', MessageSchema);

const UploadSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
  filename: String,
  timestamp: { type: Date, default: Date.now }
});
const Upload = mongoose.model('Upload', UploadSchema);

const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  timestamp: { type: Date, default: Date.now }
});
const Notification = mongoose.model('Notification', NotificationSchema);

const EventSchema = new mongoose.Schema({
  link: String,
  views: { type: Number, default: 0 }
});
const Event = mongoose.model('Event', EventSchema);

// Middleware for serving static files
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up storage in MongoDB
const upload = multer({ storage: multer.memoryStorage() });

// API to get all rooms for a user
app.get('/users/:user_id/rooms', async (req, res) => {
  try {
    const user = await User.findOne({ user_id: req.params.user_id }).populate('rooms', 'room_id');
    if (!user) {
      return res.status(404).send('User not found');
    }
    const rooms = user.rooms.map(room => room.room_id);
    res.json(rooms);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Serve uploaded images from MongoDB
app.get('/uploads/:id', async (req, res) => {
  try {
    const image = await Upload.findById(req.params.id);
    if (!image) {
      return res.status(404).send('Image not found');
    }
    res.contentType(image.contentType);
    res.send(image.data);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// API to get all messages in a room
app.get('/messages/:room_id', async (req, res) => {
  try {
    const room = await Room.findOne({ room_id: req.params.room_id });
    if (!room) {
      return res.status(404).send('Room not found');
    }

    const messages = await Message.find({ room: room._id }).populate('user', 'user_id');
    res.json(messages);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Endpoint for uploading a photo
app.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    const { room, user } = req.body;
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }
    const rm = await Room.findOne({ room_id: room });
    const usr = await User.findOne({ user_id: user });
    if (!rm || !usr) {
      return res.status(404).send('Room or User not found');
    }

    const imageUpload = new Upload({
      data: req.file.buffer,
      contentType: req.file.mimetype,
      filename: req.file.originalname
    });
    const savedImage = await imageUpload.save();
    const imageUrl = `/uploads/${savedImage._id}`;

    const message = new Message({
      room: rm._id,
      user: usr._id,
      image_url: imageUrl,
      content: '',
      link: ''
    });
    await message.save();
    await message.populate('user', 'user_id');

    // Emit the image message to all connected clients in the room
    io.to(room).emit('message', message.toObject());

    res.status(200).json({ message: 'Image uploaded successfully', data: message });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// API to add a user to a room
app.post('/rooms/:room_id/add-member', async (req, res) => {
  try {
    const { user_id } = req.body;
    let user = await User.findOne({ user_id });
    if (!user) {
      user = new User({ user_id });
      await user.save();
    }

    let room = await Room.findOne({ room_id: req.params.room_id });
    if (!room) {
      room = new Room({ room_id: req.params.room_id });
      await room.save();
    }

    // Add user to room if not already a member
    if (!room.members.includes(user._id)) {
      room.members.push(user._id);
      await room.save();
    }

    // Add room to user's list if not already added
    if (!user.rooms.includes(room._id)) {
      user.rooms.push(room._id);
      await user.save();
    }

    console.log(`User ${user.user_id} added to room ${room.room_id}`);

    // Create a notification message
    const notificationMessage = `You have been added to room ${room.room_id}.`;

    // Save the notification to the database
    const notification = new Notification({
      user: user._id,
      message: notificationMessage
    });
    await notification.save();

    // Emit the notification to the specific user
    io.to(user_id).emit('notification', {
      message: notification.message,
      timestamp: notification.timestamp
    });

    res.status(200).json({ message: 'User added to room successfully' });
  } catch (err) {
    console.error('Error adding user to room:', err.message);
    res.status(500).send(err.message);
  }
});

(async function createEventIfNotExists() {
  const eventLink = 'https://google.com';
  let event = await Event.findOne({ link: eventLink });
  if (!event) {
    event = new Event({ link: eventLink });
    await event.save();
    console.log('Event created:', event);
  }
})();

app.post('/event/increment', async (req, res) => {
  try {
    const { link } = req.body;
    const event = await Event.findOne({ link });
    if (!event) {
      return res.status(404).send('Event not found');
    }
    event.views += 1;
    await event.save();

    // Emit the updated views count via Socket.IO
    io.emit('eventUpdated', { link: event.link, views: event.views });

    res.json({ views: event.views });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get notifications for a user
app.get('/notifications/:user_id', async (req, res) => {
  try {
    const user = await User.findOne({ user_id: req.params.user_id });
    if (!user) {
      return res.status(404).send('User not found');
    }
    const notifications = await Notification.find({ user: user._id }).sort({ timestamp: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Create a new notification and emit via Socket.IO
app.post('/notifications', async (req, res) => {
  try {
    const { user_id, message } = req.body;
    const user = await User.findOne({ user_id });
    if (!user) {
      return res.status(404).send('User not found');
    }
    const notification = new Notification({
      user: user._id,
      message
    });
    await notification.save();

    // Emit the notification to the specific user
    io.to(user_id).emit('notification', {
      message: notification.message,
      timestamp: notification.timestamp
    });

    res.status(201).json(notification);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
// Delete notifications for a user
app.delete('/notifications/:user_id', async (req, res) => {
  try {
    const user = await User.findOne({ user_id: req.params.user_id });
    if (!user) {
      return res.status(404).send('User not found');
    }
    await Notification.deleteMany({ user: user._id });
    res.status(200).send('Notifications cleared');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Socket.IO for real-time messaging
io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('joinRoom', async ({ user_id, room_id }) => {
    try {
      await addUserToRoom(user_id, room_id).catch(err => { console.error('Error in addUserToRoom:', err.message); });
      socket.join(room_id);
      socket.join(user_id);
      console.log(`User ${user_id} joined room: ${room_id}`);
    } catch (err) {
      console.error('Error joining room:', err.message);
    }
  });

  socket.on('message', async (data) => {
    try {
      const room = await Room.findOne({ room_id: data.room });
      const user = await User.findOne({ user_id: data.user });
      if (!room || !user) {
        throw new Error('Room or User not found');
      }
      const message = new Message({
        room: room._id,
        user: user._id,
        content: data.content,
        image_url: data.image_url || '',
        link: data.link || ''
      });
      await message.save();
      await message.populate('user', 'user_id');

      // Emit message to the specific room
      io.to(data.room).emit('message', message.toObject());
    } catch (err) {
      console.error('Error saving message:', err.message);
    }
  });

  socket.on('sendNotification', async ({ targetUser, message }) => {
    try {
      const user = await User.findOne({ user_id: targetUser });
      if (user) {
        const notification = new Notification({
          user: user._id,
          message
        });
        await notification.save();
  
        // Emit the notification to the specific user
        io.to(targetUser).emit('notification', {
          message: notification.message,
          timestamp: notification.timestamp
        });

        //stub for email notifications
        console.log(`Notification sent to ${targetUser}: ${notification.message}`);
      }
    } catch (err) {
      console.error('Error sending notification:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

async function addUserToRoom(user_id, room_id) {
  let user = await User.findOne({ user_id });
  if (!user) {
    user = new User({ user_id });
    await user.save();
  }

  let room = await Room.findOne({ room_id });
  if (!room) {
    room = new Room({ room_id });
    await room.save();
  }

  // Add user to room if not already a member
  if (!room.members.includes(user._id)) {
    room.members.push(user._id);
    await room.save();
  }

  // Add room to user's list if not already added
  if (!user.rooms.includes(room._id)) {
    user.rooms.push(room._id);
    await user.save();
  }
}

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});