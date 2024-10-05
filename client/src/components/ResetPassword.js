import React, { useState } from 'react';
import './ResetPassword.js';
import './ResetPassword.css';


const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5010/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('An email has been sent if the email is registered.');
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Error: Unable to connect to the server.');
    }
  };

  return (
    <div className="reset-password">
      <h2 className="reset-password-title">Reset Password</h2>
      <form className="reset-password-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <button type="submit" className="reset-button">
          Send Reset Link
        </button>
      </form>
      {message && <p className="response-message">{message}</p>}
    </div>
  );
};

export default ResetPassword;
