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
        const res = await fetch(
          `http://localhost:5010/api/events/events/${id}`
        );

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hoursIn12Format = hours % 12 || 12;
    const amPm = hours < 12 ? "AM" : "PM";
    return `${hoursIn12Format}:${minutes} ${amPm}`;
  };

  return (
    <div className="flex justify-center items-center h-screen p-4 bg-gray-100">
      <div className="flex flex-col w-full max-w-5xl gap-4 p-6 bg-base-200 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">{eventData.name}</h2>
        {eventData.rsvpUsers.length >= eventData.maxCapacity ? (
                    <p className="text-red-500 font-bold">FULL</p>
                  ) : eventData.rsvpUsers.length >= eventData.maxCapacity * 0.75 ? (
                    <p className="text-yellow-300 font-bold">Almost full!</p>
                  ) : null}
        <p>
          <strong>Organization:</strong>{" "}
          <Link to={`/organization-profile`}>
            <span className="text-blue-600 hover:underline">
              {eventData.userId}
            </span>
          </Link>
        </p>
        <p><strong>Date:</strong> {formatDate(eventData.date)}</p>
        <p><strong>Address:</strong> {eventData.address}</p>
        <p><strong>Zip Code:</strong> {eventData.zipcode}</p>
        <p><strong>Start Time:</strong> {formatTime(eventData.startTime)}</p>
        <p><strong>End Time:</strong> {formatTime(eventData.endTime)}</p>
        <p><strong>Type:</strong> {eventData.type}</p>
        <p><strong>Description:</strong> {eventData.description}</p>
        
        {/* Images section */}
        {eventData.image && eventData.image.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Images:</h3>
            <div className="flex flex-wrap gap-4">
              {eventData.image.map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:5010/uploads/${image}`}
                  alt={`Event Image ${index + 1}`}
                  className="w-32 h-32 object-contain"
                />
              ))}
            </div>
          </div>
        )}

        {/* Videos section */}
        {eventData.video && eventData.video.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Video:</h3>
            <div className="flex flex-wrap gap-4">
              <video
                controls
                style={{ width: "100%", maxWidth: "300px", height: "auto" }}
              >
                <source
                  src={`http://localhost:5010/uploads/${eventData.video}`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}

        <div className="mt-4 flex gap-4">
          <Link to="/my-events">
            <button className="btn btn-outline btn-primary">
              Back to My Events
            </button>
          </Link>
          <Link to={`/modify-event/${id}`}>
            <button className="btn btn-outline btn-warning">
              Modify Event
            </button>
          </Link>
          <Link to={`/delete-confirmation/${id}/${eventData.name}`}>
            <button className="btn btn-outline btn-danger">Delete Event</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
