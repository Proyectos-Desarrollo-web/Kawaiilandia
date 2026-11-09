// Genera data/users.json con usuarios de ejemplo (contraseñas hasheadas con scrypt).
// Uso: node scripts/seed-users.js
// Contraseña de todos los usuarios de ejemplo: Kawaii2026!
const fs = require('fs');
const path = require('path');
const { hashPassword } = require('../utils/password');

const PASSWORD = 'Kawaii2026!';
const base = [
  ['Valentina', 'Rojas', 'valentina.rojas@example.com', 'admin'],
  ['Sebastián', 'Mendoza', 'sebastian.mendoza@example.com', 'admin'],
  ['Camila', 'Torres', 'camila.torres@example.com', 'customer'],
  ['Juan', 'Gómez', 'juan.gomez@example.com', 'customer'],
  ['Laura', 'Pinzón', 'laura.pinzon@example.com', 'customer'],
  ['Andrés', 'Quintero', 'andres.quintero@example.com', 'customer'],
  ['Daniela', 'Ortiz', 'daniela.ortiz@example.com', 'customer'],
  ['Mateo', 'Vargas', 'mateo.vargas@example.com', 'customer'],
];

const users = base.map(([firstName, lastName, email, category], i) => ({
  id: i + 1,
  firstName,
  lastName,
  email,
  password: hashPassword(PASSWORD),
  category,
  image: '/img/logo.svg',
}));

fs.writeFileSync(path.join(__dirname, '..', 'data', 'users.json'), JSON.stringify(users, null, 2) + '\n');
console.log(`data/users.json generado con ${users.length} usuarios.`);
