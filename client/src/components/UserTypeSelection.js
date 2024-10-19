import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserTypeSelection.css';

const UserTypeSelectionPage = () => {
  const navigate = useNavigate();

  const handleSelect = (userType) => {
    if (userType === 'organization') {
      navigate('/organization-auth');
    } else {
      navigate('/user-auth');
    }
  };

  return (
    <div className="user-type-container">
      <h1 className="selection-title">Are you a User or Organization?</h1>
      <div className="selection-buttons">
        <button 
          className="selection-button organization-button" 
          onClick={() => handleSelect('organization')}
        >
          Organization
        </button>
        <button 
          className="selection-button user-button" 
          onClick={() => handleSelect('user')}
        >
          User
        </button>
      </div>
    </div>
  );
};

export default UserTypeSelectionPage;