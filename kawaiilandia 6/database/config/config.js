// Configuración de Sequelize. Los valores salen del archivo .env (ver .env.example).
require('dotenv').config({ quiet: true });

const base = {
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || null,
  database: process.env.DB_NAME || 'kawaiilandia',
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  dialect: 'mysql', // también funciona con MariaDB
  logging: false,
  define: {
    underscored: true, // createdAt -> created_at, categoryId -> category_id
  },
};

// sequelize-cli espera un objeto por entorno
module.exports = {
  development: base,
  test: { ...base, database: process.env.DB_NAME_TEST || `${base.database}_test` },
  production: base,
};
