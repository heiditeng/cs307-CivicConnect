import React, { useState, useEffect } from 'react';
import './UserTypeSelection.css';

const UserTypeSelection = ({ onContinue }) => {
  const [selectedType, setSelectedType] = useState(null);

  // Set initial state from localStorage when the component mounts
  useEffect(() => {
    const savedType = localStorage.getItem('userType');
    if (savedType) {
      setSelectedType(savedType);
    }
  }, []); // Empty dependency array ensures this runs only once

  // Save the selection to localStorage whenever it changes
   useEffect(() => {
    if (selectedType) {
      localStorage.setItem('userType', selectedType);
    } else {
      localStorage.removeItem('userType'); // Clear if no selection
    }
  }, [selectedType]);

  // Handle the selection button click
  const handleSelection = (type) => {
    // toggle selection if the same button is clicked
    setSelectedType((prevType) => (prevType === type ? null : type));
  };

  // Handle the continue button click
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