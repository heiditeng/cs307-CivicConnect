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
    <div className="flex justify-center items-center min-h-screen p-8 bg-gray-50">
      <div className="flex flex-col w-full max-w-5xl gap-6">
        <h2 className="text-3xl font-bold text-center mb-6 text-primary">My Events</h2>

        {eventsData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventsData.map((event) => (
              <div
                key={event.id}
                className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow duration-300 aspect-square flex flex-col justify-between"
              >
                <div className="card-body p-4">
                  <h3 className="card-title text-lg font-semibold text-gray-800">{event.eventName}</h3>
                  <p className="text-sm text-gray-600">Date: {event.eventDate}</p>
                  <p className="text-sm text-gray-600 mb-3">Zipcode: {event.eventZipcode}</p>
                </div>
                {event.eventImage && (
                  <figure className="h-32 w-full overflow-hidden rounded-t-lg">
                    <img
                      src={`http://localhost:5010/uploads/${event.eventImage}`}
                      alt={event.eventName}
                      className="object-cover w-full h-full"
                    />
                  </figure>
                )}
                <div className="card-actions justify-end p-4">
                  <Link to={`/event-details/${event.id}`}>
                    <button className="btn btn-primary btn-sm">Show Details</button>
                  </Link>
                  <Link to={`/delete-confirmation/${event.id}/${event.eventName}`}>
                    <button className="btn btn-error btn-sm ml-2">Delete Event</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            {errorMessage ? (
              <p className="text-red-600 font-semibold">{errorMessage}</p>
            ) : (
              <p className="text-gray-500">No events found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEvents;
