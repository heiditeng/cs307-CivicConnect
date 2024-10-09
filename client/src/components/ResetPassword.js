import React, { useState } from 'react';
import './ResetPassword.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [resetLink, setResetLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5010/request-password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset link generated successfully.');
        setResetLink(data.resetLink); // Save the reset link from the server response
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setMessage('Error: Unable to connect to the server.');
    }
  };

  // redirecting to new link
  const handleLinkClick = () => {
    if (resetLink) {
      window.location.href = resetLink;
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
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
            Generate Reset Link
          </button>
        </form>
        {message && <p className="response-message">{message}</p>}
        {resetLink && (
          <button onClick={handleLinkClick} className="show-link-button">
            Click here for your reset link!
          </button>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
