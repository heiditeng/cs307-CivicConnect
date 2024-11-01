import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const UserProfile = () => {
  // Extract userId from the URL using useParams
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [rsvpEvents, setRsvpEvents] = useState([]);

  useEffect(() => {
    if (!userId) {
      setErrorMessage("User ID not found. Please check the URL.");
      return;
    }

    // Fetch user data and associated profile, and RSVPs on component mount
    const fetchUserData = async () => {
      try {
        const userResponse = await fetch(`http://localhost:5010/api/users/${userId}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserData(userData);

          if (userData.userProfile) {
            setProfileData(userData.userProfile);
          }
          fetchRsvpEvents(userData.username);
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
  }, [userId]);
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
              <div className="mb-4">
                <p className="text-lg font-semibold">Attendance Rating:</p>
                <div className="rating gap-1">
                  <input type="radio" name="rating-3" className="mask mask-heart bg-red-400" />
                  <input type="radio" name="rating-3" className="mask mask-heart bg-orange-400" />
                  <input type="radio" name="rating-3" className="mask mask-heart bg-yellow-400" />
                  <input type="radio" name="rating-3" className="mask mask-heart bg-lime-400" />
                  <input type="radio" name="rating-3" className="mask mask-heart bg-green-400" />
                </div>
              </div>
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
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
