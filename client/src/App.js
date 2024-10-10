// src/App.js
import React, { useState } from 'react';
import './App.css';
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

function App() {
  const title = "Welcome to CivicConnect!";
  
  const [events, setEvents] = useState([
    { id: 1, name: 'Community Cleanup', date: '2024-10-10', imageUrl: '', description: '' },
    { id: 2, name: 'Local Concert', date: '2024-10-15', imageUrl: '', description: '' },
    { id: 3, name: 'Charity Run', date: '2024-10-20', imageUrl: '', description: '' },
  ]);

  const handleDeleteEvent = (id) => {
    setEvents(events.filter(event => event.id !== Number(id)));
  };

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
            <Route path="/my-events" element={<MyEvents events={events} onDelete={handleDeleteEvent} />} />
            <Route path="/event-details/:id" element={<EventDetails onDelete={handleDeleteEvent} />} />
            <Route path="/info-form" element={<UserInformationForm />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/myprofile" element={<MyProfileCM />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
