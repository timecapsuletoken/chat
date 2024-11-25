const Gun = require('gun');
const express = require('express');
const app = express();

const port = process.env.PORT || 8765; // Use Render's assigned port if available

// Serve Gun.js and set up the relay server
app.use(Gun.serve);

const server = app.listen(port, () => {
  console.log(`Gun relay server running on http://localhost:${port}`);
});

// Initialize Gun with the server
const gun = Gun({ web: server });

// Log incoming messages
gun.on('in', (msg) => {
  console.log('INCOMING MESSAGE:', JSON.stringify(msg, null, 2));
});

// Log outgoing messages
gun.on('out', (msg) => {
  console.log('OUTGOING MESSAGE:', JSON.stringify(msg, null, 2));
});

// Log data writes
gun.on('put', (node, soul) => {
  console.log('DATA PUT:', { soul, node });
});

// Log errors
gun.on('err', (err) => {
  console.error('GUN ERROR:', JSON.stringify(err, null, 2));
});

// Log client connections and disconnections
gun.on('hi', (peer) => {
  console.log('CLIENT CONNECTED:', peer.id);
});

gun.on('bye', (peer) => {
  console.log('CLIENT DISCONNECTED:', peer.id);
});
