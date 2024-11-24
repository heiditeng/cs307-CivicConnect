import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";

const UserFeed = () => {
  const [feedData, setFeedData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [bookmarkedEvents, setBookmarkedEvents] = useState([]);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [transportationFilter, setTransportationFilter] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [recommendedKeywords, setRecommendedKeywords] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // search query state var
  const [dateQuery, setDateQuery] = useState(""); // date query 
  const [startTimeQuery, setStartTimeQuery] = useState(""); // start time
  const [endTimeQuery, setEndTimeQuery] = useState(""); // end time
  const [canCancelRSVP, setCanCancelRSVP] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (profileData) {
      fetchRecommendationsAndEvents();
    }
  }, [profileData]);

  // fetch user profile data
  const fetchUserProfile = async () => {
    const username = localStorage.getItem("userId");
    try {
      const res = await fetch(`http://localhost:5010/api/users/${username}`);
      if (res.ok) {
        const data = await res.json();
        if (data.userProfile) {
          setProfileData(data.userProfile);
        }
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // fetch recommendations based on user profile and then fetch events
  const fetchRecommendationsAndEvents = async () => {
    try {
      const res = await fetch("http://localhost:5010/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (res.ok) {
        const { keywords } = await res.json();
        setRecommendedKeywords(keywords);
        fetchAllEvents(keywords);
        fetchUserBookmarks();
      } else {
        setErrorMessage("Error fetching recommendations");
      }
    } catch (error) {
      setErrorMessage("Error fetching recommendations");
    }
  };

  // fetch all events and filter based on recommended keywords
  const fetchAllEvents = async (keywords) => {
    try {
      const res = await fetch("http://localhost:5010/api/events");

      if (res.ok) {
        let data = await res.json();

        // fetching events based on search query (if query made)
        if (searchQuery) {
          const searchLower = searchQuery.toLowerCase();
          data = data.filter((event) =>
            `${event.name} ${event.type} ${event.description} ${event.address} ${event.zipcode} ${event.date}`
              .toLowerCase()
              .includes(searchLower)
          );
        }

        // filtering events based on date, start time, and end time queries
        if (dateQuery) {
          console.log(dateQuery);
          data = data.filter((event) => event.date.startsWith(dateQuery));
        }
        if (startTimeQuery && endTimeQuery) {
          data = data.filter((event) => {
            const eventStart = event.startTime;
            const eventEnd = event.endTime;
        
            // all events in this range
            return eventStart <= endTimeQuery && eventEnd >= startTimeQuery;
          });
        } else if (startTimeQuery) {
          data = data.filter((event) => event.startTime >= startTimeQuery);
        } else if (endTimeQuery) {
          data = data.filter((event) => event.endTime <= endTimeQuery);
        }
        // filter events based on recommended keywords -- currently commented out for testing purposes
        /*if (keywords && keywords.length > 0) {
          data = data.filter((event) => {
            const combinedText =
              `${event.name} ${event.type} ${event.description}`.toLowerCase();
            return keywords.some((keyword) =>
              combinedText.includes(keyword.toLowerCase())
            );
          });
        }*/

        // filter out FULL events. commenting out for testing
        /*data = data.filter(
          (event) => event.rsvpUsers.length < event.maxCapacity
        );*/

        setFeedData(filterEventsByTransportation(data));
      } else {
        setErrorMessage("Error fetching events data");
      }
    } catch (error) {
      setErrorMessage("Error fetching events data");
    }
  };

  // fetch user's existing bookmarks to highlight them on load
  const fetchUserBookmarks = async () => {
    const username = localStorage.getItem("username");
    try {
      const res = await fetch(
        `http://localhost:5010/api/profiles/${username}/bookmarks`
      );
      if (res.ok) {
        const data = await res.json();
        setBookmarkedEvents(data.bookmarks.map((event) => event._id)); // Store only event IDs
      }
    } catch (error) {
      console.error("Error fetching user bookmarks:", error);
    }
  };

  // filter events by transportation preference
  const filterEventsByTransportation = (events) => {
    if (!transportationFilter) return events;
    return events.filter((event) => {
      if (transportationFilter === "walking") {
        return parseInt(event.zipcode, 10) === parseInt(profileData.location);
      } else if (transportationFilter === "flying") {
        return parseInt(event.zipcode, 10) !== parseInt(profileData.location);
      }
      return true;
    });
  };

  // handle transportation filter changes
  const handleTransportationFilterChange = (e) => {
    setTransportationFilter(e.target.value);
  };

  // search related functions
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDateInputChange = (e) => {
    setDateQuery(e.target.value);
  };

  const handleStartTimeInputChange = (e) => {
    setStartTimeQuery(e.target.value);
  };

  const handleEndTimeInputChange = (e) => {
    setEndTimeQuery(e.target.value);
  };

  const handleSearch = () => {
    fetchAllEvents(recommendedKeywords);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setDateQuery("");
    setStartTimeQuery("");
    setEndTimeQuery("");
    fetchAllEvents(recommendedKeywords);
  };

  // format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" };
    return new Intl.DateTimeFormat(undefined, options).format(new Date(dateString));
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
        fetchAllEvents(recommendedKeywords); // refresh events after RSVP
      } else {
        setErrorMessage("Error RSVPing to the event");
      }
    } catch (error) {
      setErrorMessage("Error RSVPing to the event");
    }
  };

  // handle bookmarking/unbookmarking of an event
  const handleBookmark = async (eventId, eventName) => {
    const username = localStorage.getItem("username");
    try {
      const res = await fetch("http://localhost:5010/api/profiles/bookmark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, eventId }),
      });

      if (res.ok) {
        const isRemoving = bookmarkedEvents.includes(eventId);
        setBookmarkedEvents((prev) =>
          isRemoving ? prev.filter((id) => id !== eventId) : [...prev, eventId]
        );

        // show confirmation message based on action
        if (isRemoving) {
          setConfirmationMessage(
            `${eventName} has been removed from your bookmarks.`
          );
        } else {
          setConfirmationMessage(
            `${eventName} has been added to your bookmarks.`
          );
        }
        setTimeout(() => setConfirmationMessage(""), 5000); // hide message after 5 seconds
      } else {
        setErrorMessage("Error updating bookmark status.");
      }
    } catch (error) {
      setErrorMessage("Error updating bookmark status.");
    }
  };

  const handleRemoveRSVP = async (eventId, eventDate, eventStartTime) => {
    const username = localStorage.getItem("username");
    if (!username) {
      setErrorMessage("User is not logged in");
      return;
    }
  
    // Calculate the time difference and check if it's within the 24-hour window
    const eventDateTime = new Date(`${formatDate(eventDate)} ${eventStartTime}`);
    const currentTime = new Date();
    const timeDifference = eventDateTime - currentTime;
  
    const cancelByDate = new Date(eventDateTime);
    cancelByDate.setHours(cancelByDate.getHours() - 24); // 24 hours before event start time
  
    if (currentTime >= cancelByDate) {
      setCanCancelRSVP(false);
      setErrorMessage("You cannot cancel your RSVP within 24 hours of the event.");
      return;
    }
  
    // Proceed with the RSVP removal if it's within the cancelable time
    try {
      const res = await fetch(
        `http://localhost:5010/api/events/${eventId}/remove-rsvp`,
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
        fetchAllEvents(recommendedKeywords); // refresh events after RSVP removal
      } else {
        setErrorMessage("Error removing RSVP from the event");
      }
    } catch (error) {
      setErrorMessage("Error removing RSVP from the event");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-8 bg-gray-50">
      <div className="flex flex-col w-full max-w-5xl gap-6">
        <h2 className="text-3xl font-bold text-center mb-6 text-primary">
          Community Feed
        </h2>
        {confirmationMessage && (
          <div className="text-center mb-4 text-green-500 font-semibold">
            {confirmationMessage}
          </div>
        )}
        <div className="flex gap-4 mb-4 items-center">
          <input
            type="text"
            className="input input-accent"
            placeholder="Search by Type, Keyword, or Location"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          <input
            type="date"
            className="input input-accent"
            value={dateQuery}
            onChange={handleDateInputChange}
          />
          <input
            type="time"
            className="input input-accent"
            value={startTimeQuery}
            onChange={handleStartTimeInputChange}
          />
          <input
            type="time"
            className="input input-accent"
            value={endTimeQuery}
            onChange={handleEndTimeInputChange}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
          <button className="btn btn-secondary" onClick={handleClearSearch}>
            Clear
          </button>
        </div>
        <button
          className="btn btn-outline btn-primary mb-4 self-center"
          onClick={() => fetchAllEvents(recommendedKeywords)}
        >
          Refresh Feed
        </button>

        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2">
            <span>Transportation Preference:</span>
            <select
              className="select select-primary"
              value={transportationFilter}
              onChange={handleTransportationFilterChange}
            >
              <option value="">None</option>
              <option value="walking">Walking/Driving</option>
              <option value="flying">Flying/Driving</option>
            </select>
          </label>
        </div>

        {feedData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[600px]">
            {feedData.map((event) => (
              <div
                key={event._id}
                className="card bg-base-100 aspect-square flex flex-col justify-between relative"
              >
                {/* Bookmark Button */}
                <button
                  className={`absolute top-2 right-2 ${
                    bookmarkedEvents.includes(event._id)
                      ? "text-blue-500"
                      : "text-gray-500"
                  } hover:text-primary focus:outline-none`}
                  onClick={() => handleBookmark(event._id, event.name)}
                  aria-label="Bookmark"
                >
                  <FontAwesomeIcon icon={faBookmark} size="lg" />
                </button>

                {/* Event Details */}
                <div className="card-body p-4">
                  <h3 className="card-title text-lg font-semibold text-gray-800">
                    {event.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Date: {formatDate(event.date)}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    Location: {event.address}
                  </p>
                  <p>Start Time: {event.startTime}</p>
                  <p>End Time: {event.endTime}</p>
                  <p>{event.type}</p>
                  <p>{event.description}</p>
                  {event.rsvpUsers.length >= event.maxCapacity * 0.75 ? (
                    <p className="text-yellow-300 font-bold">Almost full!</p>
                  ) : null}
                </div>

                {/* Event Image */}
                {event.image && (
                  <figure className="h-32 w-full overflow-hidden rounded-t-lg">
                    <img
                      src={`http://localhost:5010/uploads/${event.image}`}
                      alt={event.name}
                      className="object-cover w-full h-full"
                    />
                  </figure>
                )}

                {/* Actions: Show Details and RSVP */}
                <div className="card-actions justify-end p-4">
                  <Link to={`/event-details/${event._id}`}>
                    <button className="btn btn-primary btn-sm">
                      Show Details
                    </button>
                  </Link>
                  
                  {/* Render RSVP Button */}
                  <button
                    className={`btn btn-outline btn-sm ml-2 ${
                      event.rsvpUsers.includes(localStorage.getItem("userId"))
                        ? "btn-danger"
                        : "btn-success"
                    } ${canCancelRSVP === false && event.rsvpUsers.includes(localStorage.getItem("userId")) ? 'btn-disabled opacity-50 cursor-not-allowed' : ''}`} // Add "disabled" style
                    onClick={() => {
                      if (event.rsvpUsers.includes(localStorage.getItem("userId"))) {
                        handleRemoveRSVP(event._id, event.date, event.startTime); // Pass date and startTime
                      } else {
                        handleRSVP(event._id); // RSVP function as before
                      }
                    }}
                    disabled={canCancelRSVP === false && event.rsvpUsers.includes(localStorage.getItem("userId"))} // Disable the button if RSVP can't be canceled
                  >
                    {event.rsvpUsers.includes(localStorage.getItem("userId"))
                      ? "Un-RSVP"
                      : "RSVP"}
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
