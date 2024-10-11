import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const DeleteConfirmation = ({ handleDelete }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventId, eventName } = location.state || { eventId: null, eventName: '' };

  const [deleted, setDeleted] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const confirmDelete = () => {
    if (eventId && handleDelete) {
      handleDelete(eventId); // Call the delete function
      setDeleted(true); // Show success message
    }
  };

  const cancelDelete = () => {
    setCancelled(true);
  };

  return (
    <div className="confirmation-modal">
      {!deleted && !cancelled ? (
        <>
          <h3>Confirm Deletion</h3>
          <p>Are you sure you want to delete the event: {eventName}?</p>
          <button onClick={confirmDelete}>Confirm</button>
          <button onClick={cancelDelete}>Cancel</button>
        </>
      ) : cancelled ? (
        <div>
          <h3>Event was not deleted.</h3>
        </div>
      ) : (
        <div>
          <h3>Event Deleted Successfully!</h3>
          <Link to="/my-events">
            <button>Go to My Events</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default DeleteConfirmation;
