const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = process.env.NODE_ENV === 'production' 
  ? path.join(process.env.RENDER_VOLUME_PATH || '/var/data', 'hrms.db')
  : './hrms.db';
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS organisations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      org_id INTEGER,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      FOREIGN KEY (org_id) REFERENCES organisations(id),
      UNIQUE(username, org_id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      org_id INTEGER,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      position TEXT,
      FOREIGN KEY (org_id) REFERENCES organisations(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      org_id INTEGER,
      name TEXT NOT NULL,
      description TEXT,
      FOREIGN KEY (org_id) REFERENCES organisations(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS employee_teams (
      employee_id INTEGER,
      team_id INTEGER,
      FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
      FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
      PRIMARY KEY (employee_id, team_id)
    )
  `);
});

module.exports = db;