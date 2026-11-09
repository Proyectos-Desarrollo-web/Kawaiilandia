const express = require('express');
const cartController = require('../controllers/cart.controller');
const { auth } = require('../middlewares/access.middleware');

const router = express.Router();

// Solo usuarios logueados
router.get('/carrito', auth, cartController.show);

module.exports = router;
