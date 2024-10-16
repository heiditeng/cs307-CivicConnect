import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onSwitchToSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOTP] = useState(''); // state for OTP input
  const [responseMessage, setResponseMessage] = useState('');
  const [requiresOTP, setRequiresOTP] = useState(false); // track if OTP is required
  const navigate = useNavigate(); // react router to navigate to other pages

  const handleLogin = async (e) => {
    e.preventDefault(); // prevent the page from refreshing

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
        setRequiresOTP(true); // trigger OTP input
        setResponseMessage(data.message);
      } else if (response.ok) {
        setResponseMessage(data.message);
        console.log(localStorage.token);
        localStorage.setItem('authToken', data.token); // store token in local storage
        localStorage.setItem('username', data.username);
        navigate('/myprofile'); // navigate to the homepage or another page
      } else {
        // Handle login error
        setResponseMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setResponseMessage('Error: Unable to connect to the server.');
    }
  };

  // define the missing handleOTPSubmit function
  const handleOTPSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh

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
        localStorage.setItem('authToken', data.token); // store token in local storage
        navigate('/myprofile');
      } else {
        setResponseMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setResponseMessage('Error: Unable to verify OTP.');
    }
  };

  // Handle Google login redirection
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5010/auth/google';
  };

  return (
    <div className="login">
      <h2 className="login-title">Login</h2>
      
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