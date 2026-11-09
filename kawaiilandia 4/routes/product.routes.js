const express = require('express');
const productController = require('../controllers/product.controller');

const router = express.Router();

// CRUD de productos. Importante: /products/create va antes de /products/:id
router.get('/products', productController.index); //            Listado
router.get('/products/create', productController.newForm); //   Formulario de creación
router.get('/products/:id', productController.detail); //       Detalle
router.post('/products', productController.create); //          Acción de creación
router.get('/products/:id/edit', productController.editForm); // Formulario de edición
router.put('/products/:id', productController.update); //       Acción de edición
router.delete('/products/:id', productController.destroy); //   Acción de borrado

// Rutas de sprints anteriores (/producto, /productos...), conservadas para que los enlaces viejos sigan funcionando
router.get('/producto', (req, res) => res.redirect(301, '/products'));
router.get('/productos', (req, res) => {
  const query = req.originalUrl.includes('?') ? req.originalUrl.slice(req.originalUrl.indexOf('?')) : '';
  res.redirect(301, '/products' + query);
});
router.get('/productos/nuevo', (req, res) => res.redirect(301, '/products/create'));
router.get('/productos/:id/editar', (req, res) => res.redirect(301, `/products/${req.params.id}/edit`));
router.get('/productos/:id', (req, res) => res.redirect(301, `/products/${req.params.id}`));

module.exports = router;
