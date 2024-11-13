import React, { useState, useEffect } from 'react';
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
import ModifyEvent from './components/ModifyEvent';
import ccLogo from './ccLogo.png';
import UserTypeSelectionPage from './components/UserTypeSelection';
import SaveCredentials from './components/SaveCredentials';
import './index.css';
import CreatePost from './components/CreatePost';
import UserFeed from './components/UserFeed';
import RSVPList from './components/RSVPList';
import MyProfile from './components/MyProfile';
import NewsletterSignup from './components/NewsletterSignup';
import Subscribers from './components/Subscribers';
import EditProfile from './components/EditProfile';
import { useLocation } from 'react-router-dom';
import CommentsPage from './components/CommentsPage';
import RSVPPage from './components/RSVPPage';
import InAppCalendar from './components/InAppCalendar';
import { UserProvider } from './components/UserContext';

function AppContainer() {
  const location = useLocation();

  useEffect(() => {
    console.log('Clearing login-related localStorage items...');
    localStorage.removeItem('sessionID');
  }, [location]);

  return null;
}

function App() {
  const title = "Welcome to CivicConnect!";
  
  // State to track password change
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);

  const handleContinue = (selectedType) => {
    if (selectedType === 'User') {
      window.location.href = '/user-auth';
    } else if (selectedType === 'Organization') {
      window.location.href = '/organization-auth';
    }
  };

  return (
    <UserProvider> {/* Wrap everything in UserProvider */}
      <Router>
        <div className="App">
          <NavBar />
          <div className="content">
            <AppContainer />
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
              <Route path="/forgot-password" element={<ResetPassword onPasswordReset={() => setIsPasswordChanged(true)} />} />
              <Route path="/create-event" element={<CreateEvent />} />
              <Route path="/my-events" element={<MyEvents />} />
              <Route path="/modify-event/:id" element={<ModifyEvent />} /> 
              <Route path="/event-details/:id" element={<EventDetails />} />
              <Route path="/info-form" element={<UserInformationForm />} />
              <Route path="/myprofile" element={<MyProfile />} />
              <Route path="/profile/:userId" element={<UserProfile />} />
              <Route path="/login" element={<Login isPasswordChanged={isPasswordChanged} />} />
              <Route path="/myposts" element={<MyProfileCM />} />
              <Route path="/reset-password" element={<NewPassword />} />
              <Route path="/delete-confirmation/:id/:eventName" element={<DeleteConfirmation />} />
              <Route path="/organization-profile" element={<OrganizationProfile />} />
              <Route path="/save-credentials" element={<SaveCredentials />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/feed" element={<UserFeed />} />
              <Route path="/event/:eventId/rsvp-list" element={<RSVPList />} />
              <Route path="/newsletter" element={<NewsletterSignup />} /> 
              <Route path="/subscribers" element={<Subscribers />} />
              <Route path="/comments/:postId" element={<CommentsPage />} />
              <Route path="/rsvp-page" element={<RSVPPage />} />
              <Route path="/calendar" element={<InAppCalendar />} />
              <Route path="/edit-profile" element={<EditProfile />} />
          </Routes>
          </div>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;