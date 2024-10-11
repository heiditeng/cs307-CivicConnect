import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './NewPassword.js';

const NewPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // extract token from the URL query parameters
  const token = new URLSearchParams(location.search).get('token');

  // handle form submission
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!token) {
      setMessage('Invalid or expired token.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5010/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({token, newPassword}),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password has been reset successfully.');
        // Redirect to the login page after a short delay
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage('Error: Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-password">
      <h2 className="new-password-title">Reset Your Password</h2>
      {message && <p className="response-message">{message}</p>}
      <form className="new-password-form" onSubmit={handleResetPassword}>
        <div className="form-group">
          <label className="form-label">New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <button type="submit" className="reset-button" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default NewPassword;
