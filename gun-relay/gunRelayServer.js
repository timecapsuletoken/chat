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
const gun = Gun({
  web: server,
  radisk: true, // File-based persistence
  localStorage: false, // Disable browser localStorage if Fly.io doesn't support shared storage
});
