const express = require('express');
const multer = require('multer');
const path = require('path');
const Post = require('./post.js'); 
//const fileUpload = require('./fileUpload.js'); 
const router = express.Router();

//set up multer
const upload = multer({ storage: multer.memoryStorage() });


//post fetching route
router.get('/myposts', async(req, res) => {
  const { userId } = req.query;

  try {
    const posts = await Post.find({ userId }).populate('likes', 'username');

    //sending media files
    //convert to urls for front-end
    const decodedPosts = posts.map((post) => ({
      ...post.toObject(),
      files: post.files.map((file) => ({
        ...file,
        data: `data:${file.contentType};base64,${file.data.toString('base64')}`,
      })),
    }));
    console.log("sent posts to front-end")
    res.status(200).json(decodedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Error fetching posts' });
  }                                                             
});


//post creation route
router.post('/create', upload.array('files', 5), async (req, res) => {
  try {
    const { postId, userId, caption, location, event, timestamp, likeCount } = req.body;

    //debugging
    console.log('Received post data:', { postId, userId, caption, location, event, timestamp });

    //required fields
    if (!postId || !userId || !timestamp) {
      return res.status(400).json({ error: 'Missing required fields: postId, userId, or timestamp.' });
    }

    //converting media files to binary for storage
    const uploadedFiles = [];
    if (req.files) {
      for (const file of req.files) {
        uploadedFiles.push({
          data: file.buffer, //raw binary
          contentType: file.mimetype,
          filename: file.originalname,
        });
      }
    }

    //new post created
    const newPost = new Post({
      postId,
      userId,
      caption,
      location,
      event,
      timestamp,
      likeCount: likeCount || 0,
      likes: [],
      files: uploadedFiles, //store files in post document
    });

    //saving post to db
    await newPost.save();
    res.status(201).json({ message: 'Post created successfully!', post: newPost });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
});

router.post(':userId/like/:postId', async (req, res) => {
  const { userId, postId } = req.params;
  //const { userId } = req.body; 

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Toggle like: Add/remove user from likes array
    const alreadyLiked = post.likes.includes(userId);
    if (!alreadyLiked) {
      post.likes.push(userId); // Add user to likes
    } else {
      post.likes = post.likes.filter((id) => id !== userId); // Remove user from likes
    }

    // Update like count and save
    post.likeCount = post.likes.length;
    await post.save();

    res.status(200).json({
      postId: post._id,
      likeCount: post.likeCount,
      likedByCurrentUser: !alreadyLiked, // Updated state
    });
  } catch (error) {
    console.error('Error liking/unliking post:', error);
    res.status(500).json({ error: 'Failed to like/unlike post' });
  }
});


module.exports = router;