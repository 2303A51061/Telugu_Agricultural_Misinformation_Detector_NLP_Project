const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const predictionRoutes = require('./routes/predictionRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const historyRoutes = require('./routes/historyRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Static assets (logos, documents, etc.)
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Telugu Agricultural Misinformation Backend',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// REST API Routes
app.use('/api', predictionRoutes);
app.use('/api', analyticsRoutes);
app.use('/api', historyRoutes);

// Serve production React build if dist exists
const distPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(distPath));

// Frontend SPA catch-all route
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/assets')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

// Global Error Handler
app.use(errorHandler);

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` Telugu Agricultural Misinformation Detection Server `);
    console.log(` Server running on http://localhost:${PORT}          `);
    console.log(` Health check: http://localhost:${PORT}/api/health    `);
    console.log(`=======================================================`);
  });
}

module.exports = app;
