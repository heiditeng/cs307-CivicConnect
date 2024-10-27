<<<<<<< main
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onSwitchToSignup, isOrganization }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOTP] = useState(''); // state for OTP input
  const [responseMessage, setResponseMessage] = useState('');
<<<<<<< main
  const [requiresOTP, setRequiresOTP] = useState(false);
  const [showSaveCredsPrompt, setShowSaveCredsPrompt] = useState(false); // for "Save Credentials" option
  const [isLoadedFromStorage, setIsLoadedFromStorage] = useState(false); // track if creds are loaded from storage
  const navigate = useNavigate();

  // populate fields with saved credentials from local storage on page load
  useEffect(() => {
    const savedUsername = localStorage.getItem('savedUsername');
    const savedPassword = localStorage.getItem('savedPassword');
    if (savedUsername && savedPassword) {
      setUsername(savedUsername);
      setPassword(savedPassword);
      setIsLoadedFromStorage(true); // Mark as loaded from storage
      setResponseMessage('Credentials loaded. Please press Login to proceed.');
    }
  }, []);


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
        // successful login
        setResponseMessage('Login successful!');
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('username', data.username);
<<<<<<< main
        localStorage.setItem('isOrganization', data.isOrganization);

        // show "Save Credentials" prompt only if not loaded from storage
        if (!isLoadedFromStorage) {
          setShowSaveCredsPrompt(true);
        } else {
          navigate('/myprofile');
        }
      } else {
        // credentials do not match, clear saved credentials and show error
        setResponseMessage(`Error: ${data.error}. Please enter your credentials manually.`);
        localStorage.removeItem('savedUsername');
        localStorage.removeItem('savedPassword');
      }
    } catch (error) {
      setResponseMessage('Error: Unable to connect to the server.');
    }
  };

  const handleSaveCreds = (save) => {
    if (save) {
      // save credentials in local storage
      localStorage.setItem('savedUsername', username);
      localStorage.setItem('savedPassword', password);
      setResponseMessage('Credentials saved successfully!');
    } else {
      setResponseMessage('Credentials not saved.');
    }

    // redirect to the profile page
    navigate('/myprofile');
  };

  // define the handleOTPSubmit function
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
        navigate('/myprofile');
      } else {
        setResponseMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setResponseMessage('Error: Unable to verify OTP.');
    }
  };

  // handle Google login redirection
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5010/auth/google';
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
              onChange={(e) => setUsername(e.target.value)}
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
        </form>
      )}

      {showSaveCredsPrompt && !isLoadedFromStorage && (
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