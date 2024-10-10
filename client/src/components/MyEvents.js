// src/components/MyEvents.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MyEvents = () => {
  const [events, setEvents] = useState([
    { id: 1, name: 'Community Cleanup', date: '2024-10-10', imageUrl: 'https://example.com/community-cleanup.jpg' },
    { id: 2, name: 'Local Concert', date: '2024-10-15', imageUrl: 'https://example.com/local-concert.jpg' },
    { id: 3, name: 'Charity Run', date: '2024-10-20', imageUrl: 'https://example.com/charity-run.jpg' },
  ]);

  const handleDelete = (id) => {
    setEvents(events.filter(event => event.id !== Number(id)));
  };

  return (
    <div>
      <h2>My Events</h2>
      {events.length > 0 ? (
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <h3>{event.name}</h3>
              <p>Date: {event.date}</p>
              <img src={event.imageUrl} alt={event.name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
              <Link to={`/event-details/${event.id}`}>
                <button>Show Details</button>
              </Link>
              <button onClick={() => handleDelete(event.id)}>Delete Event</button>
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
