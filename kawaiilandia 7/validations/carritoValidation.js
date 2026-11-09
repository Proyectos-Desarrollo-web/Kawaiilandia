// Validaciones del CARRITO (Express Validator): agregar un producto y cambiar una cantidad.
const { body, param } = require('express-validator');
const Product = require('../services/product.service');
const Cart = require('../services/cart.service');
const { aTexto } = require('./comun');

const cantidad = () =>
    body('qty')
        .customSanitizer(aTexto)
        .trim()
        .isInt({ min: 1, max: Cart.maxQty, allow_leading_zeroes: false }).withMessage(`La cantidad debe ser un número entre 1 y ${Cart.maxQty}`);

const agregar = [
    // El producto debe existir
    body('product')
        .customSanitizer(aTexto)
        .trim()
        .custom(async (slug, { req }) => {
            req.productoCarrito = await Product.findBySlug(slug);
            if (!req.productoCarrito) throw new Error('No encontramos ese producto');
            return true;
        }),

    // El color y el tamaño deben ser de los que tiene ese producto (si el producto los tiene)
    body('color')
        .customSanitizer(aTexto)
        .custom((value, { req }) => {
            const colores = req.productoCarrito ? req.productoCarrito.colors : [];
            if (colores.length && !colores.includes(value)) throw new Error('Elige un color');
            return true;
        }),
    body('size')
        .customSanitizer(aTexto)
        .custom((value, { req }) => {
            const tamanos = req.productoCarrito ? req.productoCarrito.sizes : [];
            if (tamanos.length && !tamanos.includes(value)) throw new Error('Elige un tamaño');
            return true;
        }),

    cantidad(),
];

const actualizar = [param('id').isInt({ min: 1 }).withMessage('Producto no válido'), cantidad()];
const quitar = [param('id').isInt({ min: 1 }).withMessage('Producto no válido')];

module.exports = { agregar, actualizar, quitar };
