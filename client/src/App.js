import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // navigation between pages
import NavBar from './components/NavBar';
import AuthPage from './components/AuthPage';
import ResetPassword from './components/ResetPassword';
import CreateEvent from './components/CreateEvent';
import MyEvents from './components/MyEvents';
import EventDetails from './components/EventDetails';

function App() {

  const title = "Welcome to CivicConnect!";
  // const users = 0;
  return (
    <Router>
    <div className='App'>
      <NavBar />
      <div className='content'>
        <h1 style={{ textAlign: 'center', marginBottom: '20px'}}>{title}</h1>
        <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/forgot-password" element={<ResetPassword />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/my-events" element={<MyEvents />} />
            <Route path="/event-details/:id" element={<EventDetails />} />
        </Routes>
      </div>
    </div>
    </Router>
  );
}

export default App