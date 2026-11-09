// Modelo de usuarios. Lee data/users.json (los datos incluyen la contraseña hasheada).
// En este sprint solo se leen; el registro y el login con lógica llegan en sprints posteriores.
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'users.json');

const readAll = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

// Nunca se expone la contraseña hacia las vistas.
const publicUser = ({ password, ...rest }) => rest;

const User = {
  findAll() {
    return readAll().map(publicUser);
  },
  findById(id) {
    const user = readAll().find((u) => String(u.id) === String(id));
    return user ? publicUser(user) : null;
  },
  findByEmail(email) {
    return readAll().find((u) => u.email.toLowerCase() === String(email).toLowerCase()) || null;
  },
};

module.exports = User;
