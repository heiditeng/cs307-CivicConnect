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
    res.status(200).json({ message: 'User added to room successfully' });
  } catch (err) {
    console.error('Error adding user to room:', err.message);
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