import Database from 'better-sqlite3';

const db = new Database('./.tmp/data.db');
const tables = db.prepare(
  "SELECT name FROM sqlite_master WHERE type='table';"
).all();

console.log('Tables in DB:', tables.map(t => t.name));
db.close();
