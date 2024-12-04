import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './NewPassword.css';

const NewPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const token = new URLSearchParams(location.search).get('token');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

    if (!token) {
      setMessage('Invalid or expired token.');
      setMessageType('error');
      setLoading(false);
      return;
    }

    if (newPassword.trim() !== confirmPassword.trim()) {
      setMessage('Passwords do not match.');
      setMessageType('error');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5010/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword, confirmPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password has been reset successfully.');
        setMessageType('success');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setMessage(`Error: ${data.error}`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage('Error: Unable to connect to the server.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-password">
      <h2 className="new-password-title">Reset Your Password</h2>
      {message && <p className={`response-message ${messageType}`}>{message}</p>}
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
        <div className="form-group">
          <label className="form-label">Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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