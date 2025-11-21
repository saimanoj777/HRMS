const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { logActivity, JWT_SECRET } = require('../middleware/auth');

// Create Organisation + First User
router.post('/register', async (req, res) => {
  const { orgName, username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  db.get('SELECT * FROM organisations WHERE name = ?', [orgName], (err, org) => {
    if (org) return res.status(400).json({ error: 'Organisation exists' });

    db.run('INSERT INTO organisations (name) VALUES (?)', [orgName], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      const orgId = this.lastID;

      db.run(
        'INSERT INTO users (org_id, username, password) VALUES (?, ?, ?)',
        [orgId, username, hashed],
        function(err) {
          if (err) return res.status(500).json({ error: err.message });
          logActivity(username, `created organisation '${orgName}' and registered`);
          res.json({ message: 'Organisation and user created', orgId });
        }
      );
    });
  });
});

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT users.*, organisations.id as orgId FROM users JOIN organisations ON users.org_id = organisations.id WHERE username = ?', 
    [username], async (err, user) => {
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id, username: user.username, orgId: user.orgId },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      logActivity(user.username, 'logged in');
      res.json({ token, user: { username: user.username, orgId: user.orgId } });
    });
});

router.post('/logout', (req, res) => {
  const username = req.user?.username || 'unknown';
  logActivity(username, 'logged out');
  res.json({ message: 'Logged out' });
});

module.exports = router;