const express = require('express')
const bcrypt = require('bcrypt'); // used for hashing passwords
const jwt = require('jsonwebtoken'); // create and verify JWT
const cors = require('cors'); // Import cors

const app = express()

app.use(cors()); // enable CORS
app.use(express.json()); 

let users = [];

async function signupUser(username, password) {
    if (!username || !password) {
        throw new Error('Make sure to fill out both username and password.');
    }

    // check if the user already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        throw new Error('User already exists.');
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // store user in the list
    users.push({ username, password: hashedPassword });

    return 'User registered successfully.';
}

app.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const message = await signupUser(username, password);
        res.status(201).json({ message });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    try{
        // req is parsed into JSON, take username and password variable
        const { username, password } = req.body;
        const message = await signupUser(username, password);
        res.status(201).json({ message });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get("/api", (req, res) => {
    res.json({ "members": ["aysu", "heidi", "jammy", "avishi", "roohee"] })
})

// using port 5010 bc 5000 taken
app.listen(5010, () => {console.log("Server has started on port 5010")})

module.exports = { app, signupUser, users };