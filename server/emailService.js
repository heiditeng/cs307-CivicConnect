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

// one time password to email
async function sendOTPEmail(toEmail, otp) {
    const mailOptions = {
      from: '"Your App" <your-email@gmail.com>',
      to: toEmail,
      subject: 'Your Login OTP',
      html: `<p>Your one-time login code is: <b>${otp}</b></p>`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log(`OTP sent to ${toEmail}`);
    } catch (error) {
      console.error('Error sending OTP email:', error);
      throw new Error('Failed to send OTP email.');
    }
  }

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

// send success notification email after password reset
async function sendPasswordResetSuccessEmail(toEmail) {
    const mailOptions = {
      from: '"CivicConnect" <civicconnect075@gmail.com>',
      to: toEmail,
      subject: 'Password Reset Successful',
      html: `<p>Your password has been successfully reset. If you did not initiate this change, please contact support immediately.</p>`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Password reset success email sent to ${toEmail}`);
    } catch (error) {
      console.error('Error sending password reset success email:', error);
      throw new Error('Failed to send email.');
    }
  }

module.exports = {sendPasswordResetEmail, sendPasswordResetSuccessEmail, sendOTPEmail};
