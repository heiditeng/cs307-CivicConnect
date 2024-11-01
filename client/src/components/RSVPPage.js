import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const RSVPPage = () => {
  const [rsvpEvents, setRsvpEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchRsvpEvents = async () => {
      if (!username) {
        console.error("No username found. Please log in again.");
        return;
      }

      try {
        const res = await fetch(`http://localhost:5010/api/profiles/${username}/rsvpEvents`);
        if (res.ok) {
          const data = await res.json();
          const sortedEvents = data.rsvps.sort((a, b) => new Date(a.date) - new Date(b.date));
          setRsvpEvents(sortedEvents);
        } else {
          setErrorMessage("Error fetching RSVP'd events");
        }
      } catch (error) {
        setErrorMessage("Error fetching RSVP'd events");
      } finally {
        setLoading(false);
      }
    };

    fetchRsvpEvents();
  }, [username]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="my-rsvp-page p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">My RSVPs</h1>
      {loading ? (
        <p>Loading events...</p>
      ) : errorMessage ? (
        <p className="text-error">{errorMessage}</p>
      ) : rsvpEvents.length > 0 ? (
        <div className="event-list">
          {rsvpEvents.map((event) => (
            <div key={event._id} className="p-6 bg-base-200 rounded-lg shadow-lg mb-4">
              <h2 className="text-xl font-semibold">{event.name}</h2>
              <p><strong>Date:</strong> {formatDate(event.date)}</p>
              <p><strong>Address:</strong> {event.address}</p>
              <p><strong>Zip Code:</strong> {event.zipcode}</p>
              <p><strong>Type:</strong> {event.type}</p>
              <p><strong>Description:</strong> {event.description}</p>
              
              {event.image && (
                <div className="mb-4">
                  <img
                    src={`http://localhost:5010/uploads/${event.image}`}
                    alt={event.name}
                    style={{ width: "200px", height: "200px", objectFit: "cover" }}
                  />
                </div>
              )}
              {event.video && (
                <div className="mb-4">
                  <video
                    controls
                    style={{ width: "100%", maxWidth: "600px", height: "auto" }}
                  >
                    <source
                      src={`http://localhost:5010/uploads/${event.video}`}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No RSVP'd events found.</p>
      )}
    </div>
  );
};

export default RSVPPage;
