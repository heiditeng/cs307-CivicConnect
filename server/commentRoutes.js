// routes/comments.js
const express = require('express');
const Comment = require('../models/Comment');  // Import the Comment model

const router = express.Router();

//fetch comments
router.get('/:postId', async (req, res) => {
  try {
    const {postId} = req.params;
    const comments = await Comment.find({postId});
    res.status(200).json(comments);
  } catch (error) {
    console.error('Error retrieving comments:', error);
    res.status(500).json({error: 'Server error'});
  }
});

//add comments
router.post('/add', async (req, res) => {

    const newComment = new Comment({ postId, username, commentText });
    await newComment.save();

    res.status(201).json({ message: 'Comment added successfully', comment: newComment });
  
});


//like comments
router.post('/like', async (req, res) => {
    const { commentId, username } = req.body;
  
  
    const comment = await Comment.findById(commentId);
      //update like data and like count
    comment.likedBy.push(username);
    comment.likeCount += 1;
  
    await comment.save();
    res.status(200).json({ message: 'Comment liked successfully!', comment });

  });

module.exports = router;
