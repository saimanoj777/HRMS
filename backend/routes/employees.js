const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate, logActivity } = require('../middleware/auth');

router.use(authenticate);

// Get all employees (with their teams)
router.get('/', (req, res) => {
  const orgId = req.user.orgId;
  db.all(`
    SELECT e.*, GROUP_CONCAT(t.name) as teamNames
    FROM employees e
    LEFT JOIN employee_teams et ON e.id = et.employee_id
    LEFT JOIN teams t ON et.team_id = t.id
    WHERE e.org_id = ?
    GROUP BY e.id
  `, [orgId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(r => ({ ...r, teamNames: r.teamNames ? r.teamNames.split(',') : [] })));
  });
});

// Create employee
router.post('/', (req, res) => {
  const { name, email, position } = req.body;
  const orgId = req.user.orgId;

  db.run('INSERT INTO employees (org_id, name, email, position) VALUES (?, ?, ?, ?)',
    [orgId, name, email, position], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      logActivity(req.user.username, `added a new employee with ID ${this.lastID}`);
      res.json({ id: this.lastID, name, email, position });
    });
});

// Update employee
router.put('/:id', (req, res) => {
  const { name, email, position } = req.body;
  db.run('UPDATE employees SET name = ?, email = ?, position = ? WHERE id = ? AND org_id = ?',
    [name, email, position, req.params.id, req.user.orgId], function(err) {
      if (err || this.changes === 0) return res.status(404).json({ error: 'Not found or no change' });
      logActivity(req.user.username, `updated employee ${req.params.id}`);
      res.json({ success: true });
    });
});

// Delete employee
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM employees WHERE id = ? AND org_id = ?', [req.params.id, req.user.orgId], function(err) {
    if (err || this.changes === 0) return res.status(404).json({ error: 'Not found' });
    logActivity(req.user.username, `deleted employee ${req.params.id}`);
    res.json({ success: true });
  });
});

// Assign employee to team(s)
// router.post('/:empId/teams', (req, res) => {
//   const { teamIds } = req.body; // array
//   const empId = req.params.empId;

//   db.get('SELECT id FROM employees WHERE id = ? AND org_id = ?', [empId, req.user.orgId], (err, emp) => {
//     if (!emp) return res.status(404).json({ error: 'Employee not found' });

//     const stmt = db.prepare('INSERT OR IGNORE INTO employee_teams (employee_id, team_id) VALUES (?, ?)');
//     teamIds.forEach(teamId => stmt.run(empId, teamId));
//     stmt.finalize(() => {
//       logActivity(req.user.username, `assigned employee ${empId} to team(s) ${teamIds.join(', ')}`);
//       res.json({ success: true });
//     });
//   });
// });


router.post('/:empId/teams', (req, res) => {
  const { teamIds } = req.body;
  const empId = req.params.empId;

  if (!Array.isArray(teamIds) || teamIds.length === 0) {
    return res.status(400).json({ error: 'teamIds must be a non-empty array' });
  }

  db.get('SELECT id FROM employees WHERE id = ? AND org_id = ?', [empId, req.user.orgId], (err, emp) => {
    if (!emp) return res.status(404).json({ error: 'Employee not found' });

    const stmt = db.prepare('INSERT OR IGNORE INTO employee_teams (employee_id, team_id) VALUES (?, ?)');
    let completed = 0;
    const total = teamIds.length;

    teamIds.forEach(teamId => {
      stmt.run(empId, teamId, function(err) {
        if (err) console.error(err);
        completed++;
        if (completed === total) {
          stmt.finalize(() => {
            logActivity(req.user.username, `assigned employee ${empId} to team(s) ${teamIds.join(', ')}`);

            // NOW RETURN UPDATED EMPLOYEE WITH TEAM NAMES
            db.get(`
              SELECT e.*, GROUP_CONCAT(t.name) as teamNames
              FROM employees e
              LEFT JOIN employee_teams et ON e.id = et.employee_id
              LEFT JOIN teams t ON et.team_id = t.id
              WHERE e.id = ?
              GROUP BY e.id
            `, [empId], (err, updatedEmp) => {
              if (err) return res.status(500).json({ error: err.message });
              const result = {
                ...updatedEmp,
                teamNames: updatedEmp.teamNames ? updatedEmp.teamNames.split(',') : []
              };
              res.json({ success: true, employee: result });
            });
          });
        }
      });
    });
  });
});

module.exports = router;