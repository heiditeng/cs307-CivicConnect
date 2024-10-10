// messages.js

const emailTemplates = {
    passwordReset: (username, resetLink) => `
      <h3>Password Reset Request</h3>
      <p>Hello ${username}!</p>
      <p>We received a request to reset your password. Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>If you did not request a password reset, please ignore this email. This link will expire in an hour.</p>
      <p>Have a nice day!</p>
    `,
    testEmail: {
      subject: 'Test Email',
      text: 'This is a test email from CivicConnect.',
    },
  };
  
  const errorMessages = {
    missingFields: 'Make sure to fill out all fields.',
    emailNotFound: 'If this email is registered, you will receive a password reset link.',
    invalidToken: 'Invalid or expired token.',
  };
  
  const successMessages = {
    emailSent: 'Test email sent successfully.',
    passwordResetSent: 'Password reset link sent successfully.',
  };
  
  module.exports = { emailTemplates, errorMessages, successMessages };
  