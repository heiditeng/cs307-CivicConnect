// src/components/EventDetails.js
import React from 'react';
import { useParams } from 'react-router-dom';

const EventDetails = () => {
  const { id } = useParams(); // Get the event ID from the URL

  return (
    <div>
      <h2>Event Details</h2>
      <p>Details for event ID: {id}</p>
      {/* Fetch and display actual event details based on the ID here */}
    </div>
  );
};

export default EventDetails;
