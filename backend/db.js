const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Determine the database path based on environment
let dbPath;
if (process.env.NODE_ENV === 'production' && process.env.RENDER_VOLUME_PATH) {
  // Render production environment with volume
  const volumePath = process.env.RENDER_VOLUME_PATH;
  // Ensure the directory exists
  if (!fs.existsSync(volumePath)) {
    fs.mkdirSync(volumePath, { recursive: true });
  }
  dbPath = path.join(volumePath, 'hrms.db');
} else if (process.env.NODE_ENV === 'production') {
  // Render production environment without volume (use /tmp which is writable)
  dbPath = path.join('/tmp', 'hrms.db');
} else {
  // Development environment
  dbPath = path.join(__dirname, 'hrms.db');
}

console.log(`Using database path: ${dbPath}`);

// Ensure the directory exists for the database file
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

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