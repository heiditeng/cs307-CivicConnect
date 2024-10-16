import React, { useState, useEffect } from "react";
import MyEvents from "./MyEvents";

const OrganizationProfile = () => {
  const [orgData, setOrgData] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchOrgData = async () => {
      try {
        const res = await fetch(
          "http://localhost:5010/api/organizations/organization/Community%20Helpers" // hard coded for now, will adjust based on log-in later
        );
        if (res.ok) {
          const data = await res.json();
          setOrgData(data);
        } else {
          setErrorMessage("Error fetching organization data");
        }
      } catch (error) {
        setErrorMessage("Error fetching organization data");
      }
    };

    fetchOrgData();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen p-4 bg-gray-100">
      <div className="flex flex-col md:flex-row w-full max-w-5xl gap-4">
        {/* left side with organization bio and socials */}
        <div className="w-full md:w-1/3 p-6 bg-base-200 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">{orgData.name}</h2>
          {orgData ? (
            <div>
              <div className="mb-4">
                <p className="text-lg font-semibold">Bio:</p>
                <p className="text-base text-gray-700">{orgData.bio}</p>
              </div>
              <div className="mb-4">
                <p className="text-lg font-semibold">Socials:</p>
                {orgData.socials && (
                  <div>
                    <p>
                      <a
                        href={orgData.socials.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Facebook
                      </a>
                    </p>
                    <p>
                      <a
                        href={orgData.socials.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Twitter
                      </a>
                    </p>
                  </div>
                )}
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

        {/* right side with organization events */}
        <div className="w-full md:w-2/3 flex flex-col gap-4">
          <div className="p-6 bg-base-100 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
            {/*orgData.events ? (
              orgData.events.map((event, index) => (
                <div key={index} className="mb-2">
                  <p className="text-base text-gray-700">
                    {event.title} - {event.date}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No events available</p>
            )*/}
            <MyEvents/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationProfile;
