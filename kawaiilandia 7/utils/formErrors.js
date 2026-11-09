// Convierte el resultado de Express Validator en { campo: 'primer mensaje de error' },
// que es la forma que usan las vistas para marcar cada campo.
const { validationResult } = require('express-validator');

function formErrors(req) {
  const errors = {};
  for (const error of validationResult(req).array()) {
    const field = String(error.path).replace(/[[.].*$/, ''); // "colors[0]" -> "colors"
    if (!(field in errors)) errors[field] = error.msg;
  }
  return errors;
}

module.exports = { formErrors };
