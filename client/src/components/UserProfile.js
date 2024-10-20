import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const UserProfile = () => {
  const [profileData, setProfileData] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [mlSuggestions, setMlSuggestions] = useState("");
  const routeLocation = useLocation();

  useEffect(() => {
    const fetchProfile = async () => {
      const username = localStorage.getItem("username");
      console.log(username);

      if (username) {
        try {
          const res = await fetch(
            `http://localhost:5010/api/profiles/profile/${username}`
          );
          if (res.ok) {
            const data = await res.json();
            setProfileData(data);
            fetchMlSuggestions(data);
          } else {
            // If profile is not found, create a new one
            await addNewProfile(username);
          }
        } catch (error) {
          setErrorMessage("Error fetching profile data");
        }
      } else {
        setErrorMessage("No username found. Please log in again.");
      }
    };

    const addNewProfile = async (username) => {
      try {
        const res = await fetch(
          "http://localhost:5010/api/profiles/add-member",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
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

    fetchProfile();
  }, [routeLocation]);

  const fetchMlSuggestions = async (data) => {
    try {
      const res = await fetch("http://localhost:5020/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          availability: data.availability,
          location: data.location,
          occupation: data.occupation,
          interests: data.interests,
          hobbies: data.hobbies,
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
            <span className="mr-4">{profileData.username}'s Profile</span>
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
                <p className="text-base text-gray-700">
                  {profileData.username}
                </p>
              </div>
              <div className="mb-4">
                <p className="text-lg font-semibold">Location:</p>
                <p className="text-base text-gray-700">
                  {profileData.location}
                </p>
              </div>
              <div className="mb-4">
                <p className="text-lg font-semibold">Interests & Hobbies:</p>
                <p className="text-base text-gray-700">
                  {profileData.interests}
                </p>
                <p className="text-base text-gray-700">{profileData.hobbies}</p>
              </div>
              <div className="mb-4">
                <p className="text-lg font-semibold">Upcoming/RSVP'd events:</p>
                <p className="text-base text-gray-700">
                  This will contain all upcoming event titles with hyperlinks to
                  the event post.
                </p>
              </div>
              <div className="mb-4">
              <p className="text-lg font-semibold">Attendance Rating:</p>
                <div class="rating gap-1">
                  <input
                    type="radio"
                    name="rating-3"
                    class="mask mask-heart bg-red-400"
                  />
                  <input
                    type="radio"
                    name="rating-3"
                    class="mask mask-heart bg-orange-400"
                  />
                  <input
                    type="radio"
                    name="rating-3"
                    class="mask mask-heart bg-yellow-400"
                  />
                  <input
                    type="radio"
                    name="rating-3"
                    class="mask mask-heart bg-lime-400"
                  />
                  <input
                    type="radio"
                    name="rating-3"
                    class="mask mask-heart bg-green-400"
                  />
                </div>
              </div>
              <Link to="/info-form">
                <button className="btn btn-outline btn-accent">
                  Edit Profile
                </button>
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
              {profileData.username}'s Recommendation
            </h2>
            {mlSuggestions ? (
              <p className="text-base text-gray-700">
                We suggest: {mlSuggestions}
              </p>
            ) : (
              <p className="text-gray-500">Loading suggestions...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
