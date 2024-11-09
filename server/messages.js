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
    eventModification: (username, eventName, updatedEvent, eventLink) => `
        <h2>Event Update Notification</h2>
        <p>Dear ${username},</p>
        <p>The event <strong>${eventName}</strong> that you RSVP'd to has been updated. Here are the latest details:</p>
        <ul>
            <li>Date: ${updatedEvent.date}</li>
            <li>Time: ${updatedEvent.startTime} - ${updatedEvent.endTime}</li>
            <li>Location: ${updatedEvent.address}, ${updatedEvent.zipcode}</li>
            <li>Description: ${updatedEvent.description}</li>
        </ul>
        <p>You can view the full event details here: <a href="${eventLink}">View Event</a></p>
        <p>Thank you for staying engaged with us!</p>
        <p>Best regards,<br>CivicConnect Team</p>
    `,
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
  