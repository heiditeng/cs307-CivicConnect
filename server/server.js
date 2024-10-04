const express = require('express')
const bcrypt = require('bcrypt'); // used for hashing passwords
const jwt = require('jsonwebtoken'); // create and verify JWT
const cors = require('cors'); // Import cors

const app = express()

app.use(cors()); // enable CORS
app.use(express.json()); 

let users = [];

app.post('/signup', async (req, res) => {
    // req is parsed into JSON, take username and password variable
    const { username, password } = req.body;

    // check if all required fields are provided
    if (!username || !password) {
        return res.status(400).json({ error: 'Make sure to fill out both username and password.' });
    }

    // check if the user already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).json({ error: 'User already exists.' });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // store user
    users.push({ username, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully.' });
});


app.get("/api", (req, res) => {
    res.json({ "members": ["aysu", "heidi", "jammy", "avishi", "roohee"] })
})

// using port 5010 bc 5000 taken
app.listen(5010, () => {console.log("Server has started on port 5010")})
