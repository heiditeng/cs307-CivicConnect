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
import CreatePost from './components/'
import OrganizationProfile from './components/OrganizationProfile';
import NewPassword from './components/NewPassword';
import ccLogo from './ccLogo.png'; 
import MyEvents from './components/MyEvents';
import DeleteConfirmation from './components/DeleteConfirmation';
import CommentPage from './components/CommentPage';

function App() {
  const title = "Welcome to CivicConnect!";
  
  return (
    <Router>
      <div className='App'>
        <NavBar />
        <div className='content'>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <img src={ccLogo} alt="CivicConnect Logo" style={{ height: '100px' }} />
          </div>
          <h1 style={{ textAlign: 'center', marginBottom: '10px'}}>{title}</h1>
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
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/reset-password" element={<NewPassword />} /> 
            <Route path="/delete-confirmation" element={<DeleteConfirmation />} /> 
            <Route path="/organization-profile" element={<OrganizationProfile />} />
            <Route path="/comment-page" element={<CommentPage/>}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
