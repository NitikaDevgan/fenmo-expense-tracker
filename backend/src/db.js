const Database = require("better-sqlite3");

const db = new Database("expenses.db");

db.prepare(`
  CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    amount_cents INTEGER NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    created_at TEXT NOT NULL,
    request_id TEXT UNIQUE NOT NULL
  )
`).run();

module.exports = db;
