const Cart = require('../services/cart.service');
const { formErrors } = require('../utils/formErrors');
const { wrapController } = require('../utils/asyncHandler');

const cartController = {
  // GET /carrito
  async show(req, res) {
    const items = await Cart.getItems(req.session.user.id);
    res.render('cart/index', {
      title: 'Tu carrito | Kawaiilandia',
      description: 'Revisa los productos de tu carrito y continúa con tu compra en Kawaiilandia.',
      active: 'cart',
      items,
      subtotal: Cart.subtotal(items),
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      maxQty: Cart.maxQty,
    });
  },

  // POST /carrito/items: agrega un producto
  async add(req, res) {
    const { product: slug, color, size, qty } = req.body;
    const errors = formErrors(req);
    if (Object.keys(errors).length) {
      req.session.flash = { type: 'error', message: Object.values(errors)[0] };
      return res.redirect(req.productoCarrito ? `/products/${req.productoCarrito.slug}` : '/products');
    }
    const result = await Cart.addItem(req.session.user.id, { slug, color, size, qty });

    if (!result.ok) {
      req.session.flash = { type: 'error', message: result.error };
      return res.redirect(typeof slug === 'string' && slug ? `/products/${encodeURIComponent(slug)}` : '/products');
    }
    req.session.flash = { type: 'ok', message: `Agregamos "${result.product.name}" a tu carrito.` };
    res.redirect('/carrito');
  },

  // PUT /carrito/items/:id: cambia la cantidad
  async update(req, res) {
    const errors = formErrors(req);
    if (Object.keys(errors).length) {
      req.session.flash = { type: 'error', message: Object.values(errors)[0] };
      return res.redirect('/carrito');
    }
    const result = await Cart.updateItem(req.session.user.id, req.params.id, req.body.qty);
    req.session.flash = result.ok ? { type: 'ok', message: 'Cantidad actualizada.' } : { type: 'error', message: result.error };
    res.redirect('/carrito');
  },

  // DELETE /carrito/items/:id: quita un producto
  async remove(req, res) {
    const errors = formErrors(req);
    if (Object.keys(errors).length) {
      req.session.flash = { type: 'error', message: Object.values(errors)[0] };
      return res.redirect('/carrito');
    }
    const result = await Cart.removeItem(req.session.user.id, req.params.id);
    req.session.flash = result.ok ? { type: 'ok', message: 'Quitamos el producto de tu carrito.' } : { type: 'error', message: result.error };
    res.redirect('/carrito');
  },
};

module.exports = wrapController(cartController);
