import React from 'react';
import { Link } from 'react-router-dom';

const MyEvents = ({ events = [], confirmDelete }) => {
  const activeEvents = events.filter(event => !event.deleted);

  console.log(events);

  return (
    <div>
      <h2>My Events</h2>
      {activeEvents.length > 0 ? (
        <ul>
          {activeEvents.map((event) => (
            <li key={event.id}>
              <h3>{event.name}</h3>
              <p>Date: {event.date}</p>
              <img src={event.imageUrl} alt={event.name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
              <Link to={`/event-details/${event.id}`}>
                <button>Show Details</button>
              </Link>
              <button onClick={() => confirmDelete(event.id, event.name)}>Delete Event</button>
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
