// // Dependencies
// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const mongoose = require('mongoose');

// // Setup
// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);
// const PORT = process.env.PORT || 3000;

// // MongoDB connection
// mongoose.connect('mongodb://localhost:27017/CS307', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.error('MongoDB connection error:', err));

// // Mongoose schema and model
// const MessageSchema = new mongoose.Schema({
//     room_id: String,
//     user_id: String,
//     content: String,
//     timestamp: { type: Date, default: Date.now }
// });
// const Message = mongoose.model('Message', MessageSchema);

// // Middleware for serving static files
// app.use(express.static('Frontend'));

// // API to get all messages in a room
// app.get('/messages/:room_id', async (req, res) => {
//     try {
//         const messages = await Message.find({ room_id: req.params.room_id });
//         res.json(messages);
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// });

// // Socket.IO for real-time messaging
// io.on('connection', (socket) => {
//     console.log('New user connected');

//     socket.on('joinRoom', (room_id) => {
//         socket.join(room_id);
//         console.log(`User joined room: ${room_id}`);
//     });

//     socket.on('message', async (data) => {
//         try {
//             const message = new Message(data);
//             await message.save();
//             io.to(data.room_id).emit('message', data);
//         } catch (err) {
//             console.error('Error saving message:', err.message);
//         }
//     });

//     socket.on('disconnect', () => {
//         console.log('User disconnected');
//     });
// });

// // Start server
// server.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });




// index.js

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

// Mongoose schema and model
const MessageSchema = new mongoose.Schema({
  room_id: String,
  user_id: String,
  content: String,
  image_url: String,
  link: String,
  timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', MessageSchema);

// Middleware for serving static files
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up storage in MongoDB
const upload = multer({ storage: multer.memoryStorage() });

// Static folder for serving uploaded files
// Serve uploaded images from MongoDB
app.get('/uploads/:id', async (req, res) => {
  try {
    const image = await mongoose.model('Upload').findById(req.params.id);
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
    const messages = await Message.find({ room_id: req.params.room_id });
    res.json(messages);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Endpoint for uploading a photo
app.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    const { room_id, user_id } = req.body;
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }
    const imageBuffer = req.file.buffer;
    const imageUpload = new mongoose.model('Upload', new mongoose.Schema({
      data: Buffer,
      contentType: String,
      filename: String,
      timestamp: { type: Date, default: Date.now }
    }))({
      data: imageBuffer,
      contentType: req.file.mimetype,
      filename: req.file.originalname
    });
    const savedImage = await imageUpload.save();
    const imageUrl = `/uploads/${savedImage._id}`;

    const message = new Message({
      room_id,
      user_id,
      image_url: imageUrl
    });
    await message.save();

    // Send the image message to all connected clients in the room
    io.to(room_id).emit('message', message);

    res.status(200).json({ message: 'Image uploaded successfully', data: message });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Socket.IO for real-time messaging
io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('joinRoom', (room_id) => {
    socket.join(room_id);
    console.log(`User joined room: ${room_id}`);
  });

  socket.on('message', async (data) => {
    try {
      const message = new Message(data);
      await message.save();
      io.to(data.room_id).emit('message', message);
    } catch (err) {
      console.error('Error saving message:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});