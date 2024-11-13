import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  const isOrganization = localStorage.getItem('isOrganization') === 'true';
  // get curr location
  const location = useLocation(); 

  React.useEffect(() => {
    console.log('to change navbar');
  }, [location]);

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
            
            {isOrganization && (
              <Link to="/my-events">My Events</Link>
            )}

            {isOrganization && (
              <Link to="/organization-profile">My Profile</Link>
            )}
            <Link to="/">Log Out</Link>
          </div>
        </div>
      </div>

      {/* center */}
      <div className="navbar-center">
        <p className="navbar-title">CivicConnect</p>
      </div>

      {/*either create even or go to feed */}
      <div className="navbar-end">
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