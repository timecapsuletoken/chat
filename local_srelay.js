const Gun = require('gun'); // Gun.js library
const express = require('express'); // Express for HTTP handling
const path = require('path'); // Path module for directory handling
const fs = require('fs'); // File system module for ensuring persistence directory
const https = require('https'); // HTTPS module for secure connections

const app = express();
const port = process.env.PORT || 8765;

// Ensure persistence directory exists
const radiskPath = path.resolve('radata');
if (!fs.existsSync(radiskPath)) {
  console.log(`[DEBUG] Creating radisk directory at ${radiskPath}`);
  fs.mkdirSync(radiskPath);
} else {
  console.log(`[DEBUG] Radisk directory exists at ${radiskPath}`);
}

// Serve Gun.js assets
app.use(Gun.serve);

// Load SSL certificates
const options = {
  key: fs.readFileSync('C:\\Users\\ntsol\\Documents\\CryptoProjects\\chat\\certs\\localhost+3-key.pem'),
  cert: fs.readFileSync('C:\\Users\\ntsol\\Documents\\CryptoProjects\\chat\\certs\\localhost+3.pem'),
};

// Start the HTTPS server
const server = https.createServer(options, app);
server.listen(port, () => {
  console.log(`Gun relay server running securely at https://localhost:${port}`);
});

// Initialize Gun with the server and file-based persistence
const gun = Gun({
  web: server, // Attach Gun to the HTTPS server
  radisk: true, // Enable persistent storage
  file: 'radata', // Directory for storing data
});

console.log('Gun relay server initialized and ready with HTTPS.');
