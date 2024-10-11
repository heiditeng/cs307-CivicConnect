// src/components/EventDetails.js
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EventDetails = ({ onDelete }) => {
  const { id } = useParams(); // Get the event ID from the URL
  const navigate = useNavigate(); // To navigate after deletion

  // Sample data for events (this should ideally come from a database or API)
  const events = {
    1: {
      name: 'Community Cleanup',
      date: '2024-10-10',
      imageUrl: '',
      description: 'Join us for a community cleanup to keep our park beautiful!',
    },
    2: {
      name: 'Local Concert',
      date: '2024-10-15',
      imageUrl: '',
      description: 'Enjoy an evening of music with local bands!',
    },
    3: {
      name: 'Charity Run',
      date: '2024-10-20',
      imageUrl: '',
      description: 'Participate in a charity run to support local charities.',
    },
  };

  const event = events[id];

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id); // Call the delete function
    }
    navigate('/my-events'); // Navigate back to My Events after deletion
  };

  return (
    <div>
      <h2>Event Details</h2>
      {event ? (
        <div>
          <h3>{event.name}</h3>
          <p>Date: {event.date}</p>
          <img src={event.imageUrl} alt={event.name} style={{ width: '300px', height: '300px', objectFit: 'cover' }} />
          <p>Description: {event.description}</p>
          <button onClick={handleDelete}>Delete Event</button> {/* Delete button */}
        </div>
      ) : (
        <p>Event not found.</p>
      )}
    </div>
  );
};

export default EventDetails;
