// src/components/DeleteConfirmation.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const DeleteConfirmation = () => {
  const location = useLocation();
  const { eventId, eventName } = location.state || { eventId: null, eventName: '' };

  return (
    <div className="confirmation-modal">
      <h3>Confirm Deletion</h3>
      <p>Are you sure you want to delete the event: {eventName}?</p>
      <Link to={{
        pathname: "/my-events",
        state: { deletedId: eventId } // Pass the deleted event ID back
      }}>
        <button>Confirm</button>
      </Link>
      <Link to="/my-events">
        <button>Cancel</button>
      </Link>
    </div>
  );
};

export default DeleteConfirmation;
