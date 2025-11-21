const jwt = require('jsonwebtoken');
const db = require('../db');
const path = require('path');
const fs = require('fs');

const JWT_SECRET = 'your-super-secret-jwt-key-hrms-2025';

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

const logActivity = (userId, action) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] User '${userId}' ${action}\n`;
//   require('fs').appendFileSync('./backend/logs/activity.log', logEntry);
  const logPath = path.join(__dirname, '..', 'logs', 'activity.log');
  fs.appendFileSync(logPath, logEntry);
};

module.exports = { authenticate, logActivity, JWT_SECRET };