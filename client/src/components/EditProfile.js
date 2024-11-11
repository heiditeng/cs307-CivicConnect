import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const [orgData, setOrgData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [newBio, setNewBio] = useState("");  // State to track the updated bio
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      setErrorMessage("User ID not found.");
      return;
    }

    const fetchOrgData = async () => {
      try {
        const res = await fetch(`http://localhost:5010/api/organizations/organization/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setOrgData(data);
          setNewBio(data.bio || "");  // Initialize newBio with current bio data
        } else {
          setErrorMessage("Error fetching organization data.");
        }
      } catch (error) {
        setErrorMessage("Network error: Could not fetch organization data.");
      }
    };

    fetchOrgData();
  }, [userId]);

  // Handle save changes
  const handleSaveChanges = async () => {
    if (!newBio) {
      setErrorMessage("Bio cannot be empty.");
      return;
    }

    try {
      const res = await fetch('http://localhost:5010/api/organizations/update-organization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          bio: newBio, // The updated bio
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // On success, redirect to the organization profile page
        navigate('/organization-profile');
      } else {
        setErrorMessage(data.error || "Failed to update the profile.");
      }
    } catch (error) {
      setErrorMessage("Network error: Could not update organization data.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Edit Organization Profile</h2>

        {orgData ? (
          <div>
            {/* Form to Edit Profile */}
            <div className="mb-4">
              <label htmlFor="bio" className="block text-xl font-semibold text-gray-700 mb-2">Bio:</label>
              <textarea
                id="bio"
                value={newBio}  // Track and set the updated bio
                onChange={(e) => setNewBio(e.target.value)}  // Update bio state
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows="4"
                placeholder="Tell us about your organization..."
              />
            </div>

            {/* Save Changes Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSaveChanges}
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200"
              >
                Save Changes
              </button>
            </div>

            {errorMessage && (
              <p className="text-red-500 text-sm text-center mt-4">{errorMessage}</p>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading organization data...</p>
        )}
      </div>
    </div>
  );
};

export default EditProfile;
