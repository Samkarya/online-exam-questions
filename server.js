const express = require('express');
const cors = require('cors');
const path = require('path');
const os = require('os');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.static(path.join(__dirname, '.')));

app.get('/', (req, res) => {
    res.send('Online Exam Questions Server is running. Access config at /config.json');
});

const getLocalIpAddress = () => {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
};

app.listen(PORT, '0.0.0.0', () => {
    const ip = getLocalIpAddress();
    console.log(`Server is running on:`);
    console.log(`  - Local:   http://localhost:${PORT}`);
    console.log(`  - Network: http://${ip}:${PORT}`);
    console.log(`Serving files from ${path.join(__dirname, '.')}`);
});