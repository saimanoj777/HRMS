// backend/server.js — Full updated file (copy-paste replace yours)
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// FIXED CORS: Allow all Render origins (or specific ones)
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [
        'https://hrms-xy0s.onrender.com',  // Your backend itself (if needed)
        'https://hrms-frontend-0w7r.onrender.com',  // Replace with your actual frontend URL
        'https://*.onrender.com'  // Wildcard for Render (safe for dev)
      ]
    : 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Create logs directory
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
  console.log('Created logs directory at:', logsDir);
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/teams', require('./teams'));
app.use('/api/logs', require('./routes/logs'));

// FIXED: Add root route (prevents "Cannot GET /" error)
app.get('/', (req, res) => {
  res.json({
    message: 'HRMS Backend API v1.0 - Live on Render! 🚀',
    status: 'healthy',
    endpoints: {
      auth: '/api/auth/login (POST)',
      employees: '/api/employees (GET/POST)',
      teams: '/api/teams (GET/POST)',
      logs: '/api/logs (GET)'
    },
    testLogin: { username: 'admin', password: '123456' },
    corsAllowed: true
  });
});

// Catch-all for 404s
app.use('*', (req, res) => {
  res.status(404).json({ error: `Route not found: ${req.originalUrl}. Use /api/...` });
});

// Health check (Render pings this)
app.get('/health', (req, res) => res.json({ status: 'OK' }));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`HRMS Backend running on port ${PORT}`);
});