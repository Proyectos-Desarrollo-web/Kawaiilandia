// Validaciones de la CREACIÓN y la MODIFICACIÓN de productos (Express Validator).
const { body } = require('express-validator');
const Product = require('../services/product.service');
const { aTexto, aLista, imagen } = require('./comun');

// En la creación la imagen es obligatoria; al editar es opcional (si no se sube una nueva, se conserva la actual)
function reglas({ imagenObligatoria }) {
    return [
        // Nombre: obligatorio, mínimo 5 caracteres
        body('name')
            .customSanitizer(aTexto)
            .trim()
            .notEmpty().withMessage('El nombre es obligatorio').bail()
            .isLength({ min: 5 }).withMessage('El nombre debe tener al menos 5 caracteres').bail()
            .isLength({ max: 60 }).withMessage('El nombre no puede tener más de 60 caracteres'),

        // Descripción: mínimo 20 caracteres
        body('description')
            .customSanitizer(aTexto)
            .trim()
            .notEmpty().withMessage('La descripción es obligatoria').bail()
            .isLength({ min: 20 }).withMessage('La descripción debe tener al menos 20 caracteres').bail()
            .isLength({ max: 400 }).withMessage('La descripción no puede tener más de 400 caracteres'),

        // La categoría debe existir en la base de datos
        body('category')
            .customSanitizer(aTexto)
            .trim()
            .notEmpty().withMessage('Selecciona una categoría').bail()
            .custom(async (value) => {
                const nombres = (await Product.categories()).map((c) => c.name);
                if (!nombres.includes(value)) throw new Error('Selecciona una categoría de la lista');
                return true;
            }),

        body('price')
            .customSanitizer(aTexto)
            .trim()
            .notEmpty().withMessage('El precio es obligatorio').bail()
            .matches(/^\d+$/).withMessage('El precio debe ser un número entero, sin puntos ni comas').bail()
            .custom((value) => Number(value) >= 100 && Number(value) <= 10000000).withMessage('El precio debe estar entre $100 y $10.000.000'),

        body('tag').customSanitizer(aTexto).trim().isLength({ max: 20 }).withMessage('La etiqueta no puede tener más de 20 caracteres'),
        body('material').customSanitizer(aTexto).trim().isLength({ max: 80 }).withMessage('El material no puede tener más de 80 caracteres'),

        // Los colores y tamaños deben existir en la base de datos
        body('colors')
            .customSanitizer(aLista)
            .custom(async (nombres) => {
                if (!(await Product.allExist('color', nombres))) throw new Error('Elige solo colores de la lista');
                return true;
            }),
        body('sizes')
            .customSanitizer(aLista)
            .custom(async (nombres) => {
                if (!(await Product.allExist('size', nombres))) throw new Error('Elige solo tamaños de la lista');
                return true;
            }),

        // Imagen: archivo JPG, JPEG, PNG o GIF
        imagen('image', { obligatoria: imagenObligatoria, mensajeObligatoria: 'Sube una imagen del producto (JPG, JPEG, PNG o GIF)' }),
    ];
}

module.exports = { validacionesCrear: reglas({ imagenObligatoria: true }), validacionesEditar: reglas({ imagenObligatoria: false }) };
