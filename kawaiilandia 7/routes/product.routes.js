const express = require('express');
const productController = require('../controllers/product.controller');
const { auth, admin } = require('../middlewares/access.middleware');
const { uploadProductImage } = require('../middlewares/upload.middleware');
const { validacionesCrear, validacionesEditar } = require('../validations/productoValidation');

const router = express.Router();

// CRUD de productos. Importante: /products/create va antes de /products/:id
// Ver listado y detalle: cualquier visitante. Crear, editar y borrar: solo administradores.
// En crear y editar el orden importa: primero el acceso, luego Multer (lee la imagen y el formulario),
// luego las validaciones (Express Validator) y al final el controlador.
router.get('/products', productController.index); //                          Listado
router.get('/products/create', auth, admin, productController.newForm); //    Formulario de creación
router.get('/products/:id', productController.detail); //                     Detalle
router.post('/products', auth, admin, uploadProductImage, validacionesCrear, productController.create); //    Acción de creación
router.get('/products/:id/edit', auth, admin, productController.editForm); // Formulario de edición
router.put('/products/:id', auth, admin, uploadProductImage, validacionesEditar, productController.update); // Acción de edición
router.delete('/products/:id', auth, admin, productController.destroy); //    Acción de borrado

// Rutas viejas (/producto, /productos...): redirigen a las nuevas
router.get('/producto', (req, res) => res.redirect(301, '/products'));
router.get('/productos', (req, res) => {
  const query = req.originalUrl.includes('?') ? req.originalUrl.slice(req.originalUrl.indexOf('?')) : '';
  res.redirect(301, '/products' + query);
});
router.get('/productos/nuevo', (req, res) => res.redirect(301, '/products/create'));
router.get('/productos/:id/editar', (req, res) => res.redirect(301, `/products/${req.params.id}/edit`));
router.get('/productos/:id', (req, res) => res.redirect(301, `/products/${req.params.id}`));

module.exports = router;
