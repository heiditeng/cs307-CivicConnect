const express = require('express');
const Post = require('./post');

const router = express.Router();

// Route to create a new post
router.post('/create', async (req, res) => {
  try {
    const { caption, location, event, files } = req.body;
    const newPost = new Post({
      caption,
      location,
      event,
      files, // For now, this will be a list of file URLs
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
});

// Route to fetch all posts
router.get('/myposts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
});

module.exports = router;

