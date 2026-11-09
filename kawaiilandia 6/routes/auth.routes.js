const express = require('express');
const authController = require('../controllers/auth.controller');
const { guest, auth } = require('../middlewares/access.middleware');
const { uploadAvatar } = require('../middlewares/upload.middleware');

const router = express.Router();

// Solo huéspedes (sin sesión)
router.get('/register', guest, authController.registerForm);
router.post('/register', guest, uploadAvatar, authController.register);
router.get('/login', guest, authController.loginForm);
router.post('/login', guest, authController.login);

// Solo usuarios logueados
router.post('/logout', auth, authController.logout);

// Ruta vieja: redirige a la nueva
router.get('/registro', (req, res) => res.redirect(301, '/register'));

module.exports = router;
