const User = require('../services/user.service');
const { hashPassword } = require('../utils/password');
const { formErrors } = require('../utils/formErrors');
const { removeUploaded } = require('../middlewares/upload.middleware');
const { REMEMBER_COOKIE } = require('../middlewares/session.middleware');
const { wrapController } = require('../utils/asyncHandler');

const REMEMBER_DAYS = 30;

function renderRegister(res, { values = {}, errors = {}, status = 200 } = {}) {
  res.status(status).render('auth/register', {
    title: 'Crear cuenta | Kawaiilandia',
    description: 'Regístrate en Kawaiilandia para ver tu historial de compras y comprar más rápido.',
    active: 'register',
    values,
    errors,
  });
}

function renderLogin(res, { values = {}, errors = {}, status = 200 } = {}) {
  res.status(status).render('auth/login', {
    title: 'Ingresar | Kawaiilandia',
    description: 'Ingresa a tu cuenta de Kawaiilandia.',
    active: 'login',
    values,
    errors,
  });
}

const authController = {
  // GET /register
  async registerForm(req, res) {
    renderRegister(res);
  },

  // POST /register
  async register(req, res) {
    const errors = formErrors(req);
    if (Object.keys(errors).length) {
      removeUploaded(req.file); // no dejar fotos huérfanas si el formulario tiene errores
      const { firstName, lastName, email } = req.body;
      return renderRegister(res, { values: { firstName, lastName, email }, errors, status: 400 });
    }

    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashPassword(req.body.password),
      image: req.file ? `/uploads/avatars/${req.file.filename}` : null,
    });

    // Se regenera el id de sesión al iniciar sesión
    req.session.regenerate((err) => {
      if (err) throw err;
      req.session.user = user;
      req.session.flash = { type: 'ok', message: `¡Bienvenid@ a Kawaiilandia, ${user.firstName}! Tu cuenta fue creada.` };
      res.redirect('/profile');
    });
  },

  // GET /login
  async loginForm(req, res) {
    renderLogin(res);
  },

  // POST /login (loginValidation ya comprobó el email y la contraseña)
  async login(req, res) {
    const errors = formErrors(req);
    if (Object.keys(errors).length) return renderLogin(res, { values: { email: req.body.email }, errors, status: 400 });

    const found = req.usuarioLogin;
    const remember = !!req.body.remember;

    const returnTo = req.session.returnTo;
    req.session.regenerate((err) => {
      if (err) throw err;
      const { password: _hash, ...user } = found; // la sesión nunca guarda el hash
      req.session.user = user;

      if (remember) {
        // Cookie firmada
        res.cookie(REMEMBER_COOKIE, String(found.id), {
          signed: true,
          httpOnly: true,
          sameSite: 'lax',
          maxAge: REMEMBER_DAYS * 24 * 60 * 60 * 1000,
        });
      } else {
        res.clearCookie(REMEMBER_COOKIE);
      }

      req.session.flash = { type: 'ok', message: `¡Hola de nuevo, ${found.firstName}!` };
      // Solo se acepta una ruta interna del sitio
      const safe = typeof returnTo === 'string' && returnTo.startsWith('/') && !returnTo.startsWith('//');
      res.redirect(safe ? returnTo : '/profile');
    });
  },

  // GET /check-email?email=...  Responde si un correo está libre
  async checkEmail(req, res) {
    res.set('Cache-Control', 'no-store');
    if (Object.keys(formErrors(req)).length) return res.json({ valid: false, available: null });
    res.json({ valid: true, available: !(await User.findByEmail(req.query.email)) });
  },

  // POST /logout
  async logout(req, res) {
    res.clearCookie(REMEMBER_COOKIE);
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  },
};

module.exports = wrapController(authController);
