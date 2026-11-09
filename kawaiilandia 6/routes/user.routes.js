const express = require('express');
const userController = require('../controllers/user.controller');
const { auth, admin, selfOrAdmin } = require('../middlewares/access.middleware');
const { uploadAvatar } = require('../middlewares/upload.middleware');

const router = express.Router();

// CRUD de usuarios. Crear = registro (/register). No hay borrado de usuarios en este sprint.
router.get('/profile', auth, userController.profile); //                                       Mi perfil
router.get('/profile/edit', auth, (req, res) => res.redirect(`/users/${req.session.user.id}/edit`)); // Atajo para editar mi perfil
router.get('/users', auth, admin, userController.index); //                                    Listado (solo admin)
router.get('/users/:id', auth, selfOrAdmin, userController.detail); //                         Detalle
router.get('/users/:id/edit', auth, selfOrAdmin, userController.editForm); //                  Formulario de edición
router.put('/users/:id', auth, selfOrAdmin, uploadAvatar, userController.update); //           Acción de edición

// Ruta vieja: redirige a la nueva
router.get('/perfil', (req, res) => res.redirect(301, '/profile'));

module.exports = router;
