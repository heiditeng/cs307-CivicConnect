import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MyEvents from './MyEvents';
import CreateEvent from './CreateEvent';

const EventManager = () => {
    const [events, setEvents] = useState([
      { id: 1, name: 'Community Cleanup', date: '2024-10-10', imageUrl: 'https://example.com/community-cleanup.jpg', deleted: false },
      { id: 2, name: 'Local Concert', date: '2024-10-15', imageUrl: 'https://example.com/local-concert.jpg', deleted: false },
      { id: 3, name: 'Charity Run', date: '2024-10-20', imageUrl: 'https://example.com/charity-run.jpg', deleted: false },
    ]);

    const navigate = useNavigate();

    const addEvent = (event) => {
      setEvents((prevEvents) => [...prevEvents, { ...event, deleted: false }]);
    };

    const handleDelete = (id) => {
      setEvents((prevEvents) => prevEvents.map(event => 
        event.id === id ? { ...event, deleted: true } : event
      ));
    };

    const confirmDelete = (id, name) => {
        navigate('/delete-confirmation', { state: { eventId: id, eventName: name } });
    };

    return (
      <div>
        <CreateEvent addEvent={addEvent} />
        <MyEvents events={events} confirmDelete={confirmDelete} />
      </div>
    );
};

export default EventManager;
