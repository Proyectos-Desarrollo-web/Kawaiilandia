// Acceso a datos del carrito con Sequelize. Cada usuario tiene un carrito "open" (el activo).
const { QueryTypes } = require('sequelize');
const { sequelize, Cart, CartItem, Product, Category } = require('../database/models');
const ProductService = require('./product.service');

const MAX_QTY = 10;

async function openCart(userId, { create = false } = {}) {
  let cart = await Cart.findOne({ where: { userId, status: 'open' } });
  if (!cart && create) cart = await Cart.create({ userId, status: 'open' });
  return cart;
}

const CartService = {
  maxQty: MAX_QTY,

  // Ítems del carrito con su producto y el total de cada línea
  async getItems(userId) {
    const cart = await openCart(userId);
    if (!cart) return [];
    const rows = await CartItem.findAll({
      where: { cartId: cart.id },
      include: [{ model: Product, as: 'product', include: [{ model: Category, as: 'category' }] }],
      order: [['id', 'ASC']],
    });
    return rows.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
      option: [item.color, item.size].filter(Boolean).join(' · '),
      product: {
        id: item.product.id,
        slug: item.product.slug,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        category: item.product.category.name,
      },
      lineTotal: item.product.price * item.quantity,
    }));
  },

  // Cantidad total de unidades en el carrito (el número del header). Una sola consulta.
  async count(userId) {
    const [row] = await sequelize.query(
      `SELECT COALESCE(SUM(ci.quantity), 0) AS n
         FROM cart_items ci
         JOIN carts c ON c.id = ci.cart_id
        WHERE c.user_id = :userId AND c.status = 'open'`,
      { replacements: { userId }, type: QueryTypes.SELECT }
    );
    return Number(row.n);
  },

  subtotal(items) {
    return items.reduce((sum, item) => sum + item.lineTotal, 0);
  },

  // Agrega un producto. Si ya hay uno igual (mismo color y tamaño) suma la cantidad.
  // Devuelve { ok: true, product } o { ok: false, error }.
  async addItem(userId, { slug, color = '', size = '', qty = 1 }) {
    const product = await ProductService.findBySlug(String(slug || ''));
    if (!product) return { ok: false, error: 'No encontramos ese producto.' };

    const quantity = Number.parseInt(qty, 10);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QTY) {
      return { ok: false, error: `La cantidad debe estar entre 1 y ${MAX_QTY}.` };
    }

    // Solo se aceptan colores y tamaños que el producto realmente tiene
    const chosenColor = product.colors.length ? String(color) : '';
    const chosenSize = product.sizes.length ? String(size) : '';
    if (product.colors.length && !product.colors.includes(chosenColor)) return { ok: false, error: 'Elige un color válido.' };
    if (product.sizes.length && !product.sizes.includes(chosenSize)) return { ok: false, error: 'Elige un tamaño válido.' };

    const cart = await openCart(userId, { create: true });
    const [item, created] = await CartItem.findOrCreate({
      where: { cartId: cart.id, productId: product.id, color: chosenColor, size: chosenSize },
      defaults: { quantity },
    });
    if (!created) await item.update({ quantity: Math.min(MAX_QTY, item.quantity + quantity) });

    return { ok: true, product };
  },

  // Cambia la cantidad de un ítem (solo si es del carrito del usuario)
  async updateItem(userId, itemId, qty) {
    const quantity = Number.parseInt(qty, 10);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QTY) {
      return { ok: false, error: `La cantidad debe estar entre 1 y ${MAX_QTY}.` };
    }
    const item = await findOwnItem(userId, itemId);
    if (!item) return { ok: false, error: 'No encontramos ese producto en tu carrito.' };
    await item.update({ quantity });
    return { ok: true };
  },

  async removeItem(userId, itemId) {
    const item = await findOwnItem(userId, itemId);
    if (!item) return { ok: false, error: 'No encontramos ese producto en tu carrito.' };
    await item.destroy();
    return { ok: true };
  },
};

// Un usuario solo puede tocar los ítems de su propio carrito
async function findOwnItem(userId, itemId) {
  const id = Number(itemId);
  if (!Number.isInteger(id) || id < 1) return null;
  const cart = await openCart(userId);
  if (!cart) return null;
  return CartItem.findOne({ where: { id, cartId: cart.id } });
}

module.exports = CartService;
