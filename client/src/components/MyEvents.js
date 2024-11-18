import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const MyEvents = () => {
  const [eventsData, setEventsData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const userId = localStorage.getItem("username");

  useEffect(() => {
    if (!userId) {
      console.log("No userId provided");
      return;
    }

    const fetchAllEvents = async () => {
      console.log("Fetching events for user:", userId);
      try {
        const res = await fetch(`http://localhost:5010/api/events`);

        console.log("Response status:", res.status);

        if (res.ok) {
          const data = await res.json();

          // Filter events by userId
          const userEvents = data.filter((event) => event.userId === userId);
          setEventsData(userEvents);
        } else {
          setErrorMessage("Error fetching events data");
        }
      } catch (error) {
        setErrorMessage("Error fetching events data");
      }
    };

    fetchAllEvents();
  }, [userId]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-8 bg-gray-50">
      <div className="flex flex-col w-full max-w-5xl gap-6">
        <h2 className="text-3xl font-bold text-center mb-6 text-primary">
          <span className="font-extrabold">My Events</span>
        </h2>

        {eventsData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventsData.map((event) => (
              <div
                key={event._id}
                className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden"
              >
                {event.thumbnailImage && (
                  <figure className="h-48 w-full overflow-hidden">
                    <img
                      src={`http://localhost:5010/uploads/${event.thumbnailImage}`}
                      alt={event.name}
                      className="object-cover w-full h-full"
                    />
                  </figure>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {event.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    <strong>Organization:</strong>{" "}
                    <Link to={`/organization-profile/${event.userId}`}>
                      <strong className="text-blue-600 hover:underline">
                        {event.userId}
                      </strong>
                    </Link>
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Date:</strong> {formatDate(event.date)}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Zip Code:</strong> {event.zipcode}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    <strong>RSVPs:</strong> {event.rsvpUsers ? event.rsvpUsers.length : 0}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    <strong>Bookmarks:</strong> {event.bookmarkUsers ? event.bookmarkUsers.length : 0}
                  </p>
                  {event.rsvpUsers.length >= event.maxCapacity ? (
                    <p className="text-red-500 font-bold">FULL</p>
                  ) : event.rsvpUsers.length >= event.maxCapacity * 0.75 ? (
                    <p className="text-yellow-300 font-bold">Almost full!</p>
                  ) : null}
                  <Link
                    to={`/event/${event._id}/rsvp-list`}
                    className="text-blue-600 hover:underline mb-2 block"
                  >
                    View RSVP List
                  </Link>
                  {/* Button Section with Flexbox Layout */}
                  <div className="flex justify-between items-center space-x-2">
                    <Link to={`/event-details/${event._id}`}>
                      <button className="btn btn-primary btn-sm">Details</button>
                    </Link>
                    <Link to={`/modify-event/${event._id}`}>
                      <button className="btn btn-secondary btn-sm">Modify</button>
                    </Link>
                    <Link to={`/delete-confirmation/${event._id}/${event.name}`}>
                      <button className="btn btn-error btn-sm">Delete</button>
                    </Link>
                  </div>
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
