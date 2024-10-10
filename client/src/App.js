// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import NavBar from './components/NavBar';
import AuthPage from './components/AuthPage';
import ResetPassword from './components/ResetPassword';
import EventManager from './components/EventManager';
import CreateEvent from './components/CreateEvent';
import EventDetails from './components/EventDetails';
import UserInformationForm from './components/UserInformationForm';
import UserProfile from './components/UserProfile';
import Login from './components/Login';
import MyProfileCM from './components/MyProfileCM';
import MyEvents from './components/MyEvents';
import DeleteConfirmation from './components/DeleteConfirmation'; // Import the new component

function App() {
  const title = "Welcome to CivicConnect!";
  
  return (
    <Router>
      <div className='App'>
        <NavBar />
        <div className='content'>
          <h1 className='header-title'>{title}</h1>
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/forgot-password" element={<ResetPassword />} />
            <Route path="/events" element={<EventManager />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/my-events" element={<MyEvents />} />
            <Route path="/event-details/:id" element={<EventDetails />} />
            <Route path="/info-form" element={<UserInformationForm />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/myprofile" element={<MyProfileCM />} />
            <Route path="/delete-confirmation" element={<DeleteConfirmation />} /> {/* New route */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
