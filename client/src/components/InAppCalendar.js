import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { DateTime } from "luxon";
import "react-calendar/dist/Calendar.css";
import "./InAppCalendar.css";

const InAppCalendar = () => {
  const [bookedEvents, setBookedEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filter, setFilter] = useState("RSVP'd");
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchResultMessage, setSearchResultMessage] = useState("");
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [foundEventDate, setFoundEventDate] = useState(null);
  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!username) {
      console.log("No username provided");
      return;
    }

    const fetchRSVPEvents = async () => {
      try {
        const res = await fetch(`http://localhost:5010/api/events/rsvp-events/${username}`);
        if (res.ok) {
          const data = await res.json();
          console.log("Fetched events:", data);
    
          const eventDates = data.rsvpEvents.map((event) => {
            console.log("Processing event:", event);
    
            const { date, time: startTime } = adjustToESTIfNeeded(event.date, event.startTime, event.address);
            const { time: endTime } = adjustToESTIfNeeded(event.date, event.endTime, event.address);
    
            const normalizedDate = new Date(`${date}T00:00:00Z`);
    
            return {
              date: normalizedDate,
              name: event.name,
              startTime,
              endTime,
              location: event.address,
            };
          });
    
          setBookedEvents(eventDates);
          applyFilter("RSVP'd", eventDates);
        } else {
          console.error("Failed to fetch events:", await res.text());
          setErrorMessage("Error fetching RSVP events data");
        }
      } catch (error) {
        console.error("Fetch error:", error.message);
        setErrorMessage("Error fetching RSVP events data");
      }
    };    
    fetchRSVPEvents();
  }, [username]);

  const timeZoneMap = {
    "Santa Monica, CA, USA": "America/Los_Angeles",
    "New York, NY, USA": "America/New_York",
    "Miami, FL, USA": "America/New_York",
    "Chicago, IL, USA": "America/Chicago",
    "Denver, CO, USA": "America/Denver",
    "Seattle, WA, USA": "America/Los_Angeles",
  };

  const adjustToESTIfNeeded = (dateString, timeString, address) => {
    console.log("DateString:", dateString);
    console.log("TimeString:", timeString);
    console.log("Original Address:", address);
  
    try {
      const timeZone = timeZoneMap[address] || "America/Los_Angeles";
      console.log("Mapped TimeZone:", timeZone);
  
      // Parse the date as UTC first if it has a `Z` or is ISO
      const baseDate = DateTime.fromISO(dateString, { zone: "utc" });
  
      if (!baseDate.isValid) {
        throw new Error(`Invalid Base Date: ${baseDate}`);
      }
  
      console.log("Base Date (UTC):", baseDate.toString());
  
      // combine the base date with the time string in the specified time zone
      const localDateTime = DateTime.fromISO(
        `${baseDate.toISODate()}T${timeString}`,
        { zone: timeZone }
      );
  
      if (!localDateTime.isValid) {
        throw new Error(`Invalid Local DateTime: ${localDateTime}`);
      }
  
      console.log("Parsed Local DateTime:", localDateTime.toString());
  
      // convert to EST
      const estDateTime = localDateTime.setZone("America/New_York");
      console.log("Converted to EST DateTime:", estDateTime.toString());
  
      // format the date and time
      const formattedDate = estDateTime.toISODate(); // YYYY-MM-DD
      const formattedTime = estDateTime.toFormat("HH:mm"); // HH:mm
  
      console.log("Final Adjusted DateTime:", { formattedDate, formattedTime });
      return { date: formattedDate, time: formattedTime };
    } catch (error) {
      console.error("Error adjusting time:", error.message);
      return { date: "Invalid date", time: "Invalid time" };
    }
  };  

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

  const handleSearch = () => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const dateQuery = new Date(searchQuery);
    const isValidDate = !isNaN(dateQuery.getTime());

    const searchedEvents = bookedEvents.filter(event => {
      if (isValidDate) {
        return event.date.toDateString() === dateQuery.toDateString();
      } else {
        return event.name.toLowerCase().includes(lowerCaseQuery);
      }
    });

    setFilteredEvents(searchedEvents);

    if (searchedEvents.length > 0) {
      setSearchResultMessage("Event found!");
      setFoundEventDate(isValidDate ? dateQuery : searchedEvents[0].date);
    } else {
      setSearchResultMessage("No event found!");
      setFoundEventDate(null);
    }

    if (isValidDate && searchedEvents.length > 0) {
      setSelectedDate(dateQuery);
      setSelectedDateEvents(searchedEvents);
    } else {
      setSelectedDate(null);
      setSelectedDateEvents([]);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    
    // match events for the selected date
    const eventsOnDate = filteredEvents.filter((event) => {
    const eventDate = event.date.toISOString().split("T")[0];
    const clickedDate = date.toISOString().split("T")[0];
    return eventDate === clickedDate;
    });
    
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
        event: eventAtTime
          ? <span className="event">{eventAtTime.name} ({eventAtTime.startTime} - {eventAtTime.endTime})</span>
          : <span className="event-available">Available</span>
      });
    }
    return times;
  };

  return (
    <div className="in-app-calendar-container">
      <h2 className="calendar-title">Your RSVP'd Events</h2>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by event name or date (e.g., '2024-11-12')"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>

      {searchResultMessage && (
        <div className={`search-result-message ${searchResultMessage === "Event found!" ? 'success' : 'error'}`}>
          {searchResultMessage}
        </div>
      )}

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

      {errorMessage && <p className="error">{errorMessage}</p>}
      <div className="calendar-wrapper">
        <Calendar
          tileClassName={({ date, view }) => {
            if (view === "month") {
              // check if the `date` matches any event date
              const isBooked = filteredEvents.some((event) => {
                const eventDate = event.date.toISOString().split("T")[0];
                const calendarDate = date.toISOString().split("T")[0];
                return eventDate === calendarDate;
              });
          
              return isBooked ? "booked" : null;
            }
          }}          
          onClickDay={handleDateClick}
        />
      </div>

      {selectedDate && (
        <div className="expanded-view">
          <h3>Events for {selectedDate.toDateString()}</h3>
          <div className="time-slots">
            {generateTimeSlots().map((slot, index) => (
              <div key={index} className="time-slot">
                <span className="time">{slot.time}</span>
                <span>{slot.event}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InAppCalendar;