const Gun = require('gun');
const express = require('express');
const app = express();

const port = 8765; // You can choose any available port

// Serve Gun.js and set up the relay server
app.use(Gun.serve);

const server = app.listen(port, () => {
  console.log(`Gun relay server running on http://localhost:${port}`);
});

// Initialize Gun with the server
Gun({ web: server });
