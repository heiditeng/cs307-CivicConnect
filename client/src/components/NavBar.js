import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const isOrganization = localStorage.getItem('isOrganization') === 'true';

const NavBar = () => {
  return (
    <nav className="navbar">
      {/* Navbar start section */}
      <div className="navbar-start">
        <div className="dropdown">
          <button className="dropdown-btn">Menu</button>
          <div className="dropdown-content">
            <Link to="/profile">My Profile</Link>
            <Link to="/my-events">My Events</Link>
            <Link to="/">Log Out</Link>
          </div>
        </div>
      </div>

      {/* Navbar center section */}
      <div className="navbar-center">
        <p className="navbar-title">CivicConnect</p>
      </div>

      {/* Navbar end section */}
      {isOrganization && (
      <div className="navbar-end">
        <Link to="/create-event" className="create-event-btn">
          Create an Event
        </Link>
      </div>
    )}
    </nav>
  );
};

export default NavBar;