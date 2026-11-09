// Validación de los formularios de usuario: registro, login y edición.
// Son funciones puras: las consultas a la base (¿el correo ya existe?, ¿la contraseña actual es correcta?)
// las hace el controlador y le pasa el resultado.

const text = (value) => (typeof value === 'string' ? value.trim() : '');
const raw = (value) => (typeof value === 'string' ? value : '');
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateNames(values, errors) {
  if (values.firstName.length < 2 || values.firstName.length > 40) {
    errors.firstName = 'El nombre debe tener entre 2 y 40 caracteres.';
  }
  if (values.lastName.length < 2 || values.lastName.length > 40) {
    errors.lastName = 'El apellido debe tener entre 2 y 40 caracteres.';
  }
}

function validateEmail(values, errors, emailTaken) {
  if (!EMAIL_REGEX.test(values.email) || values.email.length > 100) {
    errors.email = 'Ingresa un correo válido. Ejemplo: nombre@correo.com.';
  } else if (emailTaken) {
    errors.email = 'Ya existe una cuenta con ese correo.';
  }
}

function validateRegister(body, { uploadError, emailTaken }) {
  const errors = {};
  const values = { firstName: text(body.firstName), lastName: text(body.lastName), email: text(body.email) };
  const password = raw(body.password);
  const password2 = raw(body.password2);

  validateNames(values, errors);
  validateEmail(values, errors, emailTaken);

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
  const password = raw(body.password);

  if (!EMAIL_REGEX.test(values.email)) errors.email = 'Ingresa un correo válido.';
  if (!password) errors.password = 'Ingresa tu contraseña.';

  return { errors, values, password, remember: !!body.remember, isValid: Object.keys(errors).length === 0 };
}

// Edición de un usuario.
//  - emailTaken: otro usuario ya usa ese correo.
//  - needsCurrentPassword: quien edita es el mismo dueño de la cuenta (un admin editando a otro no la necesita).
//  - currentPasswordOk: la contraseña actual escrita coincide con la guardada.
//  - canChangeCategory: solo un admin editando a otra persona puede cambiar el tipo de cuenta.
function validateEdit(body, { uploadError, emailTaken, needsCurrentPassword, currentPasswordOk, canChangeCategory, categories }) {
  const errors = {};
  const values = {
    firstName: text(body.firstName),
    lastName: text(body.lastName),
    email: text(body.email),
    category: text(body.category),
  };
  const newPassword = raw(body.password);
  const newPassword2 = raw(body.password2);

  validateNames(values, errors);
  validateEmail(values, errors, emailTaken);

  // La contraseña solo se cambia si se escribe una nueva
  if (newPassword) {
    if (newPassword.length < 8 || newPassword.length > 64) {
      errors.password = 'La contraseña nueva debe tener entre 8 y 64 caracteres.';
    }
    if (newPassword2 !== newPassword) {
      errors.password2 = 'Las contraseñas no coinciden.';
    }
    if (needsCurrentPassword && !currentPasswordOk) {
      errors.currentPassword = 'La contraseña actual no es correcta.';
    }
  }

  if (canChangeCategory && !categories.includes(values.category)) {
    errors.category = 'Selecciona un tipo de cuenta válido.';
  }
  if (uploadError) errors.avatar = uploadError;

  return { errors, values, newPassword, isValid: Object.keys(errors).length === 0 };
}

module.exports = { validateRegister, validateLogin, validateEdit };
