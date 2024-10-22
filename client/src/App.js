import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
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
import ModifyEvent from './components/ModifyEvent';
import ccLogo from './ccLogo.png';
import UserTypeSelectionPage from './components/UserTypeSelection';
import SaveCredentials from './components/SaveCredentials';
import './index.css';

function App() {
  const title = "Welcome to CivicConnect!";

  const handleContinue = (selectedType) => {
    if (selectedType === 'User') {
      window.location.href = '/user-auth';
    } else if (selectedType === 'Organization') {
      window.location.href = '/organization-auth';
    }
  };

  return (
    <Router>
      <div className="App">
        <NavBar />
        <div className="content">
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', marginBottom: '30px' }}>
            <img src={ccLogo} alt="CivicConnect Logo" style={{ height: '100px' }} />
          </div>
          <h1 style={{ textAlign: 'center', marginTop: '30px', marginBottom: '10px', fontWeight: 'bold', fontSize: '2em' }}>
            {title}
          </h1>
          <Routes>
            <Route path="/" element={<UserTypeSelectionPage onContinue={handleContinue} />} />
            <Route path="/user-auth" element={<AuthPage isOrganization={false} />} />
            <Route path="/organization-auth" element={<AuthPage isOrganization={true} />} />
            <Route path="/forgot-password" element={<ResetPassword />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/my-events" element={<MyEvents />} />
            <Route path="/modify-event/:id" element={<ModifyEvent />} /> 
            <Route path="/event-details/:id" element={<EventDetails />} />
            <Route path="/info-form" element={<UserInformationForm />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/myprofile" element={<MyProfileCM />} />
            <Route path="/reset-password" element={<NewPassword />} />
            <Route path="/delete-confirmation/:id/:eventName" element={<DeleteConfirmation />} />
            <Route path="/organization-profile" element={<OrganizationProfile />} />
            <Route path="/save-credentials" element={<SaveCredentials />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;