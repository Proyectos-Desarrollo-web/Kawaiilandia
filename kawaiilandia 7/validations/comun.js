// Reglas reutilizables para las validaciones con Express Validator.
// Las mismas reglas y mensajes están en el navegador (public/js/validaciones.js).
const { body } = require('express-validator');

// Un campo que no sea texto (por ejemplo, repetido y enviado como arreglo) se trata como vacío
const aTexto = (value) => (typeof value === 'string' ? value : '');
const aLista = (value) => (Array.isArray(value) ? value.filter((v) => typeof v === 'string') : typeof value === 'string' && value ? [value] : []);

const REGEX_NOMBRE = /^[\p{L}][\p{L}\s'’.-]*$/u;
const MENSAJE_CONTRASENA = 'La contraseña debe tener mayúsculas, minúsculas, un número y un carácter especial';

// Nombre o apellido: obligatorio, de 2 a 40 caracteres, solo letras, espacios, apóstrofes, puntos y guiones
function nombrePersona(campo, etiqueta) {
  return body(campo)
    .customSanitizer(aTexto)
    .trim()
    .notEmpty().withMessage(`El ${etiqueta} es obligatorio`).bail()
    .isLength({ min: 2 }).withMessage(`El ${etiqueta} debe tener al menos 2 caracteres`).bail()
    .isLength({ max: 40 }).withMessage(`El ${etiqueta} no puede tener más de 40 caracteres`).bail()
    .matches(REGEX_NOMBRE).withMessage(`El ${etiqueta} solo puede tener letras, espacios, apóstrofes y guiones`);
}

// Email: obligatorio y con formato válido (se guarda en minúsculas)
function email(campo = 'email') {
  return body(campo)
    .customSanitizer(aTexto)
    .trim()
    .toLowerCase()
    .notEmpty().withMessage('El email es obligatorio').bail()
    .isEmail().withMessage('Ingresa un email válido (ejemplo@correo.com)').bail()
    .isLength({ max: 100 }).withMessage('El email no puede tener más de 100 caracteres');
}

// Contraseña nueva: mínimo 8 caracteres, con mayúsculas, minúsculas, un número y un carácter especial
function contrasenaFuerte(cadena) {
  return cadena
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres').bail()
    .isLength({ max: 64 }).withMessage('La contraseña no puede tener más de 64 caracteres').bail()
    .custom((value) => /\p{Ll}/u.test(value) && /\p{Lu}/u.test(value) && /\d/.test(value) && /[^\p{L}\p{N}\s]/u.test(value))
    .withMessage(MENSAJE_CONTRASENA);
}

// Imagen: el archivo ya pasó por Multer. Aquí solo se muestra su error y, si es obligatoria, se exige que exista.
function imagen(campo, { obligatoria = false, mensajeObligatoria = 'Sube una imagen (JPG, JPEG, PNG o GIF)' } = {}) {
  return body(campo).custom((_, { req }) => {
    if (req.uploadError) throw new Error(req.uploadError);
    if (obligatoria && !req.file) throw new Error(mensajeObligatoria);
    return true;
  });
}

module.exports = { aTexto, aLista, nombrePersona, email, contrasenaFuerte, imagen, MENSAJE_CONTRASENA };
