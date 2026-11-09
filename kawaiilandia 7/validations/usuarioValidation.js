// Validaciones de la EDICIÓN de usuarios (Express Validator).
const { body } = require('express-validator');
const User = require('../services/user.service');
const { verifyPassword } = require('../utils/password');
const { aTexto, nombrePersona, email, contrasenaFuerte, imagen } = require('./comun');

const esElMismo = (req) => String(req.session.user.id) === String(req.params.id);
// Solo un admin puede cambiar el tipo de cuenta, y solo de otra persona
const puedeCambiarTipo = (req) => req.session.user.category === 'admin' && !esElMismo(req);
const quiereNuevaContrasena = (req) => aTexto(req.body.password) !== '';

const validaciones = [
    nombrePersona('firstName', 'nombre'),
    nombrePersona('lastName', 'apellido'),

    // El email no puede ser de otra persona (el propio email sí se puede conservar)
    email().bail().custom(async (value, { req }) => {
        const dueno = await User.findByEmail(value);
        if (dueno && String(dueno.id) !== String(req.params.id)) throw new Error('Ya existe una cuenta con ese email');
        return true;
    }),

    body('category')
        .if((value, { req }) => puedeCambiarTipo(req))
        .isIn(User.categories).withMessage('Selecciona un tipo de cuenta válido'),

    // La contraseña solo se cambia si se escribe una nueva
    contrasenaFuerte(body('password').customSanitizer(aTexto).if((value) => value !== '')),
    body('repassword')
        .customSanitizer(aTexto)
        .if((value, { req }) => quiereNuevaContrasena(req))
        .custom((value, { req }) => value === req.body.password).withMessage('Las contraseñas no coinciden'),
    // El dueño de la cuenta debe confirmar con su contraseña actual para cambiarla
    body('currentPassword')
        .customSanitizer(aTexto)
        .if((value, { req }) => quiereNuevaContrasena(req) && esElMismo(req))
        .custom(async (value, { req }) => {
            const hash = await User.getPasswordHash(req.params.id);
            if (!hash || !verifyPassword(value, hash)) throw new Error('La contraseña actual no es correcta');
            return true;
        }),

    imagen('avatar'),
];

module.exports = { validaciones, puedeCambiarTipo, esElMismo };
