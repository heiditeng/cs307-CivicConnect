import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const availabilityOptions = ["Weekdays", "Weekends"];
const occupationOptions = [
  "Student",
  "Teacher",
  "Technology",
  "Music",
  "Business",
  "Medicine",
  "Culinary",
];
const interestsOptions = [
  "Food",
  "Art",
  "Coding",
  "Instruments",
  "Finance",
  "Health",
  "Cooking",
];
const hobbiesOptions = [
  "Painting",
  "Gaming",
  "Guitar",
  "Reading",
  "Running",
  "Baking",
];

const UserInformationForm = () => {
  const [availability, setAvailability] = useState("");
  const [location, setLocation] = useState("");
  const [occupation, setOccupation] = useState("");
  const [interests, setInterests] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setErrorMessage("No user ID found. Please log in again.");
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:5010/api/profiles/profile/${userId}`
        );
        if (res.ok) {
          const data = await res.json();
          setAvailability(data.availability);
          setLocation(data.location);
          setOccupation(data.occupation);
          setInterests(data.interests);
          setHobbies(data.hobbies);
        } else {
          setErrorMessage("Error fetching profile data");
        }
      } catch (error) {
        setErrorMessage("Error fetching profile data");
      }
    };

    fetchProfileData();
  }, []);

  const handleLocationChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      // u can only type nums
      setLocation(value);
    } else {
      setErrorMessage("Please enter a valid zip code.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setErrorMessage("error");
        return;
      }

      const response = await fetch(
        "http://localhost:5010/api/profiles/update-profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId, 
            availability,
            location,
            occupation,
            interests,
            hobbies,
          }),
        }
      );

      const res = await response.json();
      if (response.ok) {
        setSuccessMessage("Profile updated successfully!");
      } else {
        setErrorMessage(res.error);
      }
    } catch (error) {
      setErrorMessage("An error occurred");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-6 bg-base-200 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Update Your Information!
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-control mb-4">
            <label className="label">Availability</label>
            <select
              className="select select-bordered w-full"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
            >
              <option value="" disabled>
                Select availability
              </option>
              {availabilityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control mb-4">
            <label className="label">Location (Zip Code)</label>
            <input
              className="input input-bordered w-full"
              type="text"
              value={location}
              onChange={handleLocationChange}
              placeholder="Enter your zip code"
            />
          </div>

          <div className="form-control mb-4">
            <label className="label">Occupation</label>
            <select
              className="select select-bordered w-full"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
            >
              <option value="" disabled>
                Select occupation
              </option>
              {occupationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control mb-4">
            <label className="label">Interests</label>
            <select
              className="select select-bordered w-full"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
            >
              <option value="" disabled>
                Select interests
              </option>
              {interestsOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control mb-4">
            <label className="label">Hobbies</label>
            <select
              className="select select-bordered w-full"
              value={hobbies}
              onChange={(e) => setHobbies(e.target.value)}
            >
              <option value="" disabled>
                Select hobbies
              </option>
              {hobbiesOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control mt-6">
            <button type="submit" className="btn btn-primary w-full">
              Update Profile
            </button>
          </div>
          <div className="form-control mt-2">
            <Link to="/myprofile">
              <button type="button" className="btn btn-secondary w-full">
                Exit
              </button>
            </Link>
          </div>

          {successMessage && (
            <div className="mt-4">
              <p className="text-center text-sm text-success">
                {successMessage}
              </p>
            </div>
          )}
          {errorMessage && (
            <div className="mt-4">
              <p className="text-center text-sm text-error">{errorMessage}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserInformationForm;