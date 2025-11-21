// backend/routes/teams.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate, logActivity } = require('../middleware/auth');

router.use(authenticate);

// GET all teams + their members
router.get('/', (req, res) => {
  const orgId = req.user.orgId;

  db.all(`
    SELECT t.*, GROUP_CONCAT(e.name) as memberNames
    FROM teams t
    LEFT JOIN employee_teams et ON t.id = et.team_id
    LEFT JOIN employees e ON et.employee_id = e.id
    WHERE t.org_id = ?
    GROUP BY t.id
  `, [orgId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const teams = rows.map(t => ({
      ...t,
      members: t.memberNames ? t.memberNames.split(',') : []
    }));
    res.json(teams);
  });
});

// CREATE team
router.post('/', (req, res) => {
  const { name, description } = req.body;
  const orgId = req.user.orgId;

  db.run('INSERT INTO teams (org_id, name, description) VALUES (?, ?, ?)',
    [orgId, name, description], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      logActivity(req.user.username, `added a new team with ID ${this.lastID} (${name})`);
      res.json({ id: this.lastID, name, description });
    });
});

// UPDATE team
router.put('/:id', (req, res) => {
  const { name, description } = req.body;
  db.run('UPDATE teams SET name = ?, description = ? WHERE id = ? AND org_id = ?',
    [name, description, req.params.id, req.user.orgId], function (err) {
      if (err || this.changes === 0) return res.status(404).json({ error: 'Team not found' });
      logActivity(req.user.username, `updated team ${req.params.id}`);
      res.json({ success: true });
    });
});

// DELETE team (automatically removes assignments due to ON DELETE CASCADE)
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM teams WHERE id = ? AND org_id = ?', [req.params.id, req.user.orgId], function (err) {
    if (err || this.changes === 0) return res.status(404).json({ error: 'Team not found' });
    logActivity(req.user.username, `deleted team ${req.params.id}`);
    res.json({ success: true });
  });
});

module.exports = router;