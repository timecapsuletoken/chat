const Gun = require('gun');
const express = require('express');
const app = express();

const port = 8765; // You can choose any available port

// Serve Gun.js and set up the relay server
app.use(Gun.serve);

const server = app.listen(port, () => {
  console.log(`Gun relay Localserver running on http://localhost:${port}`);
});

// Initialize Gun with the server
const gun = Gun({ web: server });

// Add a debug listener to log all updates
gun.on('put', (node, soul) => {
  console.log(`Data updated:`, { soul, node });
});

// Optional: Monitor all incoming connections
gun.on('in', (msg) => {
  console.log(`Incoming message:`, msg);
});

// Optional: Monitor all outgoing connections
gun.on('out', (msg) => {
  console.log(`Outgoing message:`, msg);
});
