import React, { useState, useEffect } from 'react';

//fetch post comments
const fetchComments = async (postId) => {
  const response = await fetch(`http://localhost:5010/comments/${postId}`);
  const data = await response.json();
  return data;
};

//add comment to post
const addComment = async (postId, username, commentText) => {
  const response = await fetch(`http://localhost:5010/comments/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ postId, username, commentText })
  });
  return response.json();
};

const CommentsPage = ({ postId, username }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  console.log("before fetching comments");

  useEffect(() => {
    fetchComments(postId).then(data => setComments(data));
  }, [postId]);

  console.log("after fetching comments, handle comment");
  
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      const newComment = await addComment(postId, username, commentText);
      setComments([...comments, newComment.comment]);
      setCommentText('');
    }
  };

  return (
    <div>
      <h2>Comments</h2>
      
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment._id} className="comment">
            <p><strong>{comment.username}</strong>: {comment.commentText}</p>
            <p className="timestamp">{new Date(comment.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleAddComment} className="comment-form">
        <textarea
          placeholder="Type comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button type="submit">Post Comment</button>
      </form>
    </div>
  );
};

export default CommentsPage;
