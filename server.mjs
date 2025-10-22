// server.mjs

import express from 'express';
import path from 'path';
import { createServer } from 'http';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 8036;

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve only the static files from the dist directory
app.use(express.static('dist'));

app.get('/assets/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', req.url));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const server = createServer(app);
server.listen(port, (err) => {
  if (err) {
    console.log('Error:', err);
  } else {
    console.log('Express server listening on port', port);
  }
});
