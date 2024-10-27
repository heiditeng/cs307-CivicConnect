import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onSwitchToSignup, isOrganization }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOTP] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [requiresOTP, setRequiresOTP] = useState(false);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [credentialsSaved, setCredentialsSaved] = useState(false);

  const navigate = useNavigate();

  // Check if credentials are saved
  useEffect(() => {
    const savedUsername = localStorage.getItem('savedUsername');
    const savedPassword = localStorage.getItem('savedPassword');
    if (savedUsername && savedPassword) {
      setCredentialsSaved(true); // Show "Load Saved Credentials" button
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
        setResponseMessage(data.message);
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('username', username);
        localStorage.setItem('isOrganization', data.isOrganization);

        // Show prompt to save credentials
        setShowSavePrompt(true);
      } else {
        setResponseMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setResponseMessage('Error: Unable to connect to the server.');
    }
  };

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

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5010/auth/google';
  };

  // Save credentials and redirect to myprofile
  const saveCredentials = () => {
    localStorage.setItem('savedUsername', username);
    localStorage.setItem('savedPassword', password);
    setShowSavePrompt(false);
    setCredentialsSaved(true);
    navigate('/myprofile'); // Redirect after saving credentials
  };

  // Load saved credentials
  const loadSavedCredentials = () => {
    const savedUsername = localStorage.getItem('savedUsername');
    const savedPassword = localStorage.getItem('savedPassword');
    if (savedUsername && savedPassword) {
      setUsername(savedUsername);
      setPassword(savedPassword);
      setResponseMessage('Credentials loaded.');
    }
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

      {responseMessage && <p className="response-message">{responseMessage}</p>}

      {showSavePrompt && (
        <div className="save-credentials-prompt">
          <p>Do you want to save your credentials for future logins?</p>
          <button onClick={saveCredentials} className="save-button">
            Yes, Save Credentials
          </button>
          <button onClick={() => setShowSavePrompt(false)} className="cancel-button">
            No, Thanks
          </button>
        </div>
      )}

      {credentialsSaved && (
        <button className="load-credentials-button" onClick={loadSavedCredentials}>
          Load Saved Credentials
        </button>
      )}

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