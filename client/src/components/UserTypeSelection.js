import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserTypeSelection.css';

const UserTypeSelectionPage = () => {
  const [userType, setUserType] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // load previous selection from local storage
  useEffect(() => {
    const savedUserType = localStorage.getItem('userType');
    if (savedUserType) {
      setUserType(savedUserType);
    }
  }, []);

  const handleSelect = (type) => {
    setUserType(type);
    setError('');
    localStorage.setItem('userType', type); // save selection to local storage
  };

  const handleContinue = () => {
    if (!userType) {
      setError('Please select either "User" or "Organization" before continuing.');
    } else {
      navigate(userType === 'organization' ? '/organization-auth' : '/user-auth');
    }
  };

  return (
    <div className="user-type-container">
      <h1 className="selection-title">Are you a User or Organization?</h1>
      <div className="selection-buttons">
        <button
          className={`selection-button organization-button ${userType === 'organization' ? 'selected' : ''}`}
          onClick={() => handleSelect('organization')}
        >
          Organization
        </button>
        <button
          className={`selection-button user-button ${userType === 'user' ? 'selected' : ''}`}
          onClick={() => handleSelect('user')}
        >
          User
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
      <button className="continue-button" onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
};

export default UserTypeSelectionPage;