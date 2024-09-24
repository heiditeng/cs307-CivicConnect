const express = require('express')
const app = express()

app.get("/api", (req, res) => {
    res.json({ "members": ["aysu", "heidi", "jammy", "avishi", "roohee"] })
})

// using port 5010 bc 5000 taken
app.listen(5010, () => {console.log("Server has started on port 5010")})
