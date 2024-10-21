import React, { useState, useEffect } from 'react';
import './UserTypeSelection.css';

const UserTypeSelection = ({ onContinue }) => {
  // retrieve the previous selection from local storage, if any
  const initialUserType = localStorage.getItem('userType') || null;
  const [selectedType, setSelectedType] = useState(initialUserType);

  // save the selection to local storage whenever it changes
  useEffect(() => {
    if (selectedType) {
      localStorage.setItem('userType', selectedType);
    }
  }, [selectedType]);

  const handleSelection = (type) => {
    setSelectedType(type);
  };

  const handleContinue = () => {
    if (selectedType) {
      onContinue(selectedType);
    } else {
      alert('Please select an option before continuing.');
    }
  };

  return (
    <div className="user-type-selection">
      <h2><strong>Are you a User or Organization?</strong></h2>
      <div className="buttons">
        <button
          className={`selection-button ${selectedType === 'Organization' ? 'selected' : ''}`}
          onClick={() => handleSelection('Organization')}
        >
          Organization
        </button>
        <button
          className={`selection-button ${selectedType === 'User' ? 'selected' : ''}`}
          onClick={() => handleSelection('User')}
        >
          User
        </button>
      </div>
      <button className="continue-button" onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
};

export default UserTypeSelection;