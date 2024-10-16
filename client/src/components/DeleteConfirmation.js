import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const DeleteConfirmation = () => {
  const { id, eventName } = useParams();
  const navigate = useNavigate();
  const [deleted, setDeleted] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const confirmDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5010/api/events/events/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDeleted(true);
      } else {
        console.error("Error deleting event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const cancelDelete = () => {
    setCancelled(true);
  };

  const goBackToEvents = () => {
    navigate('/my-events');
  };

  return (
    <div className="confirmation-modal flex flex-col items-center justify-center h-screen p-4 bg-gray-100">
      {!deleted && !cancelled ? (
        <>
          <h3 className="text-xl font-bold">Confirm Deletion</h3>
          <p>Are you sure you want to delete the event: {eventName}?</p>
          <button className="btn btn-outline btn-danger mt-2" onClick={confirmDelete}>Confirm</button>
          <button className="btn btn-outline btn-secondary mt-2" onClick={cancelDelete}>Cancel</button>
        </>
      ) : cancelled ? (
        <div>
          <h3 className="text-xl">Event was not deleted.</h3>
          <button className="btn btn-outline btn-primary mt-2" onClick={goBackToEvents}>Back to My Events</button>
        </div>
      ) : (
        <div>
          <h3 className="text-xl">Event Deleted Successfully!</h3>
          <button className="btn btn-outline btn-primary mt-2" onClick={goBackToEvents}>Back to My Events</button>
        </div>
      )}
    </div>
  );
};

export default DeleteConfirmation;
