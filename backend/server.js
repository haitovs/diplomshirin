const express = require('express');
const cors = require('cors');
const path = require('path');

// Initialize database
const db = require('./db/init');

// Import routes
const diplomaWorksRoutes = require('./routes/diplomaWorks');
const studentsRoutes = require('./routes/students');
const searchRoutes = require('./routes/search');
const statsRoutes = require('./routes/stats');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/diploma-works', diplomaWorksRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/stats', statsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📚 Diploma Archive API ready`);
});

module.exports = app;
