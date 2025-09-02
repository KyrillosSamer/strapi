import Database from 'better-sqlite3';

const db = new Database('./.tmp/data.db');

const rows = db.prepare('SELECT * FROM components_services_sections').all();

rows.forEach((row) => {
  try {
    JSON.parse(row.list);
  } catch (err) {
    console.log('Fixing invalid JSON for id', row.id);
    db.prepare('UPDATE components_services_sections SET list = ? WHERE id = ?')
      .run('[]', row.id);
  }
});

db.close();
console.log('All invalid JSON fixed.');
