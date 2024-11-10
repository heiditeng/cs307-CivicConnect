import React, { useState, useEffect } from "react";
import MyEvents from "./MyEvents";
import { useNavigate, useParams } from 'react-router-dom';

const OrganizationProfile = () => {
  const { userId } = useParams();  // Extract userId from URL
  const [orgData, setOrgData] = useState(null);  // Holds organization data
  const [errorMessage, setErrorMessage] = useState("");  // Holds error messages
  const navigate = useNavigate();

  // Fetch organization data
  useEffect(() => {
    console.log("userId:", userId);  // Log the userId to verify it's correct

    if (!userId) {
      setErrorMessage("User ID not found. Please check the URL.");
      return;
    }

    const fetchOrgData = async () => {
      try {
        const res = await fetch(`http://localhost:5010/api/organizations/organization/${userId}`);
        
        if (res.ok) {
          const data = await res.json();
          setOrgData(data);
        } else {
          setErrorMessage("Error fetching organization data.");
        }
      } catch (error) {
        setErrorMessage("Network error: Could not fetch organization data.");
      }
    };

    fetchOrgData();  // Call function to fetch data

  }, [userId]);  // Re-run effect if userId changes

  // Handle newsletter signup
  const handleNewsletterSignup = () => {
    navigate('/newsletter');  // Navigate to newsletter signup page
  };

  return (
    <div className="flex justify-center items-center h-screen p-4 bg-gray-100">
      <div className="flex flex-col md:flex-row w-full max-w-5xl gap-4">
        
        {/* Left side with organization bio */}
        <div className="w-full md:w-1/3 p-6 bg-base-200 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">
            {orgData ? orgData.name : "Organization Profile"}
          </h2>

          {orgData ? (
            <div>
              {/* Bio Section */}
              <div className="mb-4">
                <p className="text-lg font-semibold">Bio:</p>
                <p className="text-base text-gray-700">{orgData.bio || "No bio available"}</p>
              </div>

              {/* Newsletter Signup Section */}
              <div className="mb-4">
                <p className="text-lg font-semibold">Sign Up for Our Newsletter:</p>
                <button
                  onClick={handleNewsletterSignup}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Sign Up
                </button>
              </div>

              {/* Link to View Subscribers */}
              <div className="mb-4">
                <p className="text-lg font-semibold">View Newsletter Subscribers:</p>
                <button 
                  onClick={() => navigate('/subscribers')}
                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  View Subscribers
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              {errorMessage ? (
                <p className="text-error">{errorMessage}</p>
              ) : (
                <p className="text-gray-500">Loading organization data...</p>
              )}
            </div>
          )}
        </div>

        {/* Right side with organization events */}
        <div className="w-full md:w-2/3 flex flex-col gap-4">
          <div className="p-6 bg-base-100 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
            
            {orgData ? (
              <MyEvents organizationId={orgData._id} />
            ) : (
              <p className="text-gray-500">No events available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationProfile;
