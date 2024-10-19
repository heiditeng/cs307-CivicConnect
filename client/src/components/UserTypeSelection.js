import React, { useState, useEffect } from 'react';
import './UserTypeSelection.css';

const UserTypeSelection = ({ onContinue }) => {
  // get the previously saved type from local storage, if any
  const [selectedType, setSelectedType] = useState(() => {
    return localStorage.getItem('selectedType') || null;
  });

  // use effect to update local storage whenever selectedType changes
  useEffect(() => {
    if (selectedType) {
      localStorage.setItem('selectedType', selectedType);
    } else {
      localStorage.removeItem('selectedType'); // clear if deselected
    }
  }, [selectedType]);

  // handle button clicking + deselecting
  const handleSelection = (type) => {
    if (selectedType === type) {
      setSelectedType(null); 
    } else {
      setSelectedType(type); 
    }
  };

  // handle continue button
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