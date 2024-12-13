// Import required modules
const Gun = require('gun'); // Gun.js library
const express = require('express'); // Express for HTTP handling
const cors = require('cors'); // CORS for cross-origin requests
const path = require('path'); // Path for directory management
const fs = require('fs'); // File system for radisk persistence

// Set the port for the server
const PORT = 8765;

// Initialize the Express app
const app = express();

// Enable CORS for all requests
app.use(cors());

// Basic health-check route
app.get('/', (req, res) => {
  res.send('Gun Relay Server is running!');
});

// Start the Express server
const server = app.listen(PORT, () => {
  console.log(`Gun relay server running on http://localhost:${PORT}`);
});

// Ensure the radisk directory exists
const radiskPath = path.resolve('radata');
if (!fs.existsSync(radiskPath)) {
  console.log(`[DEBUG] Creating radisk directory at ${radiskPath}`);
  fs.mkdirSync(radiskPath);
} else {
  console.log(`[DEBUG] Radisk directory exists at ${radiskPath}`);
}

// Initialize Gun with radisk and P2P options
const gun = Gun({
  web: server, // Attach Gun to the Express server
  radisk: true, // Enable persistent storage
  file: 'radata', // Directory for storing data
});

// Debugging: Log Gun.js events
gun.on('hi', (peer) => {
  console.log(`[DEBUG] Peer connected: ${peer.url}`);
});

gun.on('bye', (peer) => {
  console.log(`[DEBUG] Peer disconnected: ${peer.url}`);
});

console.log('Gun relay server initialized and ready.');
