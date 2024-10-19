const express = require('express')
const bcrypt = require('bcrypt'); // used for hashing passwords
const jwt = require('jsonwebtoken'); // create and verify JWT
const cors = require('cors'); // import cors
const nodemailer = require('nodemailer'); // allow for emails to be sent
const session = require('express-session'); // handle sessions
const profileRoutes = require('./profileRoutes'); // import profile routes
const organizationRoutes = require('./organizationRoutes');
const passwordRoutes = require('./passwordRoutes'); // password routes
const { emailTemplates, errorMessages, successMessages } = require('./messages');
const { sendOTPEmail } = require('./emailService'); // email
const { sendOTPSMS } = require('./smsService'); // SMS
const validator = require('validator'); // validates email
const path = require('path');
const eventRoutes = require('./eventRoutes'); // import event routes


// mongo db stuff
const connectDB = require('./db');
connectDB();


// express needs to be in front of passport for google auth to work !!!
const {passport, users} = require('./googleAuth');
const secretKey = 'key'
const otpStore = {};

// function to generate a 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

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
    // successful authentication, redirect to home page
    res.redirect('http://localhost:3000/profile');
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

// Use password routes
app.use('/', passwordRoutes);

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

function isEmailValid(email) {
    // Regex for a simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

async function signupUser(username, password, confirmPassword, email, phoneNumber, enableMFAEmail, enableMFAPhone) {
    if (!username || !password || !confirmPassword || !email || !phoneNumber) {
        throw new Error('Make sure to fill out all fields.');
    }

    // check if email is valid
    if (!isEmailValid(email)) {
        throw new Error('Invalid email format.');
    }

    // check if password meets the complexity requirements
    if (!isPasswordValid(password)) {
        throw new Error('Password must include at least one uppercase letter, one symbol, one number, and be at least 8 characters long.');
    }

    // check if password matches
    if (password !== confirmPassword) {
        throw new Error('Passwords do not match.');
    }

    // check if the user already exists through email + username
    const existingUser = users.find(user => user.username === username || user.email === email);
    if (existingUser) {
        throw new Error('User with this username or email already exists.');
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // store user in the list with MFA settings
    users.push({username, password: hashedPassword, email, phoneNumber, enableMFAEmail, enableMFAPhone});

    return 'User registered successfully.';
}

app.post('/signup', async (req, res) => {
    try {
        const {username, password, confirmPassword, email, phoneNumber, enableMFAEmail, enableMFAPhone} = req.body;
        const message = await signupUser(username, password, confirmPassword, email, phoneNumber, enableMFAEmail, enableMFAPhone);
        res.status(201).json({message});
    } catch (error) {
        res.status(400).json({error: error.message});
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

// login route with MFA check
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = users.find(user => user.username === username);
        if (!user) {
            throw new Error('Invalid username or password.');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid username or password.');
        }


        console.log("before");

        let otp;
        if (user.enableMFAEmail) {
            const otp = generateOTP();
            otpStore[user.email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };
            await sendOTPEmail(user.email, otp);

            res.status(200).json({ message: 'OTP sent to your email.' });
        } 
        // check if MFA via phone is enabled
        else if (user.enableMFAPhone) {
            otp = generateOTP();
            otpStore[username] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };
            console.log("sending SMS...");
           
            await sendOTPSMS(user.phoneNumber, otp);
            res.status(200).json({ message: 'OTP sent to your phone.' });
        } 
        // no MFA enabled
        else {
            // Standard login without MFA
            const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });
            res.status(200).json({ message: 'Login successful.', token, username: user.username });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// verify OTP (MFA Step)
app.post('/verify-otp', (req, res) => {
    const {username, otp} = req.body;
    try {
        const otpData = otpStore[username];
        if (!otpData || otpData.otp !== otp || Date.now() > otpData.expiresAt) {
            throw new Error('Invalid or expired OTP.');
        }

        // OTP is valid, generate JWT token
        const token = jwt.sign({username}, secretKey, {expiresIn: '1h'});

        // Clear OTP after successful verification
        delete otpStore[username];

        res.status(200).json({message: 'Login successful.', token});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

console.log('Serving static files from:', path.join(__dirname, 'uploads'));

// Test route for checking static file serving
app.get('/test-file', (req, res) => {
    res.sendFile(path.join(__dirname, 'uploads', 'monkey.jpeg'), (err) => {
        if (err) {
            console.error('File not found:', err);
            res.status(404).send('File not found');
        }
    });
});

// using the profile routes
app.use('/api/profiles', profileRoutes);
app.use('/api/organizations', organizationRoutes);

// Using the event routes
app.use('/api/events', eventRoutes); // Integrate event routes

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