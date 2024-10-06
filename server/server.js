const express = require('express')
const bcrypt = require('bcrypt'); // used for hashing passwords
const jwt = require('jsonwebtoken'); // create and verify JWT
const cors = require('cors'); // import cors
const nodemailer = require('nodemailer'); // allow for emails to be sent
const profileRoutes = require('./profileRoutes'); // import profile routes


const app = express()

app.use(cors()); // enable CORS
app.use(express.json()); 

let users = [];
const secretKey = 'key'; 

// nodemailer (sends email)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'youremail@gmail.com', // need to create proj email
        pass: 'yourpassword' // create proj password
    }
});

// password reset request route
app.post('/request-password-reset', async (req, res) => {
    const {email} = req.body;

    if (!email) {
        return res.status(400).json({error: 'Please provide an email address.'});
    }

    // find the user by email
    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(200).json({message: 'If this email is registered, you will receive a password reset link.'});
    }

    // generate reset token that expires in 1 hour
    const resetToken = jwt.sign({ email: user.email }, secretKey, { expiresIn: '1h' });

    // send an email with the reset link
    const resetLink = `http://localhost:5010/reset-password?token=${resetToken}`;

    const mailOptions = {
        from: 'youremail@gmail.com',
        to: user.email,
        subject: 'Password Reset Request',
        html: `
            <h3>Password Reset Request</h3>
            <p>Hello ${user.username}! </p>
            <p>We received a request to reset your password. Click the link below to reset your password:</p>
            <a href="${resetLink}">Reset Password</a>
            <p>If you did not request a password reset, please ignore this email. This link will expire in an hour. </p>
            <p>Have a nice day!</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({message: 'If this email is registered, you will receive a password reset link.'});
    } catch (error) {
        res.status(500).json({error: 'Error sending email. Please try again later.'});
    }
});

async function signupUser(username, password, email, phoneNumber) {
    if (!username || !password || !email || !phoneNumber) {
        throw new Error('Make sure to fill out all fields.');
    }

    // check if the user already exists through email + username
    const existingUser = users.find(user => user.username === username || user.email === email);
    if (existingUser) {
        throw new Error('User with this username or email already exists.');
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // store user in the list
    users.push({ username, password: hashedPassword, email, phoneNumber});

    return 'User registered successfully.';
}

app.post('/signup', async (req, res) => {
    try {
        const {username, password, email, phoneNumber } = req.body;
        const message = await signupUser(username, password, email, phoneNumber);
        res.status(201).json({ message });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

async function loginUser(username, password) {
    // check if the fields are filled in
    if (!username || !password) {
        throw new Error('Make sure to fill out all fields.');
    }

    // find user by username
    const user = users.find(user => user.username === username);
    if (!user) {
        throw new Error('Invalid username or password.');
    }

    // compare provided password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid username or password.');
    }

    // generate a JWT token for the user
    const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });

    return { message: 'Login successful.', token };
}

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await loginUser(username, password);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// using the profile routes
app.use('/api/profiles', profileRoutes);

// start the server only if not in a test environment
if (process.env.NODE_ENV !== 'test') {
    app.listen(5010, () => {
        console.log("Server has started on port 5010");
    });
}


module.exports = { app, signupUser, loginUser, users };