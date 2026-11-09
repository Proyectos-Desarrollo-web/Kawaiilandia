const express = require('express');
const cartController = require('../controllers/cart.controller');
const { auth } = require('../middlewares/access.middleware');

const router = express.Router();

// Solo usuarios logueados
router.get('/carrito', auth, cartController.show); //                      Ver el carrito
router.post('/carrito/items', auth, cartController.add); //                Agregar un producto
router.put('/carrito/items/:id', auth, cartController.update); //          Cambiar la cantidad
router.delete('/carrito/items/:id', auth, cartController.remove); //       Quitar un producto

module.exports = router;
