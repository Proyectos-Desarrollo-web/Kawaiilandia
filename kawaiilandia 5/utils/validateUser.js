// Validación de los formularios de registro y login.
const User = require('../models/user.model');

const text = (value) => (typeof value === 'string' ? value.trim() : '');
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateRegister(body, uploadError) {
  const errors = {};
  const values = {
    firstName: text(body.firstName),
    lastName: text(body.lastName),
    email: text(body.email),
  };
  const password = typeof body.password === 'string' ? body.password : '';
  const password2 = typeof body.password2 === 'string' ? body.password2 : '';

  if (values.firstName.length < 2 || values.firstName.length > 40) {
    errors.firstName = 'El nombre debe tener entre 2 y 40 caracteres.';
  }
  if (values.lastName.length < 2 || values.lastName.length > 40) {
    errors.lastName = 'El apellido debe tener entre 2 y 40 caracteres.';
  }

  if (!EMAIL_REGEX.test(values.email) || values.email.length > 100) {
    errors.email = 'Ingresa un correo válido. Ejemplo: nombre@correo.com.';
  } else if (User.findByEmail(values.email)) {
    errors.email = 'Ya existe una cuenta con ese correo. Prueba ingresando.';
  }

  if (password.length < 8 || password.length > 64) {
    errors.password = 'La contraseña debe tener entre 8 y 64 caracteres.';
  }
  if (password2 !== password) {
    errors.password2 = 'Las contraseñas no coinciden.';
  }

  if (!body.terms) {
    errors.terms = 'Debes aceptar los términos y condiciones para registrarte.';
  }

  if (uploadError) errors.avatar = uploadError;

  return { errors, values, password, isValid: Object.keys(errors).length === 0 };
}

function validateLogin(body) {
  const errors = {};
  const values = { email: text(body.email) };
  const password = typeof body.password === 'string' ? body.password : '';

  if (!EMAIL_REGEX.test(values.email)) errors.email = 'Ingresa un correo válido.';
  if (!password) errors.password = 'Ingresa tu contraseña.';

  return { errors, values, password, remember: !!body.remember, isValid: Object.keys(errors).length === 0 };
}

module.exports = { validateRegister, validateLogin };
