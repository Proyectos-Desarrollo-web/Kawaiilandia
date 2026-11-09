const Cart = require('../models/cart.model');

const cartController = {
  show(req, res) {
    res.render('cart/index', {
      title: 'Tu carrito | Kawaiilandia',
      description: 'Revisa los productos de tu carrito y continúa con tu compra en Kawaiilandia.',
      active: 'cart',
      items: Cart.getItems(),
      subtotal: Cart.subtotal(),
      count: Cart.count(),
    });
  },
};

module.exports = cartController;
