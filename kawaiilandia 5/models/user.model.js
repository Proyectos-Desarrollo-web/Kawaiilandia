// Modelo de usuarios. Lee y escribe data/users.json (la contraseña se guarda siempre hasheada).
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'users.json');
const DEFAULT_IMAGE = '/img/logo.svg';

const readAll = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const writeAll = (users) => fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2) + '\n');

// Nunca se expone la contraseña hacia las vistas ni hacia la sesión.
const publicUser = ({ password, ...rest }) => rest;

const User = {
  defaultImage: DEFAULT_IMAGE,

  findAll() {
    return readAll().map(publicUser);
  },

  findById(id) {
    const user = readAll().find((u) => String(u.id) === String(id));
    return user ? publicUser(user) : null;
  },

  // Devuelve el usuario completo (con hash) para poder verificar la contraseña en el login.
  findByEmail(email) {
    return readAll().find((u) => u.email.toLowerCase() === String(email).trim().toLowerCase()) || null;
  },

  // Los usuarios que se registran desde el sitio siempre son "customer".
  create({ firstName, lastName, email, password, image }) {
    const users = readAll();
    const id = users.reduce((max, u) => Math.max(max, Number(u.id) || 0), 0) + 1;
    const user = {
      id,
      firstName,
      lastName,
      email: email.toLowerCase(),
      password, // ya viene hasheada desde utils/password.js
      category: 'customer',
      image: image || DEFAULT_IMAGE,
    };
    users.push(user);
    writeAll(users);
    return publicUser(user);
  },
};

module.exports = User;
