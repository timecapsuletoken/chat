const Gun = require('gun');
const express = require('express');
const app = express();
const port = process.env.PORT || 8765;

// Serve Gun.js assets
app.use(Gun.serve);

const server = app.listen(port, () => {
  console.log(`Gun relay server running at ${port}`);
});

// Initialize Gun with the server
const gun = Gun({ web: server });

// File-based persistence (default)
// Data will be stored in ./radata directory
