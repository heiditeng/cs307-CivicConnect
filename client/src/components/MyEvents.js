// src/components/MyEvents.js
import React from 'react';
import { Link } from 'react-router-dom';

const MyEvents = () => {
  // Sample data for events (replace with actual data in a real app)
  const events = [
    { id: 1, name: 'Community Cleanup', date: '2024-10-10' },
    { id: 2, name: 'Local Concert', date: '2024-10-15' },
    { id: 3, name: 'Charity Run', date: '2024-10-20' },
  ];

  return (
    <div>
      <h2>My Events</h2>
      {events.length > 0 ? (
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <h3>{event.name}</h3>
              <p>Date: {event.date}</p>
              <Link to={`/event-details/${event.id}`}>
                <button>Show Details</button>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No events found.</p>
      )}
    </div>
  );
};

export default MyEvents;
