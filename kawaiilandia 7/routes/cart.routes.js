const express = require('express');
const cartController = require('../controllers/cart.controller');
const { auth } = require('../middlewares/access.middleware');
const carritoValidation = require('../validations/carritoValidation');

const router = express.Router();

// Solo usuarios logueados
router.get('/carrito', auth, cartController.show); //                      Ver el carrito
router.post('/carrito/items', auth, carritoValidation.agregar, cartController.add); //                Agregar un producto
router.put('/carrito/items/:id', auth, carritoValidation.actualizar, cartController.update); //          Cambiar la cantidad
router.delete('/carrito/items/:id', auth, carritoValidation.quitar, cartController.remove); //       Quitar un producto

module.exports = router;
