import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const EventDetails = () => {
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch individual event data by ID
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5010/api/events/events/${id}`);

        if (res.ok) {
          const data = await res.json();
          setEventData(data);
        } else {
          setErrorMessage("Error fetching event data");
        }
      } catch (error) {
        setErrorMessage("Error fetching event data");
      }
    };

    fetchEventDetails();
  }, [id]);

  if (errorMessage) {
    return <div className="text-error">{errorMessage}</div>;
  }

  if (!eventData) {
    return <div className="text-gray-500">Loading event data...</div>;
  }

  return (
    <div className="flex justify-center items-center h-screen p-4 bg-gray-100">
      <div className="flex flex-col w-full max-w-5xl gap-4 p-6 bg-base-200 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">{eventData.eventName}</h2>
        <p><strong>Date:</strong> {eventData.eventDate}</p>
        <p><strong>Start Time:</strong> {eventData.eventStartTime}</p>
        <p><strong>End Time:</strong> {eventData.eventEndTime}</p>
        <p><strong>Zipcode:</strong> {eventData.eventZipcode}</p>
        <p><strong>Description:</strong> {eventData.eventDescription}</p>
        
        {/* Image section */}
        {eventData.eventImage && (
          <div className="mb-4">
            <img
              src={`http://localhost:5010/uploads/${eventData.eventImage}`}
              alt={eventData.eventName}
              style={{ width: "200px", height: "200px", objectFit: "cover" }}
            />
          </div>
        )}

        {/* Video section */}
        {eventData.eventVideo && (
          <div className="mb-4">
            <video controls style={{ width: "100%", maxWidth: "600px", height: "auto" }}>
              <source src={`http://localhost:5010/uploads/${eventData.eventVideo}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        <div className="mt-4">
          <Link to="/my-events">
            <button className="btn btn-outline btn-primary">Back to My Events</button>
          </Link>
          <Link to={`/modify-event/${id}`}>
            <button className="btn btn-outline btn-warning mr-2">Modify Event</button>
          </Link>
          <Link to={`/delete-confirmation/${id}/${eventData.eventName}`}>
            <button className="btn btn-outline btn-danger mr-2">Delete Event</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
