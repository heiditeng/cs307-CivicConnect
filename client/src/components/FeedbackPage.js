import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './FeedbackPage.css';

function FeedbackPage() {
  const { id } = useParams();
  const [feedbackList, setFeedbackList] = useState([]);
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const user = "roohee";

  // Fetch existing feedback
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await axios.get(`http://localhost:5010/api/events/${id}/feedback`);
        setFeedbackList(res.data);
      } catch (error) {
        setErrorMessage('Error fetching feedback. Please try again later.');
      }
    };
    fetchFeedback();
  }, [id]);

  // Submit new feedback
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5010/api/events/${id}/feedback`, {
        username: user, // Replace with actual user ID
        rating,
        feedback: feedbackText,
      });
      setFeedbackList([...feedbackList, { username: user, rating, feedback: feedbackText }]);
      setRating(5);
      setFeedbackText('');
    } catch (error) {
      setErrorMessage('Error submitting feedback. Please try again later.');
    }
  };

  return (
    <div className="feedback-container">
      <h2>Event Feedback</h2>

      {/* Display error*/}
      {errorMessage && <p className="error">{errorMessage}</p>}

      {/* Feedback List Section */}
      <div className="feedback-list">
        {feedbackList.length > 0 ? (
          feedbackList.map((item, index) => (
            <div key={index} className="feedback-item">
              <p><strong>User:</strong> {item.username}</p>
              <p><strong>Rating:</strong> {item.rating} ⭐</p>
              <p>{item.feedback}</p>
            </div>
          ))
        ) : (
          <p>No feedback yet.</p>
        )}
      </div>

      {/* Feedback Form Section */}
      <form onSubmit={handleSubmit} className="feedback-form">
        <h3>Leave Feedback</h3>
        <label>
          Rating:
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>{star} ⭐</option>
            ))}
          </select>
        </label>
        <label>
          Feedback:
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="feedback..."
            required
          />
        </label>
        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
}

export default FeedbackPage;
