import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./InAppCalendar.css";

const InAppCalendar = () => {
  const [bookedEvents, setBookedEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filter, setFilter] = useState("Upcoming");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); // Store the selected date for expanded view
  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!username) {
      console.log("No username provided");
      return;
    }

    const fetchRSVPEvents = async () => {
      console.log("Fetching RSVP events for user:", username);

      try {
        const res = await fetch(`http://localhost:5010/api/events/rsvp-events/${username}`);
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
          applyFilter("Upcoming", eventDates);
        } else {
          setErrorMessage("Error fetching RSVP events data");
        }
      } catch (error) {
        setErrorMessage("Error fetching RSVP events data");
      }
    };

    fetchRSVPEvents();
  }, [username]);

  const applyFilter = (filterType, events = bookedEvents) => {
    const now = new Date();
    let filtered;

    if (filterType === "Upcoming") {
      filtered = events.filter(event => event.date >= now);
    } else if (filterType === "Past") {
      filtered = events.filter(event => event.date < now);
    } else {
      filtered = events;
    }

    setFilteredEvents(filtered);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    applyFilter(newFilter);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const eventsOnDate = filteredEvents.filter(
      (event) => event.date.toDateString() === date.toDateString()
    );
    setSelectedDateEvents(eventsOnDate);
  };

  const generateTimeSlots = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      const time = `${hour.toString().padStart(2, "0")}:00 - ${hour.toString().padStart(2, "0")}:59`;
      const eventAtTime = selectedDateEvents.find(event => {
        const eventStartHour = new Date(`1970-01-01T${event.startTime}`).getHours();
        return eventStartHour === hour;
      });
      times.push({
        time,
        event: eventAtTime ? `${eventAtTime.name} (${eventAtTime.startTime} - ${eventAtTime.endTime})` : "Available"
      });
    }
    return times;
  };

  return (
    <div className="in-app-calendar-container">
      <h2 className="calendar-title">Your RSVP'd Events</h2>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button
          onClick={() => handleFilterChange("Upcoming")}
          className={filter === "Upcoming" ? "active" : ""}
        >
          Upcoming
        </button>
        <button
          onClick={() => handleFilterChange("Past")}
          className={filter === "Past" ? "active" : ""}
        >
          Past
        </button>
        <button
          onClick={() => handleFilterChange("RSVP'd")}
          className={filter === "RSVP'd" ? "active" : ""}
        >
          RSVP'd
        </button>
      </div>

      {/* Calendar Component */}
      {errorMessage && <p className="error">{errorMessage}</p>}
      <div className="calendar-wrapper">
        <Calendar
          tileClassName={({ date, view }) => {
            if (view === "month") {
              return filteredEvents.some(
                (event) => event.date.toDateString() === date.toDateString()
              )
                ? "booked"
                : null;
            }
          }}
          onClickDay={handleDateClick}
        />
      </div>

      {/* Expanded View for Selected Date */}
      {selectedDate && (
        <div className="expanded-view">
          <h3>Events for {selectedDate.toDateString()}</h3>
          <div className="time-slots">
            {generateTimeSlots().map((slot, index) => (
              <div key={index} className="time-slot">
                <strong>{slot.time}</strong>: {slot.event}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InAppCalendar;
