const express = require('express');
const router = express.Router();
const Comment = require('./comment'); 

// Route to fetch comments for a specific post
router.get('/:postId', async (req, res) => {
  const { postId } = req.params; // Get postId from URL parameter directly

  try {
    const comments = await Comment.find({ postId }).sort({ timestamp: -1 });
    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Error fetching comments' });
  }
});

// Route to add a new comment
router.post('/', async (req, res) => {
  const { postId, text, user } = req.body;

  try {
    const newComment = new Comment({
      postId, // Store postId directly as a string
      text,
      user,
      likeCount: 0,
      likes: [],
      replies: []
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Error creating comment' });
  }
});

// Route to like or unlike a comment
router.post('/like', async (req, res) => {
  const { commentId, user } = req.body;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.likes.includes(user)) {
      comment.likes = comment.likes.filter((u) => u !== user);
      comment.likeCount -= 1;
    } else {
      comment.likes.push(user);
      comment.likeCount += 1;
    }

    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    console.error('Error liking comment:', error);
    res.status(500).json({ error: 'Error liking comment' });
  }
});

// Route to add a reply to a comment
router.post('/reply', async (req, res) => {
  const { commentId, user, text } = req.body;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    comment.replies.push({ user, text, timestamp: new Date() });

    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ error: 'Error adding reply' });
  }
});

module.exports = router;
