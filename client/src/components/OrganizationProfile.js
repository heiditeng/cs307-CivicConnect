import React, { useState, useEffect } from "react";
import MyEvents from "./MyEvents";
import { useParams, useNavigate } from 'react-router-dom';

const OrganizationProfile = () => {
  const { userId } = useParams(); // Get userId from URL parameters
  const isOrganization = localStorage.getItem("isOrganization") === 'true'; // Check if the user is an organization
  const [orgData, setOrgData] = useState(null);  // Holds organization data
  const [subscribers, setSubscribers] = useState([]);  // Holds list of subscribers
  const [errorMessage, setErrorMessage] = useState("");  // Holds error messages
  const navigate = useNavigate();

  // Fetch organization data on mount
  useEffect(() => {
    console.log("checking userId:", userId);

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

          // Fetch subscribers as well
          const subscriberRes = await fetch(`http://localhost:5010/api/organizations/subscribers/${userId}`);
          if (subscriberRes.ok) {
            const subscriberData = await subscriberRes.json();
            setSubscribers(subscriberData.subscribers);
          } else {
            setErrorMessage("Error fetching subscribers.");
          }

        } else {
          setErrorMessage("Error fetching organization data.");
        }
      } catch (error) {
        setErrorMessage("Network error: Could not fetch organization data.");
      }
    };

    fetchOrgData();  // Fetch organization data on component mount
  }, [userId]);

  // Handle newsletter signup
  const handleNewsletterSignup = () => {
    navigate('/newsletter');  // Navigate to newsletter signup page
  };

  // Handle Edit Profile
  const handleEditProfile = () => {
    navigate('/edit-profile'); // Navigate to edit profile page (you need to create this route)
  };

  return (
    <div className="flex justify-center items-start min-h-screen p-4 bg-gray-100">
      <div className="flex flex-col md:flex-row w-full max-w-6xl gap-6">
        
        {/* Left side with organization details */}
        <div className="w-full md:w-1/4 p-4 bg-base-200 rounded-lg shadow-md">
          <h2 className="text-4xl font-semibold mb-4 text-l">
            {orgData ? orgData.username || "Organization Profile" : "Loading..."}
          </h2>

          {orgData ? (
            <div>
              {/* Bio Section */}
              <div className="mb-4">
                <p className="text-lg font-semibold">Bio:</p>
                <p className="text-base text-gray-700">{orgData.bio || "No bio available"}</p>
              </div>

              {/* Newsletter Signup Section (only show if not an organization) */}
              {!isOrganization && (
                <div className="mb-4">
                  <p className="text-lg font-semibold">Sign Up for Our Newsletter:</p>
                  <button
                    onClick={handleNewsletterSignup}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {/* View Subscribers Section (only show if an organization) */}
              {isOrganization && (
                <div className="mb-4">
                  <p className="text-lg font-semibold">Newsletter Subscribers:</p>
                  <ul className="mt-2">
                    {subscribers.length > 0 ? (
                      subscribers.map((subscriber, index) => (
                        <li key={index} className="mb-2 p-2 border-b border-gray-300">
                          <strong>{subscriber.name}</strong>: {subscriber.email}
                        </li>
                      ))
                    ) : (
                      <li>No subscribers found.</li>
                    )}
                  </ul>
                </div>
              )}

              {/* Edit Profile Button (only show if it is an organization) */}
              {isOrganization && (
                <div className="mb-4">
                  <button
                    onClick={handleEditProfile}
                    className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
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

        {/* Right side with organization events (only show for organizations) */}
        {isOrganization && (
          <div className="w-full md:w-3/4 p-4 bg-base-100 rounded-lg shadow-md">
            <div className="p-4">
              {orgData ? (
                <MyEvents organizationId={orgData._id} />
              ) : (
                <p className="text-gray-500">No events available.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationProfile;
