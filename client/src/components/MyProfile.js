import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const MyProfile = () => {
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [bookmarkedEvents, setBookmarkedEvents] = useState([]);
  const [rsvpEvents, setRsvpEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [expandedNotifications, setExpandedNotifications] = useState({});
  const [newsletterSubscriptions, setNewsletterSubscriptions] = useState([]); 

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      const username = localStorage.getItem("username");
      if (!userId || !username) {
        setErrorMessage("No user ID or username found. Please log in again.");
        return;
      }

      try {
        const userResponse = await fetch(`http://localhost:5010/api/users/${userId}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserData(userData);

          if (userData.userProfile) {
            setProfileData(userData.userProfile);
            if (userData.userProfile.subscriptions) {
              setNewsletterSubscriptions(userData.userProfile.subscriptions); 
            }
          }

          fetchBookmarkedEvents(username);
          fetchRsvpEvents(username);
          fetchNotifications(userId);
        } else {
          console.error("User not found");
          setErrorMessage("User not found. Please contact support.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setErrorMessage("Error fetching user data");
      }
    };
    fetchUserData();
  }, []);

  const fetchBookmarkedEvents = async (username) => {
    try {
      const res = await fetch(`http://localhost:5010/api/profiles/${username}/bookmarks`);
      if (res.ok) {
        const data = await res.json();
        setBookmarkedEvents(data.bookmarks);
      } else {
        console.error("Error fetching bookmarked events");
      }
    } catch (error) {
      console.error("Error fetching bookmarked events:", error);
    }
  };

  const fetchRsvpEvents = async (username) => {
    try {
      const res = await fetch(`http://localhost:5010/api/profiles/${username}/rsvpEvents`);
      if (res.ok) {
        const data = await res.json();
        setRsvpEvents(data.rsvps);
      } else {
        console.error("Error fetching RSVP'd events");
      }
    } catch (error) {
      console.error("Error fetching RSVP'd events:", error);
    }
  };

  const fetchNotifications = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5010/api/notifications/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      } else {
        console.error("Error fetching notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const toggleNotification = (id) => {
    setExpandedNotifications((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="flex justify-center items-center h-screen p-4 bg-gray-100">
      <div className="flex flex-col md:flex-row w-full max-w-5xl gap-4">
        <div className="w-full md:w-1/3 p-6 bg-base-200 rounded-lg shadow-lg">
          <h2 className="flex items-center text-2xl font-bold mb-4">
            <span className="mr-4">
              {profileData ? `${userData.username}'s Profile` : "Profile"}
            </span>
            <div className="avatar">
              <div className="w-24 rounded">
                <img
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  alt="User Avatar"
                />
              </div>
            </div>
          </h2>
          {profileData ? (
            <div>
              <div className="mb-4">
                <p className="text-lg font-semibold">Username:</p>
                <p className="text-base text-gray-700">{userData.username}</p>
              </div>
              <div className="mb-4">
                <p className="text-lg font-semibold">Location:</p>
                <p className="text-base text-gray-700">{profileData.location || "Not provided"}</p>
              </div>
              <div className="mb-4">
                <p className="text-lg font-semibold">Interests & Hobbies:</p>
                <p className="text-base text-gray-700">{profileData.interests || "Not provided"}</p>
                <p className="text-base text-gray-700">{profileData.hobbies || "Not provided"}</p>
              </div>
              <Link to="/info-form">
                <button className="btn btn-outline btn-accent">Edit Profile</button>
              </Link>
            </div>
          ) : (
            <div className="text-center">
              {errorMessage ? (
                <p className="text-error">{errorMessage}</p>
              ) : (
                <p className="text-gray-500">Loading profile data...</p>
              )}
            </div>
          )}
        </div>

        <div className="w-full md:w-2/3 flex flex-col gap-4">
          <div className="p-6 bg-base-100 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              <Link to="/rsvp-page" className="text-primary hover:underline">
                RSVP'd Events
              </Link>
            </h2>
            {rsvpEvents.length > 0 ? (
              <ul>
                {rsvpEvents.map((event) => (
                  <li key={event._id} className="mb-2">
                    <Link to={`/event-details/${event._id}`} className="text-primary hover:underline">
                      {event.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No RSVP'd events found.</p>
            )}
          </div>

          <div className="p-6 bg-base-100 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Bookmarked Events</h2>
            {bookmarkedEvents.length > 0 ? (
              <ul>
                {bookmarkedEvents.map((event) => (
                  <li key={event._id} className="mb-2">
                    <Link to={`/event-details/${event._id}`} className="text-primary hover:underline">
                      {event.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No bookmarked events found.</p>
            )}
          </div>

          <div className="p-6 bg-base-100 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Notification History</h2>
            {notifications.length > 0 ? (
              <ul>
                {notifications.map((notification) => (
                  <li key={notification._id} className="mb-4">
                    <button
                      onClick={() => toggleNotification(notification._id)}
                      className="text-primary font-semibold focus:outline-none"
                    >
                      {expandedNotifications[notification._id] ? "Hide Details" : "Show Details"}
                    </button>
                    {expandedNotifications[notification._id] && (
                      <div className="mt-2">
                        <p><strong>Event:</strong> {notification.eventName}</p>
                        <p><strong>Changes:</strong> {notification.changes}</p>
                        <p><strong>Date:</strong> {new Date(notification.timestamp).toLocaleString()}</p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No notifications found.</p>
            )}
          </div>

          {/* Newsletter Subscription Section */}
          <div className="p-6 bg-base-100 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Newsletter Subscriptions</h2>
            <div>
              {newsletterSubscriptions.length > 0 ? (
                <ul>
                  {newsletterSubscriptions.map((sub, index) => (
                    <li key={index} className="mb-2">
                      <span>{sub}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Not subscribed to any newsletters yet.</p>
              )}
            </div>
            {errorMessage && <p className="text-error mt-2">{errorMessage}</p>}
          </div>

          <div className="p-6 bg-base-100 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              <Link to="/myposts" className="text-primary hover:underline">
                My Posts
              </Link>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;