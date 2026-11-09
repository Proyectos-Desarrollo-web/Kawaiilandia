// Middlewares de APLICACIÓN: se ejecutan en cada pedido.
const User = require('../models/user.model');
const Cart = require('../models/cart.model');

const REMEMBER_COOKIE = 'remember';

// 1. Mensajes "flash": se guardan en la sesión y se muestran una sola vez en la siguiente página.
function flash(req, res, next) {
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;
  next();
}

// 2. Usuario logueado: toma al usuario de la sesión o, si no hay sesión,
//    lo recupera con la cookie firmada de "Recordarme". Deja `authUser` disponible en todas las vistas.
function userLogged(req, res, next) {
  if (!req.session.user && req.signedCookies[REMEMBER_COOKIE]) {
    const user = User.findById(req.signedCookies[REMEMBER_COOKIE]);
    if (user) {
      req.session.user = user;
    } else {
      res.clearCookie(REMEMBER_COOKIE); // la cookie apunta a un usuario que ya no existe
    }
  }
  res.locals.authUser = req.session.user || null;
  res.locals.isAdmin = !!(req.session.user && req.session.user.category === 'admin');
  res.locals.cartCount = req.session.user ? Cart.count() : 0;
  next();
}

module.exports = { flash, userLogged, REMEMBER_COOKIE };
