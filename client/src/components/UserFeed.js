import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";

const UserFeed = () => {
  const [feedData, setFeedData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [bookmarkedEvents, setBookmarkedEvents] = useState([]);

  const fetchAllEvents = async () => {
    try {
      const res = await fetch("http://localhost:5010/api/events");

      if (res.ok) {
        const data = await res.json();
        setFeedData(data);
      } else {
        setErrorMessage("Error fetching events data");
      }
    } catch (error) {
      setErrorMessage("Error fetching events data");
    }
  };

  useEffect(() => {
    fetchAllEvents();
    fetchUserBookmarks();
  }, []);

    // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  // Handle RSVP for an event
  const handleRSVP = async (eventId) => {
    const username = localStorage.getItem("username");
    try {
      const res = await fetch(
        `http://localhost:5010/api/events/${eventId}/rsvp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
          }),
        }
      );

      if (res.ok) {
        fetchAllEvents();
        console.log("aysu");
      } else {
        setErrorMessage("Error RSVPing to the event");
      }
    } catch (error) {
      setErrorMessage("Error RSVPing to the event");
    }
  };

  // fetch user's existing bookmarks to highlight them on load
  const fetchUserBookmarks = async () => {
    const username = localStorage.getItem("username");
    try {
      const res = await fetch(`http://localhost:5010/api/profiles/${username}/bookmarks`);
      if (res.ok) {
        const data = await res.json();
        setBookmarkedEvents(data.bookmarks.map(event => event._id)); // store only event IDs
      }
    } catch (error) {
      console.error("Error fetching user bookmarks:", error);
    }
  };

  // handle bookmarking of an Event
  const handleBookmark = async (eventId) => {
    const username = localStorage.getItem("username");
    try {
      const res = await fetch(
        `http://localhost:5010/api/profiles/bookmark`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, eventId }),
        }
      );

      if (res.ok) {
        // toggle bookmark in the local state for visual feedback
        setBookmarkedEvents((prev) =>
          prev.includes(eventId)
            ? prev.filter((id) => id !== eventId)
            : [...prev, eventId]
        );
      } else {
        setErrorMessage("Error bookmarking the event");
      }
    } catch (error) {
      setErrorMessage("Error bookmarking the event");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-8 bg-gray-50">
      <div className="flex flex-col w-full max-w-5xl gap-6">
        <h2 className="text-3xl font-bold text-center mb-6 text-primary">
          Community Feed
        </h2>
        <button
          className="btn btn-outline btn-primary mb-4 self-center"
          onClick={fetchAllEvents}
        >
          Refresh Feed
        </button>

        {feedData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[600px]">
            {feedData.map((event) => (
              <div
                key={event._id}
                className="card bg-base-100 aspect-square flex flex-col justify-between relative"
              >
                <button
                  className={`absolute top-2 right-2 ${
                    bookmarkedEvents.includes(event._id) ? "text-blue-500" : "text-gray-500"
                  } hover:text-primary focus:outline-none`}
                  onClick={() => handleBookmark(event._id)}
                  aria-label="Bookmark"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="w-6 h-6"
                  >
                    <path d="M5 3a2 2 0 012-2h10a2 2 0 012 2v18l-7-3-7 3V3z" />
                  </svg>
                </button>

                <div className="card-body p-4">
                  <h3 className="card-title text-lg font-semibold text-gray-800">
                    {event.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Date: {formatDate(event.date)}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    Location: {event.location}
                  </p>
                </div>
                {event.image && (
                  <figure className="h-32 w-full overflow-hidden rounded-t-lg">
                    <img
                      src={`http://localhost:5010/uploads/${event.image}`}
                      alt={event.name}
                      className="object-cover w-full h-full"
                    />
                  </figure>
                )}
                <div className="card-actions justify-end p-4">
                  <Link to={`/event-details/${event._id}`}>
                    <button className="btn btn-primary btn-sm">
                      Show Details
                    </button>
                  </Link>
                  <button
                    className="btn btn-outline btn-success btn-sm ml-2"
                    onClick={() => handleBookmark(event._id)}
                  >
                    RSVP
                  </button>
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


export default UserFeed;
