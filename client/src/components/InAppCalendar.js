import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './InAppCalendar.css';

const InAppCalendar = () => {
    const [bookedEvents, setBookedEvents] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const fetchRSVPEvents = async () => {
            try {
                const res = await fetch(`http://localhost:5010/api/events/rsvp-events`);
                if (res.ok) {
                    const data = await res.json();
                    // Assuming each event has 'date', 'startTime', and 'endTime' fields
                    const eventsWithDates = data.map(event => ({
                        date: new Date(event.date),
                        name: event.name,
                        startTime: event.startTime,
                        endTime: event.endTime,
                    }));
                    setBookedEvents(eventsWithDates);
                } else {
                    setErrorMessage("Error fetching RSVP events");
                }
            } catch (error) {
                setErrorMessage("Error fetching RSVP events");
            }
        };

        fetchRSVPEvents();
    }, []);

    // Function to highlight dates that have events
    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            return bookedEvents.some(event =>
                event.date.toDateString() === date.toDateString()
            )
                ? 'booked'
                : null;
        }
    };

    // Handle displaying event details when a date is clicked
    const handleDateClick = (date) => {
        const eventsOnDate = bookedEvents.filter(
            event => event.date.toDateString() === date.toDateString()
        );

        if (eventsOnDate.length > 0) {
            alert(
                eventsOnDate.map(event => 
                    `${event.name}: ${event.startTime} - ${event.endTime}`
                ).join("\n")
            );
        } else {
            alert("No events on this date");
        }
    };

    return (
        <div className="in-app-calendar">
            <h2>Your Booked Events</h2>
            {errorMessage && <p className="error">{errorMessage}</p>}
            <Calendar
                tileClassName={tileClassName}
                onClickDay={handleDateClick}
            />
        </div>
    );
};

export default InAppCalendar;
