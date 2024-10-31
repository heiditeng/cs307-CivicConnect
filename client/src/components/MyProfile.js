import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const MyProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [mlSuggestions, setMlSuggestions] = useState("");
  const [bookmarkedEvents, setBookmarkedEvents] = useState([]); // New state for bookmarks
  const [rsvpEvents, setRsvpEvents] = useState([]); // New state for RSVPs

  useEffect(() => {
    // Fetch profile, RSVPs, and bookmarks on component mount
    const fetchProfileData = async () => {
      const username = localStorage.getItem("username");
      if (!username) {
        setErrorMessage("No username found. Please log in again.");
        return;
      }

      try {
        const profileResponse = await fetch(
          `http://localhost:5010/api/profiles/profile/${username}`
        );
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setProfileData(profileData);
          fetchMlSuggestions(profileData); // Fetch machine learning suggestions
          fetchBookmarkedEvents(username); // Fetch bookmarked events
          fetchRsvpEvents(username); // Fetch RSVP'd events
        } else {
          console.log("Profile not found, adding new profile");
          addNewProfile(username); // create new profile if not found
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setErrorMessage("Error fetching profile data");
      }
    };

    fetchProfileData();
  }, []);

  // Function to add a new profile if it doesn't exist
  const addNewProfile = async (username) => {
    try {
      const res = await fetch(
        "http://localhost:5010/api/profiles/add-member",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        }
      );

      if (res.ok) {
        const newProfile = await res.json();
        setProfileData(newProfile.member);
      } else {
        setErrorMessage("Error adding new profile");
      }
    } catch (error) {
      setErrorMessage("Error adding new profile");
    }
  };

  // Function to fetch bookmarked events
  const fetchBookmarkedEvents = async (username) => {
    try {
      const res = await fetch(`http://localhost:5010/api/profiles/${username}/bookmarks`);
      if (res.ok) {
        const data = await res.json();
        setBookmarkedEvents(data.bookmarks); // Assume response returns an array of event objects
      } else {
        console.error("Error fetching bookmarked events");
      }
    } catch (error) {
      console.error("Error fetching bookmarked events:", error);
    }
  };

  // Function to fetch RSVP'd events
  const fetchRsvpEvents = async (username) => {
    try {
      const res = await fetch(`http://localhost:5010/api/profiles/${username}/rsvpEvents`);
      if (res.ok) {
        const data = await res.json();
        setRsvpEvents(data.rsvps); // Assume response returns an array of RSVP'd event objects
      } else {
        console.error("Error fetching RSVP'd events");
      }
    } catch (error) {
      console.error("Error fetching RSVP'd events:", error);
    }
  };

  // Function to fetch machine learning suggestions
  const fetchMlSuggestions = async (profileData) => {
    try {
      const res = await fetch("http://localhost:5020/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          availability: profileData.availability,
          location: profileData.location,
          occupation: profileData.occupation,
          interests: profileData.interests,
          hobbies: profileData.hobbies,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setMlSuggestions(result.prediction);
      } else {
        console.error("Error fetching ML suggestions");
      }
    } catch (error) {
      console.error("Error fetching ML suggestions:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen p-4 bg-gray-100">
      <div className="flex flex-col md:flex-row w-full max-w-5xl gap-4">
        <div className="w-full md:w-1/3 p-6 bg-base-200 rounded-lg shadow-lg">
          <h2 className="flex items-center text-2xl font-bold mb-4">
            <span className="mr-4">
              {profileData ? `${profileData.username}'s Profile` : "Profile"}
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
                <p className="text-base text-gray-700">{profileData.username}</p>
              </div>
              <div className="mb-4">
                <p className="text-lg font-semibold">Location:</p>
                <p className="text-base text-gray-700">{profileData.location}</p>
              </div>
              <div className="mb-4">
                <p className="text-lg font-semibold">Interests & Hobbies:</p>
                <p className="text-base text-gray-700">{profileData.interests}</p>
                <p className="text-base text-gray-700">{profileData.hobbies}</p>
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
              {profileData ? `${profileData.username}'s Recommendation` : "Recommendation"}
            </h2>
            {mlSuggestions ? (
              <p className="text-base text-gray-700">We suggest: {mlSuggestions}</p>
            ) : (
              <p className="text-gray-500">Loading suggestions...</p>
            )}
          </div>

          {/* RSVP'd Events Section */}
          <div className="p-6 bg-base-100 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">RSVP'd Events</h2>
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

          {/* Bookmarked Events Section */}
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
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
