const Gun = require('gun');
const express = require('express');
const app = express();

const port = process.env.PORT || 8765; // Use Render's assigned port or fallback

// Middleware to check API key
app.use((req, res, next) => {
  const apiKey = process.env.GUN_PEER_API_KEY;
  if (apiKey && req.headers['x-api-key'] !== apiKey) {
    return res.status(403).send('Forbidden: Invalid API Key');
  }
  next();
});

// Serve Gun.js and set up the relay server
app.use(Gun.serve);

const server = app.listen(port, () => {
  console.log(`Gun relay server running on http://localhost:${port}`);
});

// Enable Radisk for persistent storage
const gun = Gun({
  web: server,
  radisk: true, // Enable Radisk for on-disk storage
  file: 'data', // Specify the directory for storage
});

Gun({ web: server });
