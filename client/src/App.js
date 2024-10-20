import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import NavBar from './components/NavBar';
import AuthPage from './components/AuthPage';
import ResetPassword from './components/ResetPassword';
import CreateEvent from './components/CreateEvent';
import EventDetails from './components/EventDetails';
import UserInformationForm from './components/UserInformationForm';
import UserProfile from './components/UserProfile';
import Login from './components/Login';
import MyProfileCM from './components/MyProfileCM';
import OrganizationProfile from './components/OrganizationProfile';
import NewPassword from './components/NewPassword';
import MyEvents from './components/MyEvents';
import DeleteConfirmation from './components/DeleteConfirmation';
import ccLogo from './ccLogo.png'; 
import UserTypeSelectionPage from './components/UserTypeSelection';

function App() {
  const [selectedType, setSelectedType] = useState(null);

  const handleContinue = (type) => {
    setSelectedType(type);
  };

  return (
    <Router>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        padding: '20px',
      }}>
        <NavBar />
        <img 
          src={ccLogo} 
          alt="CivicConnect Logo" 
          style={{ 
            height: '100px', 
            width: 'auto', 
            marginTop: '10px', 
            marginBottom: '10px',
          }} 
        />
        {selectedType ? ( // If a type is selected, show the login form
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '10px',
          }}>
            <AuthPage isOrganization={selectedType === 'Organization'} />
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '20px',
          }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '20px'
            }}>Welcome to CivicConnect!</h1>
            <UserTypeSelectionPage onContinue={handleContinue} />
          </div>
        )}
        <Routes>
          <Route path="/forgot-password" element={<ResetPassword />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/my-events" element={<MyEvents />} />
          <Route path="/event-details/:id" element={<EventDetails />} />
          <Route path="/info-form" element={<UserInformationForm />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/myprofile" element={<MyProfileCM />} />
          <Route path="/reset-password" element={<NewPassword />} /> 
          <Route path="/delete-confirmation/:id/:eventName" element={<DeleteConfirmation />} />
          <Route path="/organization-profile" element={<OrganizationProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;