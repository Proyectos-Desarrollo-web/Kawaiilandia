// Crea la base de datos ejecutando los archivos SQL de la carpeta database/.
//
//   npm run db:setup        -> structure.sql + data.sql (base nueva con datos de ejemplo)
//   npm run db:structure    -> solo structure.sql (base vacía)
//   npm run db:data         -> solo data.sql (la base ya debe existir)
//
// Sirve igual que "mysql -u root -p < database/structure.sql", pero sin necesitar el cliente mysql.
// Usa los datos de conexión del archivo .env.
require('dotenv').config({ quiet: true });
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const FILES = {
  structure: ['structure.sql'],
  data: ['data.sql'],
  all: ['structure.sql', 'data.sql'],
};

async function main() {
  const mode = process.argv[2] || 'all';
  if (!FILES[mode]) {
    console.error('Uso: node scripts/setup-db.js [all|structure|data]');
    process.exit(1);
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || undefined,
    multipleStatements: true, // un archivo .sql tiene muchas sentencias
  });

  try {
    for (const file of FILES[mode]) {
      const sql = fs.readFileSync(path.join(__dirname, '..', 'database', file), 'utf8');
      await connection.query(sql);
      console.log(`${file} ejecutado`);
    }
    console.log('Listo. Ahora puedes iniciar el sitio con: npm start');
  } finally {
    await connection.end();
  }
}

main().catch((err) => {
  console.error('No se pudo preparar la base de datos:', err.message);
  console.error('Revisa que MySQL/MariaDB esté encendido y que el archivo .env tenga los datos correctos.');
  process.exit(1);
});
