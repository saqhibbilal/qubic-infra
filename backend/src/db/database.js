const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Asegurar que el directorio de datos existe
const dbPath = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true });
}

const db = new sqlite3.Database(path.join(dbPath, 'qbic.db'), (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Inicializar tablas
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assetId TEXT UNIQUE,
    owner TEXT,
    jurisdiction TEXT,
    description TEXT,
    type TEXT,
    status TEXT,
    documents TEXT, -- JSON string con las rutas de los archivos
    verifier TEXT,
    verificationDate TEXT,
    legalStatus TEXT, -- JSON string con el estado legal
    timestamp TEXT,
    value REAL DEFAULT 0
  )`);

  // Intentar añadir columna value si no existe (para DBs existentes)
  db.run(`ALTER TABLE assets ADD COLUMN value REAL DEFAULT 0`, (err) => {
      // Ignorar error si la columna ya existe
  });
});

module.exports = db;
