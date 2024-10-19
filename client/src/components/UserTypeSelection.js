import React, { useState } from 'react';
import './UserTypeSelection.css';

const UserTypeSelection = ({ onContinue }) => {
  const [selectedType, setSelectedType] = useState(null);

  // button clicking + deselecting
  const handleSelection = (type) => {
    if (selectedType === type) {
      setSelectedType(null); 
    } else {
      setSelectedType(type); 
    }
  };

  // need to choose button otw error
  const handleContinue = () => {
    if (selectedType) {
      onContinue(selectedType); 
    } else {
      alert('Please select an option before continuing.');
    }
  };

  return (
    <div className="user-type-selection">
      <h2>Are you a User or Organization?</h2>
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
