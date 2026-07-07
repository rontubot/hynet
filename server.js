const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname), { extensions: ['html', 'htm'] }));

// Redirect /index to /inicio
app.get('/index', (req, res) => {
  res.redirect(301, '/inicio');
});

// Serve index.html on /inicio and /
app.get(['/inicio', '/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Fallback to index.html for undefined routes (or send 404)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
