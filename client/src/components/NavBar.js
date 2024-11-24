import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
  const isOrganization = localStorage.getItem('isOrganization') === 'true';
  const userId = localStorage.getItem('userId');
  const location = useLocation(); 

  const [capacityNotifications, setCapacityNotifications] = useState([]);
  const [unreadCapacityNotifications, setUnreadCapacityNotifications] = useState([]);
  const [eventNotifications, setEventNotifications] = useState([]);
  const [unreadEventNotifications, setUnreadEventNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Fetch capacity notifications
        const capacityRes = await fetch(
          `http://localhost:5010/api/events/capacityNotifications/${userId}`
        );
        if (capacityRes.ok) {
          const capacityData = await capacityRes.json();
          setCapacityNotifications(capacityData);
          setUnreadCapacityNotifications(capacityData.filter((n) => !n.seen));
        }

        // Fetch event creation notifications
        const eventRes = await fetch(
          `http://localhost:5010/api/events/eventCreationNotifications/${userId}`
        );
        if (eventRes.ok) {
          const eventData = await eventRes.json();
          setEventNotifications(eventData);
          setUnreadEventNotifications(eventData.filter((n) => !n.seen));
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [location, userId]);

  const handleNotificationClick = async (notificationId, type) => {
    const endpoint =
      type === "capacity"
        ? `http://localhost:5010/api/events/capacityNotifications/mark-seen/${notificationId}`
        : `http://localhost:5010/api/events/eventCreationNotifications/mark-seen/${notificationId}`;

    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        if (type === "capacity") {
          setCapacityNotifications((prev) =>
            prev.map((n) => (n._id === notificationId ? { ...n, seen: true } : n))
          );
        } else {
          setEventNotifications((prev) =>
            prev.map((n) => (n._id === notificationId ? { ...n, seen: true } : n))
          );
        }
      } else {
        console.error("Error marking notification as seen");
      }
    } catch (error) {
      console.error("Error marking notification as seen:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-start">
        <div className="dropdown">
          <button className="dropdown-btn">Menu</button>
          <div className="dropdown-content">
            {!isOrganization && (
              <>
                <Link to="/myprofile">My Profile</Link>
                <Link to="/calendar">My Calendar</Link>
              </>
            )}
            {isOrganization && <Link to="/my-events">My Events</Link>}
            {isOrganization && <Link to={`/organization-profile/${userId}`}>My Profile</Link>}
            <Link to="/">Log Out</Link>
          </div>
        </div>
      </div>

      <div className="navbar-center">
        <p className="navbar-title">CivicConnect</p>
      </div>

      <div className="navbar-end">
        {!isOrganization && (
          <div className="dropdown">
            <button className="btn glass">
              Capacity Notifications ({unreadCapacityNotifications.length})
            </button>
            <div className="dropdown-content max-h-72 overflow-y-auto">
              {capacityNotifications.length > 0 ? (
                capacityNotifications.map((n) => (
                  <div key={n._id} className="notification-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={n.seen}
                        onChange={() => handleNotificationClick(n._id, "capacity")}
                      />
                      {n.message}
                    </label>
                  </div>
                ))
              ) : (
                <p>No capacity notifications</p>
              )}
            </div>
          </div>
        )}
        <div className="dropdown">
          <button className="btn glass">
            Event Notifications ({unreadEventNotifications.length})
          </button>
          <div className="dropdown-content max-h-72 overflow-y-auto">
            {eventNotifications.length > 0 ? (
              eventNotifications.map((n) => (
                <div key={n._id} className="notification-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={n.seen}
                      onChange={() => handleNotificationClick(n._id, "eventCreation")}
                    />
                    {n.message}
                  </label>
                </div>
              ))
            ) : (
              <p>No event notifications</p>
            )}
          </div>
        </div>
        {isOrganization ? (
          <Link to="/create-event" className="btn glass">
            Create an Event
          </Link>
        ) : (
          <Link to="/feed" className="btn glass">
            Go to Feed
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
