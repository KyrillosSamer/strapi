import Database from 'better-sqlite3';

const db = new Database('./.tmp/data.db');

const rows = db.prepare('SELECT * FROM components_services_sections').all();

rows.forEach((row, index) => {
  try {
    JSON.parse(row.list); // جرب parse للـ JSON
  } catch (err) {
    console.log('Invalid JSON at row', index, '=>', row.list);
  }
});

db.close();
