// Validaciones del registro (Express Validator)
const { body } = require('express-validator');
const User = require('../services/user.service');
const { aTexto, nombrePersona, email, contrasenaFuerte, imagen } = require('./comun');

const validaciones = [
    // Nombre y apellido: obligatorios, mínimo 2 caracteres
    nombrePersona('firstName', 'nombre'),
    nombrePersona('lastName', 'apellido'),

    // Email: obligatorio, formato válido y no repetido
    email().bail().custom(async (value) => {
        if (await User.findByEmail(value)) throw new Error('Ya existe una cuenta con ese email. ¿Quieres ingresar?');
        return true;
    }),

    // Contraseña: obligatoria, mínimo 8 caracteres, con mayúsculas, minúsculas, número y carácter especial
    contrasenaFuerte(
        body('password')
            .customSanitizer(aTexto)
            .notEmpty().withMessage('La contraseña es obligatoria').bail()
    ),

    // Que las contraseñas coincidan
    body('repassword')
        .customSanitizer(aTexto)
        .notEmpty().withMessage('Confirma tu contraseña').bail()
        .custom((value, { req }) => value === req.body.password).withMessage('Las contraseñas no coinciden'),

    body('terms').custom((value) => !!value).withMessage('Debes aceptar los términos y condiciones'),

    // Imagen: opcional, pero si se sube debe ser un archivo JPG, JPEG, PNG o GIF
    imagen('avatar'),
];

module.exports = validaciones;
