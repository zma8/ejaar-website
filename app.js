const express = require('express');
const path = require('path');
const app = express();

// Serve root directory as static (for images, etc)
app.use(express.static(__dirname));

// Serve public directory as static
app.use(express.static('public'));

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});