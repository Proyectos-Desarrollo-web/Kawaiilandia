const express = require('express');
const mainRoutes = require('./main.routes');
const productRoutes = require('./product.routes');
const cartRoutes = require('./cart.routes');
const authRoutes = require('./auth.routes');

const router = express.Router();

router.use('/', mainRoutes);
router.use('/', productRoutes);
router.use('/', cartRoutes);
router.use('/', authRoutes);

module.exports = router;
