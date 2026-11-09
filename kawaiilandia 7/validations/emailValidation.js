// GET /check-email?email=...  (lo usan los formularios de registro y de login para avisar antes de enviar)
const { query } = require('express-validator');
const { aTexto } = require('./comun');

const validaciones = [query('email').customSanitizer(aTexto).trim().isEmail().isLength({ max: 100 })];

module.exports = validaciones;
