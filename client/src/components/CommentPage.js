import React, { useState, useEffect } from 'react';
import './CommentPage.css';
import { useNavigate } from 'react-router-dom';

const CommentPage = () => {
    const [comments, setComments] = useState([
      { id: 1, user: 'user1', text: "great post!" }
    ]);
  
    const [newComment, setNewComment] = useState({ user: '', text: '' });
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewComment((prevComment) => ({ ...prevComment, [name]: value }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (newComment.user && newComment.text) {
        setComments([
          ...comments,
          { id: comments.length + 1, user: newComment.user, text: newComment.text },
        ]);
        setNewComment({ user: '', text: '' }); // Clear input after submitting
      }
    };
  
    return (
      <div className="container">
        <h2>Comments</h2>
        <div className="commentsList">
          {comments.map((comment) => (
            <div key={comment.id} className="comment">
              <h4>{comment.user}</h4>
              <p>{comment.text}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="form">
          <textarea
            name="text"
            value={newComment.text}
            onChange={handleInputChange}
            placeholder="Add a comment"
            className="textarea"
            required
          />
          <button type="submit" className="button">
            Add Comment
          </button>
        </form>
      </div>
    );
  };
  
  export default CommentPage;