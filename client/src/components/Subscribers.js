import React, { useEffect, useState } from 'react';

const Subscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const res = await fetch('http://localhost:5010/api/newsletter/subscribers'); // Replace with your API endpoint
        if (res.ok) {
          const data = await res.json();
          setSubscribers(data);
        } else {
          setErrorMessage('Error fetching subscribers');
        }
      } catch (error) {
        setErrorMessage('Error fetching subscribers');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen p-6 bg-gray-100">
      <div className="bg-base-100 rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Newsletter Subscribers</h2>
        {loading ? (
          <p className="text-gray-500 text-center">Loading subscribers...</p>
        ) : (
          <>
            {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
            {subscribers.length > 0 ? (
              <ul className="list-disc list-inside">
                {subscribers.map((subscriber, index) => (
                  <li key={index} className="mb-2 text-center">
                    {subscriber.name} - {subscriber.email}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center">No subscribers found.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Subscribers;
