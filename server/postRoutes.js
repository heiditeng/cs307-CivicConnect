const express = require('express');
const multer = require('multer');
const path = require('path');
const Post = require('./post.js'); // Import post model

const router = express.Router();

//set up multer
const upload = multer({ storage: multer.memoryStorage() });


//post fetching route
router.get('/myposts', async(req, res) => {
  const{ username } = req.query;

  const posts = await Post.find({ username });
  res.status(200).json(posts);
});


//post creation route
router.post('/create', upload.none(), async (req, res) => {
  try {
    const { postId, username, caption, location, event, timestamp } = req.body;

    //log data for debugging
    console.log('Received post data:', { postId, username, caption, location, event, timestamp });

    //check for required fields
    if (!postId || !username || !timestamp) {
      return res.status(400).json({ error: 'Missing required fields: postId, username, or timestamp.' });
    }

    // Create a new post
    const newPost = new Post({
      postId,
      username,
      caption,
      location,
      event,
      timestamp,
      likeCount,
      likes,
      files: [],  //file handling not implemented yet
    });

    await newPost.save();
    res.status(201).json({ message: 'Post created successfully!', post: newPost });
  } catch (error) {
    //logging error details, use inspect tool to view error message
    console.error('Error creating post:', error);
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
});

module.exports = router;
