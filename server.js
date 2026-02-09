const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

// Enable CORS for all routes to allow requests from localhost:3000 (React app)
app.use(cors());

// Serve static files from the root directory
// This allows access to config.json, configs/*.json, and other resources
app.use(express.static(path.join(__dirname, '.')));

app.get('/', (req, res) => {
    res.send('Online Exam Questions Server is running. Access config at /config.json');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Serving files from ${path.join(__dirname, '.')}`);
});
