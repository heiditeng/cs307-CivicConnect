import React from 'react';
import './MyProfileCM.css';

const Profile = () => {
  return (
    <div className="profile-page">
      {/* Profile Header */}
      <h1>My Profile</h1>

      {/* Bottom bar with the Create Post button */}
      <div className="bottom-bar">
        <button className="create-post-button">Create Post</button>
      </div>
    </div>
  );
};

export default MyProfileCM;