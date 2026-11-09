const User = require('../models/user.model');
const { hashPassword, verifyPassword } = require('../utils/password');
const { validateRegister, validateLogin } = require('../utils/validateUser');
const { removeUploaded } = require('../middlewares/upload.middleware');
const { REMEMBER_COOKIE } = require('../middlewares/session.middleware');

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

function renderLogin(res, { values = {}, errors = {}, loginError = null, status = 200 } = {}) {
  res.status(status).render('auth/login', {
    title: 'Ingresar | Kawaiilandia',
    description: 'Ingresa a tu cuenta de Kawaiilandia.',
    active: 'login',
    values,
    errors,
    loginError,
  });
}

const authController = {
  // GET /register
  registerForm(req, res) {
    renderRegister(res);
  },

  // POST /register
  register(req, res) {
    const { errors, values, password, isValid } = validateRegister(req.body, req.uploadError);

    if (!isValid) {
      removeUploaded(req.file); // no dejar fotos huérfanas si el formulario tiene errores
      return renderRegister(res, { values, errors, status: 400 });
    }

    const user = User.create({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: hashPassword(password),
      image: req.file ? `/uploads/avatars/${req.file.filename}` : null,
    });

    // Se regenera el id de sesión al iniciar sesión (evita la fijación de sesión).
    req.session.regenerate((err) => {
      if (err) throw err;
      req.session.user = user;
      req.session.flash = { type: 'ok', message: `¡Bienvenid@ a Kawaiilandia, ${user.firstName}! Tu cuenta fue creada.` };
      res.redirect('/profile');
    });
  },

  // GET /login
  loginForm(req, res) {
    renderLogin(res);
  },

  // POST /login
  login(req, res) {
    const { errors, values, password, remember, isValid } = validateLogin(req.body);
    if (!isValid) return renderLogin(res, { values, errors, status: 400 });

    const found = User.findByEmail(values.email);
    // Mismo mensaje si el correo no existe o la contraseña es incorrecta: no se revela cuál falló.
    if (!found || !verifyPassword(password, found.password)) {
      return renderLogin(res, { values, loginError: 'El correo o la contraseña no son correctos.', status: 401 });
    }

    const returnTo = req.session.returnTo;
    req.session.regenerate((err) => {
      if (err) throw err;
      req.session.user = User.findById(found.id);

      if (remember) {
        // Cookie firmada (cookie-parser + secreto): el navegador no puede modificarla.
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
      // Solo se acepta una ruta interna del sitio (evita redirecciones a otros dominios).
      const safe = typeof returnTo === 'string' && returnTo.startsWith('/') && !returnTo.startsWith('//');
      res.redirect(safe ? returnTo : '/profile');
    });
  },

  // POST /logout
  logout(req, res) {
    res.clearCookie(REMEMBER_COOKIE);
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  },

  // GET /profile
  profile(req, res) {
    res.render('auth/profile', {
      title: 'Mi perfil | Kawaiilandia',
      description: 'Tu perfil en Kawaiilandia.',
      active: 'profile',
      profile: User.findById(req.session.user.id) || req.session.user,
    });
  },
};

module.exports = authController;
