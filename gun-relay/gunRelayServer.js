import Gun from 'gun';
import fs from 'fs';
import http from 'http';
import https from 'https';
import express from 'express';

// Use Express as the web server
const app = express();
app.use(Gun.serve);

const port = process.env.PORT || 8765; // Default Fly.io internal port

// Determine whether to use HTTPS or HTTP
const server = process.env.USE_HTTPS === 'true'
  ? https.createServer(
      {
        key: fs.readFileSync(process.env.SSL_KEY_PATH || './certs/key.pem'), // Ensure cert paths
        cert: fs.readFileSync(process.env.SSL_CERT_PATH || './certs/cert.pem'),
      },
      app
    )
  : http.createServer(app);

const gun = Gun({ web: server, peers: (process.env.PEERS || '').split(',') });

server.listen(port, () => {
  console.log(`Gun relay server running on port ${port}`);
});

export default gun;
