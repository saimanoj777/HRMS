// backend/routes/logs.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// Get full activity log
router.get('/', (req, res) => {
  const logPath = path.join(__dirname, '..', 'logs', 'activity.log');
  fs.readFile(logPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Could not read log file' });
    const lines = data.trim() ? data.trim().split('\n') : [];
    res.json({ logs: lines.reverse() }); // newest first
  });
});

module.exports = router;