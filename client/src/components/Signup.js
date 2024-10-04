import React, { useState } from 'react';
import './Signup.css';

const Signup = ({ onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault(); // prevent page refresh

    try {
      const response = await fetch('http://localhost:5010/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setResponseMessage(data.message);
      } else {
        setResponseMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setResponseMessage('Error: Unable to connect to the server.');
    }
  };

  return (
    <div className="signup">
      <h2 className="signup-title"> SignUp</h2>
      <form className="signup-form" onSubmit={handleSignup}>
        <div className="form-group">
          <label className='form-label'>Username:</label>
          <input
            className='form-input'
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <label className='form-label'>Password:</label>
          <input
            className='form-input'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="signup-button" type="submit">
            Sign Up</button>
      </form>
      {responseMessage && <p className="response-message">{responseMessage}</p>}
        <button className="switch-button" onClick={onSwitchToLogin}>
        Already have an account? Login
      </button>
    </div>
  );
};

export default Signup;