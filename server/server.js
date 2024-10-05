const express = require('express')
const bcrypt = require('bcrypt'); // used for hashing passwords
const jwt = require('jsonwebtoken'); // create and verify JWT
const cors = require('cors'); // import cors

const app = express()

app.use(cors()); // enable CORS
app.use(express.json()); 

let users = [];
const secretKey = 'key'; 

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

module.exports = { app, signupUser, loginUser, users };