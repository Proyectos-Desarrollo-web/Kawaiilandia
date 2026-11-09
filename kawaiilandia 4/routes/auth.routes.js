const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.get('/registro', authController.registerForm);
router.get('/login', authController.loginForm);

module.exports = router;
