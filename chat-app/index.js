// Dependencies
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

// Setup
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 3000;

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
    timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', MessageSchema);

// Middleware for serving static files
app.use(express.static('Frontend'));

// API to get all messages in a room
app.get('/messages/:room_id', async (req, res) => {
    try {
        const messages = await Message.find({ room_id: req.params.room_id });
        res.json(messages);
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
            io.to(data.room_id).emit('message', data);
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