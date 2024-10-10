const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'civicconnect075@gmail.com',
    pass: 'qsdg tgcs azwy duqa',
  },
});

// send password reset email
async function sendPasswordResetEmail(toEmail, resetLink) {
  const mailOptions = {
    from: '"CivicConnect" <civicconnect075@gmail.com>',
    to: toEmail,
    subject: 'Password Reset Request',
    html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${toEmail}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email.');
  }
}

module.exports = {sendPasswordResetEmail};
