const express = require('express')
const bcrypt = require('bcrypt'); // used for hashing passwords
const jwt = require('jsonwebtoken'); // create and verify JWT
const cors = require('cors'); // import cors
const nodemailer = require('nodemailer'); // allow for emails to be sent
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session'); // handle sessions

// express needs to be in front of passport for google auth to work !!!
const { passport, users } = require('./googleAuth');
const secretKey = 'key'

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// express-session setup
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Google OAuth routes
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/login'
}),
(req, res) => {
    // Successful authentication, redirect to home page
    res.redirect('http://localhost:3000');
});

// nodemailer (sends email)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'civicconnect075@gmail.com',
        pass: 'CS307Project2024!'
    }
});

// Sample email route
app.get('/send-test-email', async (req, res) => {
    const mailOptions = {
        from: 'civicconnect075@gmail.com',
        to: 'heiditeng22@gmail.com',
        subject: 'Test Email',
        text: 'This is a test email from CivicConnect.'
    };

    console.log("Before sending...");
    try {
        console.log("Sending test email...");
        await transporter.sendMail(mailOptions);
        console.log("Test email sent successfully.");
        res.status(200).send('Test email sent successfully.');
    } catch (error) {
        console.error('Error sending test email:', error);
        res.status(500).send('Error sending test email.');
    }
});

// password reset request route
app.post('/request-password-reset', async (req, res) => {
    const {email} = req.body;
    console.log("Received password reset request for email:", email);

    if (!email) {
        return res.status(400).json({error: 'Please provide an email address.'});
    }

    // find the user by email
    const user = users.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (!user) {
        console.log("User not found for email:", email);
        return res.status(200).json({message: 'If this email is registered, you will receive a password reset link.'});
    }

    // generate reset token that expires in 1 hour
    const resetToken = jwt.sign({ email: user.email }, secretKey, { expiresIn: '1h' });

    // send an email with the reset link
    const resetLink = `http://localhost:5010/reset-password?token=${resetToken}`;

    const mailOptions = {
        from: 'civicconnect075@gmail.com',
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
        console.log("Sending email...");
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully.");
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


app.get("/api", (req, res) => {
    res.json({ "members": ["aysu", "heidi", "jammy", "avishi", "roohee"] })
})

// using port 5010 bc 5000 taken
// app.listen(5010, () => {console.log("Server has started on port 5010")})

// start the server only if not in a test environment
if (process.env.NODE_ENV !== 'test') {
    app.listen(5010, () => {
        console.log("Server has started on port 5010");
    });
}

module.exports = {app, signupUser, loginUser, users};