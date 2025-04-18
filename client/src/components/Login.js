import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';

import './Login.css';

const Login = ({ onSwitchToSignup, isOrganization }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOTP] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [requiresOTP, setRequiresOTP] = useState(false);
  const [showSaveCredsPrompt, setShowSaveCredsPrompt] = useState(false);
  const [credsLoaded, setCredsLoaded] = useState(false);
  const navigate = useNavigate();
  const { setUsername: setContextUsername } = useUser();

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5010/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.message === 'OTP sent to your email.') {
        setRequiresOTP(true);
        setResponseMessage(data.message);
      } else if (response.ok) {
        // Successful login
        setResponseMessage('Login successful!');
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('isOrganization', data.isOrganization);

        setContextUsername(data.username);

        // Check if credentials have changed
        const savedUsername = localStorage.getItem('savedUsername');
        const savedPassword = localStorage.getItem('savedPassword');
        if (savedUsername !== username || savedPassword !== password) {
          // If credentials have changed, clear the old credentials and show the prompt
          localStorage.removeItem('savedUsername');
          localStorage.removeItem('savedPassword');
          setShowSaveCredsPrompt(true);
        } else {
          // If credentials match, proceed to feed
          if (localStorage.getItem('isOrganization')) {
            navigate('/my-events');
          } else {
            navigate('/feed');
          }
        }
      } else {
        // Clear saved credentials if login fails due to mismatch
        setResponseMessage(`Error: ${data.error}. Please enter your credentials manually.`);
        localStorage.removeItem('savedUsername');
        localStorage.removeItem('savedPassword');
      }
    } catch (error) {
      setResponseMessage('Error: Unable to connect to the server.');
    }
  };

  // Handle OTP submission
  const handleOTPSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5010/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setResponseMessage('Login successful');
        localStorage.setItem('authToken', data.token);
        if (localStorage.getItem('isOrganization')) {
          navigate('/my-events');
        } else {
          navigate('/feed');
        }
      } else {
        setResponseMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setResponseMessage('Error: Unable to verify OTP.');
    }
  };

  // Handle Google login
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5010/auth/google';
  };

  // Handle loading saved credentials when the button is clicked
  const handleLoadSavedCreds = () => {
    const savedUsername = localStorage.getItem('savedUsername');
    const savedPassword = localStorage.getItem('savedPassword');
    if (savedUsername && savedPassword) {
      setUsername(savedUsername);
      setPassword(savedPassword);
      setResponseMessage('Credentials loaded from storage.');
      setCredsLoaded(true);
    } else {
      setResponseMessage('No saved credentials found.');
    }
  };

  // Handle saving credentials
  const handleSaveCreds = (save) => {
    if (save) {
      localStorage.setItem('savedUsername', username);
      localStorage.setItem('savedPassword', password);
      localStorage.setItem('credsSaved', 'true');
      setResponseMessage('Credentials saved successfully!');
    } else {
      setResponseMessage('Credentials not saved.');
    }
    if (localStorage.getItem('isOrganization') === 'true') {
      navigate('/my-events');
    } else {
      navigate('/feed');
    }
  };

  // Handle username change
  const handleUsernameChange = (value) => {
    setUsername(value);
  };

  return (
    <div className="login">
      <h2>{isOrganization ? 'Organization' : 'User'} Login</h2>

      {requiresOTP ? (
        <form className="otp-form" onSubmit={handleOTPSubmit}>
          <div className="form-group">
            <label className="form-label">Enter OTP:</label>
            <input
              className="form-input"
              type="text"
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              required
            />
          </div>
          <button className="login-button" type="submit" disabled={!otp}>
            Submit OTP
          </button>
        </form>
      ) : (
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Username:</label>
            <input
              className="form-input"
              type="text"
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password:</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="login-button" type="submit">
            Login
          </button>

          <button
            className="load-creds-button"
            type="button"
            onClick={handleLoadSavedCreds}
            disabled={credsLoaded || (username && password)}
          >
            Load Saved Credentials
          </button>
        </form>
      )}

      {showSaveCredsPrompt && (
        <div className="save-creds-prompt">
          <p>Would you like to save your credentials for future logins?</p>
          <button className="save-creds-button" onClick={() => handleSaveCreds(true)}>
            Yes, Save Credentials
          </button>
          <button className="save-creds-button" onClick={() => handleSaveCreds(false)}>
            No, Do Not Save
          </button>
        </div>
      )}

      {responseMessage && <p className="response-message">{responseMessage}</p>}

      <button className="switch-button" onClick={onSwitchToSignup}>
        Don't have an account? Sign Up
      </button>

      <button
        className="forgot-password-link"
        onClick={() => navigate('/forgot-password')}
      >
        Forgot Password?
      </button>

      <button className="google-login-button" onClick={handleGoogleLogin}>
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;