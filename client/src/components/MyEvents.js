import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const MyEvents = () => {
  const [eventsData, setEventsData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch user events
  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const res = await fetch("http://localhost:5010/api/events/events"); 

        if (res.ok) {
          const data = await res.json();
          setEventsData(data);
        } else {
          setErrorMessage("Error fetching events data");
        }
      } catch (error) {
        setErrorMessage("Error fetching events data");
      }
    };

    fetchMyEvents();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen p-4 bg-gray-100">
      <div className="flex flex-col w-full max-w-5xl gap-4">
        <h2 className="text-2xl font-bold mb-4">My Events</h2>

        {eventsData.length > 0 ? (
          <ul className="bg-base-200 p-6 rounded-lg shadow-lg">
            {eventsData.map((event) => (
              <li key={event.id} className="mb-4">
                <h3 className="text-xl font-semibold">{event.eventName}</h3>
                <p>Date: {event.eventDate}</p>
                <p>Zipcode: {event.eventZipcode}</p>
                {event.eventImage && (
                  <img
                    src={event.eventImage}
                    alt={event.eventName}
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  />
                )}
                <Link to={`/event-details/${event.id}`}>
                  <button className="btn btn-outline btn-primary mt-2">
                    Show Details
                  </button>
                </Link>
                <Link to={`/delete-confirmation/${event.id}/${event.eventName}`}>
                  <button className="btn btn-outline btn-danger mt-2 ml-2">
                    Delete Event
                  </button>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center">
            {errorMessage ? (
              <p className="text-error">{errorMessage}</p>
            ) : (
              <p className="text-gray-500">Loading events data...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEvents;
