const express = require('express');
const multer = require('multer');
const path = require('path');
const Post = require('./post.js'); // Import post model
// const fileUpload = require('./fileUpload.js'); //import upload model

const router = express.Router();

//set up multer
const upload = multer({ storage: multer.memoryStorage() });


//post fetching route
router.get('/myposts', async(req, res) => {
  const { username } = req.query;

  try {
    const posts = await Post.find({ username });
    console.log('Fetched posts for user:', username);
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Error fetching posts' });
  }
});


//post creation route
router.post('/create', upload.array('files', 5), async (req, res) => {
  try {
    const { postId, username, caption, location, event, timestamp, likeCount, likes } = req.body;

    console.log('Received post data:', { postId, username, caption, location, event, timestamp, likeCount, likes });

    // Check for required fields
    if (!postId || !username || !timestamp) {
      return res.status(400).json({ error: 'Missing required fields: postId, username, or timestamp.' });
    }

    // Array to store URLs of uploaded files
    const uploadedFiles = [];
    if (req.files) {
      for (const file of req.files) {
        // Create a new Upload document for each file
        const upload = new fileUpload({
          data: file.buffer,
          contentType: file.mimetype,
          filename: file.originalname,
        });
        const savedFile = await upload.save();
        uploadedFiles.push(`/uploads/${savedFile._id}`); // Save file URL
      }
    }

    // Create a new Post with the uploaded file URLs
    const newPost = new Post({
      postId,
      username,
      caption,
      location,
      event,
      timestamp,
      likeCount: likeCount || 0,
      likes: [],
      files: uploadedFiles, // Store URLs of uploaded files
    });

    await newPost.save();
    res.status(201).json({ message: 'Post created successfully!', post: newPost });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
});

module.exports = router;
