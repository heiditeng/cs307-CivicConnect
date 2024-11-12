import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./InAppCalendar.css";

const InAppCalendar = () => {
  const [bookedEvents, setBookedEvents] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const username = localStorage.getItem("username"); // Retrieve username from localStorage

  useEffect(() => {
    if (!username) {
      console.log("No username provided");
      return;
    }

    const fetchRSVPEvents = async () => {
      console.log("Fetching RSVP events for user:", username);

      try {
        // Fetch RSVP events specific to the user
        const res = await fetch(
          `http://localhost:5010/api/events/rsvp-events/${username}`
        );

        console.log("Response status:", res.status);

        if (res.ok) {
          const data = await res.json();
          const eventDates = data.rsvpEvents.map((event) => ({
            date: new Date(event.date),
            name: event.name,
            startTime: event.startTime,
            endTime: event.endTime,
          }));
          setBookedEvents(eventDates);
        } else {
          setErrorMessage("Error fetching RSVP events data");
        }
      } catch (error) {
        setErrorMessage("Error fetching RSVP events data");
      }
    };

    fetchRSVPEvents();
  }, [username]);

  return (
    <div className="in-app-calendar-container">
      <div className="calendar-wrapper">
        <h2 className="text-center">Your RSVP'd Events</h2>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <Calendar
          tileClassName={({ date, view }) => {
            if (view === "month") {
              return bookedEvents.some(
                (event) => event.date.toDateString() === date.toDateString()
              )
                ? "booked"
                : null;
            }
          }}
          onClickDay={(date) => {
            const eventsOnDate = bookedEvents.filter(
              (event) => event.date.toDateString() === date.toDateString()
            );
            if (eventsOnDate.length > 0) {
              alert(
                eventsOnDate
                  .map(
                    (event) =>
                      `${event.name}: ${event.startTime} - ${event.endTime}`
                  )
                  .join("\n")
              );
            } else {
              alert("No events on this date");
            }
          }}
        />
      </div>
    </div>
  );
};

export default InAppCalendar;