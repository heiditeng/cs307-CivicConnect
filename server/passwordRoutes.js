const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {users} = require('./googleAuth');
const { emailTemplates, errorMessages, successMessages } = require('./messages');
const {sendPasswordResetEmail, sendPasswordResetSuccessEmail} = require('./emailService'); // import the email service from emailService.js

const router = express.Router();
const secretKey = 'key';
const nodemailer = require('nodemailer');

// nodemailer setup
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'civicconnect075@gmail.com',
        pass: 'CS307Project2024!'
    }
});

// Request password reset link
router.post('/request-password-reset', async (req, res) => {
    const { email } = req.body;
    console.log("Received password reset request for email:", email);

    if (!email) {
        return res.status(400).json({ error: errorMessages.missingFields });
    }

    const user = users.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (!user) {
        console.log("User not found for email:", email);
        return res.status(200).json({ message: errorMessages.emailNotFound });
    }

    const resetToken = jwt.sign({ email: user.email }, secretKey, { expiresIn: '1h' });
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    console.log("Generated reset link:", resetLink);

    // send the reset link via email
    try {
        await sendPasswordResetEmail(user.email, resetLink);  // use the sendPasswordResetEmail function
        res.status(200).json({ message: 'Password reset link sent successfully.' });
    } catch (error) {
        console.error('Error sending password reset email:', error);
        res.status(500).json({ error: 'Failed to send reset email.' });
    }

    // res.status(200).json({ message: 'Password reset link generated successfully.', resetLink });
});

// password validation function
function isPasswordValid(password) {
    // Regex explanation:
    // (?=.*[A-Z])      ensure at least one uppercase letter
    // (?=.*[0-9])      ensure at least one digit
    // (?=.*[!@#$%^&*]) ensure at least one special character
    // .{8,}            ensure the password is at least 5 characters long
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{5,}$/;
    return passwordRegex.test(password);
}

// Reset password
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Verify the token
        const decoded = jwt.verify(token, secretKey);
        const userEmail = decoded.email;

        // Find the user by email
        const user = users.find(user => user.email.toLowerCase() === userEmail.toLowerCase());
        if (!user) {
            return res.status(400).json({ error: 'Invalid token or user not found.' });
        }

        // check if password meets the complexity requirements
        if (!isPasswordValid(newPassword)) {
            throw new Error('Password must include at least one uppercase letter, one symbol, one number, and be at least 8 characters long.');
        }

        // Hash the new password and update it
        user.password = await bcrypt.hash(newPassword, 10);

        await sendPasswordResetSuccessEmail(user.email);
        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        res.status(400).json({ error: 'Invalid or expired token.' });
    }
});

module.exports = router;