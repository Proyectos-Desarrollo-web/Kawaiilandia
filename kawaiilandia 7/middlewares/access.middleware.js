// Middlewares de RUTA: se ponen solo en las rutas que necesitan protección.

// Solo huéspedes (visitantes sin login): login y registro.
// Si ya hay sesión, no tiene sentido mostrar esas páginas, así que se manda al perfil.
function guest(req, res, next) {
  if (req.session.user) return res.redirect('/profile');
  next();
}

// Solo usuarios logueados: perfil, carrito, etc.
// Se recuerda la página pedida para volver a ella después de ingresar.
function auth(req, res, next) {
  if (req.session.user) return next();
  if (req.method === 'GET') req.session.returnTo = req.originalUrl;
  req.session.flash = { type: 'error', message: 'Inicia sesión para continuar.' };
  res.redirect('/login');
}

// Solo administradores (se usa después de `auth`): crear, editar y borrar productos.
function admin(req, res, next) {
  if (req.session.user && req.session.user.category === 'admin') return next();
  res.status(403).render('errors/403', { title: 'Acceso restringido | Kawaiilandia' });
}

// Solo el propio usuario o un administrador (se usa después de `auth`): ver y editar un usuario.
function selfOrAdmin(req, res, next) {
  const me = req.session.user;
  if (me && (me.category === 'admin' || String(me.id) === String(req.params.id))) return next();
  res.status(403).render('errors/403', { title: 'Acceso restringido | Kawaiilandia' });
}

module.exports = { guest, auth, admin, selfOrAdmin };
