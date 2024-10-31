import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const RSVPList = () => {
  const { eventId } = useParams();
  const [rsvpUsers, setRsvpUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    console.log("eventId from URL:", eventId); // Add this to check if eventId is being correctly extracted

    const fetchRSVPUsers = async () => {
      try {
        const res = await fetch(`http://localhost:5010/api/events/rsvp-list/${eventId}`);

        if (res.ok) {
          const data = await res.json();
          setRsvpUsers(data.rsvpUsers);
        } else {
          setErrorMessage("Error fetching RSVP list");
        }
      } catch (error) {
        setErrorMessage("Error fetching RSVP list");
      }
    };

    fetchRSVPUsers();
  }, [eventId]);

  return (
    <div className="flex justify-center items-center min-h-screen p-8 bg-gray-50">
      <div className="flex flex-col w-full max-w-5xl gap-6">
        <h2 className="text-3xl font-bold text-center mb-6 text-primary">RSVP List</h2>

        {rsvpUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rsvpUsers.map((user) => (
              <div
                key={user._id}
                className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow duration-300 aspect-square flex flex-col justify-between"
              >
                <div className="card-body p-4">
                  <h3 className="card-title text-lg font-semibold text-gray-800">{user.username}</h3>
                  <p className="text-sm text-gray-600">Attendance Rating: {user.attendanceRating || "N/A"}</p>
                  <p className="text-sm text-gray-600">Location: {user.location || "N/A"}</p>
                  <Link to={`/profile/${user._id}`} className="text-blue-600 hover:underline">
                    View Full Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            {errorMessage ? (
              <p className="text-red-600 font-semibold">{errorMessage}</p>
            ) : (
              <p className="text-gray-500">No RSVPs found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RSVPList;