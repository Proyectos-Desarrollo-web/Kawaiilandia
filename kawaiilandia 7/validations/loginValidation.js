// Validaciones del login (Express Validator): el email debe existir en la base y la contraseña debe coincidir.
const { body } = require('express-validator');
const User = require('../services/user.service');
const { verifyPassword } = require('../utils/password');
const { aTexto, email } = require('./comun');

const validaciones = [
    // Email: obligatorio, formato válido y debe existir en la base. El usuario encontrado se guarda en req.usuarioLogin
    email().bail().custom(async (value, { req }) => {
        const usuario = await User.findByEmail(value);
        if (!usuario) throw new Error('No existe una cuenta con ese email');
        req.usuarioLogin = usuario;
        return true;
    }),

    // Contraseña: obligatoria y debe coincidir con la guardada (solo se compara si el email existe)
    body('password')
        .customSanitizer(aTexto)
        .notEmpty().withMessage('La contraseña es obligatoria').bail()
        .custom((value, { req }) => {
            if (req.usuarioLogin && !verifyPassword(value, req.usuarioLogin.password)) throw new Error('La contraseña es incorrecta');
            return true;
        }),
];

module.exports = validaciones;
