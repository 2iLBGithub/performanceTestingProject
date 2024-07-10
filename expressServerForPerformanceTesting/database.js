const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data.db'); 

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS beverages (id TEXT PRIMARY KEY, name TEXT, rating INTEGER)");
});

module.exports = db;
