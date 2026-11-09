// Middlewares de APLICACIÓN: se ejecutan en cada pedido.
const User = require('../services/user.service');
const Cart = require('../services/cart.service');
const { wrap } = require('../utils/asyncHandler');

const REMEMBER_COOKIE = 'remember';

// 1. Mensajes "flash": se guardan en la sesión y se muestran una sola vez en la siguiente página.
function flash(req, res, next) {
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;
  next();
}

// 2. Usuario logueado: toma al usuario de la sesión o, si no hay sesión, lo recupera con la cookie
//    firmada de "Recordarme". Además lo vuelve a leer de la base en cada pedido, así un cambio de nombre,
//    foto o tipo de cuenta se ve al instante. Deja `authUser`, `isAdmin` y `cartCount` en todas las vistas.
const userLogged = wrap(async (req, res, next) => {
  let userId = req.session.user ? req.session.user.id : null;

  if (!userId && req.signedCookies[REMEMBER_COOKIE]) {
    userId = req.signedCookies[REMEMBER_COOKIE];
  }

  let user = userId ? await User.findById(userId) : null;
  if (userId && !user) {
    // la sesión o la cookie apuntan a un usuario que ya no existe
    delete req.session.user;
    res.clearCookie(REMEMBER_COOKIE);
  }
  if (user) req.session.user = user;

  res.locals.authUser = user;
  res.locals.isAdmin = !!(user && user.category === 'admin');
  res.locals.cartCount = user ? await Cart.count(user.id) : 0;
  next();
});

module.exports = { flash, userLogged, REMEMBER_COOKIE };
