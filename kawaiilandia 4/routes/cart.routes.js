const express = require('express');
const cartController = require('../controllers/cart.controller');

const router = express.Router();

router.get('/carrito', cartController.show);

module.exports = router;
