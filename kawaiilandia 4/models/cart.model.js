// Modelo del carrito (datos de ejemplo en memoria).
// Todavía no hay usuarios ni sesiones, así que el carrito es el mismo para todos.
// Cada ítem guarda solo el id del producto; el producto se lee del catálogo.

const Product = require('./product.model');

const items = [
  { productId: 'peluche-kawaii', qty: 1, option: '45 cm' },
  { productId: 'vacas-corredoras', qty: 2, option: 'Blanco y negro' },
  { productId: 'mug-personalizado', qty: 1, option: 'Rosa' },
];

const Cart = {
  getItems() {
    return items
      .map((item) => ({ ...item, product: Product.findById(item.productId) }))
      .filter((item) => item.product)
      .map((item) => ({ ...item, lineTotal: item.product.price * item.qty }));
  },

  count() {
    return this.getItems().reduce((sum, item) => sum + item.qty, 0);
  },

  subtotal() {
    return this.getItems().reduce((sum, item) => sum + item.lineTotal, 0);
  },
};

module.exports = Cart;
