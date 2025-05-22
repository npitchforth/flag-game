const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const port = 3002;

// Enable CORS for all routes
app.use(cors());

// Serve static files from dist directory
app.use('/dist', express.static(path.join(__dirname, 'dist')));

// Serve countries.js
app.get('/countries.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'countries.js'));
});

// Proxy middleware for flag images
app.use('/flags', createProxyMiddleware({
  target: 'https://flagcdn.com',
  changeOrigin: true,
  pathRewrite: {
    '^/flags': ''
  }
}));

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
}); 