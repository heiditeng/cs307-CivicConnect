import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
  const isOrganization = localStorage.getItem('isOrganization') === 'true';
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchNotifications = async () => {
      const userId = localStorage.getItem("userId");
      try {
        // Fetch user data to get bookmarked events
        const userRes = await fetch(
          `http://localhost:5010/api/users/${userId}`
        );
        if (userRes.ok) {
          const userData = await userRes.json();
          const bookmarkedEventIds = userData.bookmarks;

          // Fetch notifications for bookmarked events
          const notificationsRes = await fetch(
            `http://localhost:5010/api/events/capacityNotifications/${userId}`
          );
          if (notificationsRes.ok) {
            const allNotifications = await notificationsRes.json();
            const filteredNotifications = allNotifications.filter(
              (notification) =>
                bookmarkedEventIds.includes(
                  notification.eventId
                ) /*&& notification.seen === false*/
            );

            setNotifications(filteredNotifications);
            const unread = filteredNotifications.filter(
              (notification) =>
                bookmarkedEventIds.includes(notification.eventId) &&
                notification.seen === false
            );
            setUnreadNotifications(unread);
          } else {
            console.error("Error fetching notifications");
          }
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [location]);

  // handle notification click to mark as seen
  const handleNotificationClick = async (notificationId) => {
    try {
      const response = await fetch(
        `http://localhost:5010/api/events/capacityNotifications/mark-seen/${notificationId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        // remove seen from notif list
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification._id === notificationId
              ? { ...notification, seen: true }
              : notification
          )
        );
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
            <Link to="/myprofile">My Profile</Link>
            <Link to="/calendar">My Calendar</Link>
            <Link to="/my-events">My Events</Link>
            <Link to="/">Log Out</Link>
          </div>
        </div>
      </div>

      <div className="navbar-center">
        <p className="navbar-title">CivicConnect</p>
      </div>

      <div className="navbar-end">
      {!isOrganization ? (
        <div className="dropdown">
          <button className="btn glass">
            {" "}
            Capacity Notifications ({unreadNotifications.length})
          </button>
          <div className="dropdown-content max-h-72 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div key={notification._id} className="notification-item">
                  {notification.seen === false ? (
                    <label>
                      <input
                        type="checkbox"
                        checked={notification.seen}
                        onChange={() =>
                          handleNotificationClick(notification._id)
                        }
                      />
                      {notification.message}
                    </label>
                  ) : (
                    <label>
                      <t>✓ </t>
                      <t color="red">{notification.message}</t>
                    </label>
                  )}
                </div>
              ))
            ) : (
              <p>No notifications</p>
            )}
          </div> 
        </div> ): (<p>       </p>)} 
        {isOrganization ? (
          <Link to="/create-event" className="btn glass">
            Create an Event
          </Link> ) :(
        <Link to="/feed" className="btn glass">
          Go to Feed
        </Link> )}
      </div>
    </nav>
  );
};

export default NavBar;
