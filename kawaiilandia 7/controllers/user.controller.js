const User = require('../services/user.service');
const { hashPassword } = require('../utils/password');
const { formErrors } = require('../utils/formErrors');
const { puedeCambiarTipo } = require('../validations/usuarioValidation');
const { removeUploaded, removeStoredImage } = require('../middlewares/upload.middleware');
const { parsePage } = require('../utils/pagination');
const { wrapController } = require('../utils/asyncHandler');

function notFound(res) {
  res.status(404).render('errors/404', { title: 'Usuario no encontrado | Kawaiilandia' });
}

// Qué puede hacer quien edita sobre la cuenta que está editando
function editRules(me, target) {
  const isSelf = String(me.id) === String(target.id);
  return {
    isSelf,
    needsCurrentPassword: isSelf, //                             el dueño debe confirmar con su contraseña actual
    canChangeCategory: puedeCambiarTipo({ session: { user: me }, params: { id: target.id } }), // un admin no puede quitarse su propio rol
  };
}

function renderDetail(res, req, target) {
  const isSelf = String(req.session.user.id) === String(target.id);
  res.render('users/detail', {
    title: (isSelf ? 'Mi perfil' : `${target.firstName} ${target.lastName}`) + ' | Kawaiilandia',
    description: 'Perfil de usuario en Kawaiilandia.',
    active: isSelf ? 'profile' : 'users',
    profile: target,
    isSelf,
  });
}

function renderEdit(res, req, { target, values, errors = {}, status = 200 }) {
  const rules = editRules(req.session.user, target);
  res.status(status).render('users/edit', {
    title: 'Editar perfil | Kawaiilandia',
    description: 'Edita los datos de la cuenta.',
    active: rules.isSelf ? 'profile' : 'users',
    target,
    values,
    errors,
    categories: User.categories,
    ...rules,
  });
}

const userController = {
  // GET /profile: el detalle del usuario que inició sesión
  async profile(req, res) {
    const me = await User.findById(req.session.user.id);
    renderDetail(res, req, me);
  },

  // GET /users (solo admin): listado paginado
  async index(req, res) {
    const { users, pagination } = await User.findPage(parsePage(req.query.page));
    res.render('users/index', {
      title: 'Usuarios | Kawaiilandia',
      description: 'Usuarios registrados en Kawaiilandia.',
      active: 'users',
      users,
      pagination,
    });
  },

  // GET /users/:id
  async detail(req, res) {
    const target = await User.findById(req.params.id);
    if (!target) return notFound(res);
    renderDetail(res, req, target);
  },

  // GET /users/:id/edit
  async editForm(req, res) {
    const target = await User.findById(req.params.id);
    if (!target) return notFound(res);
    renderEdit(res, req, {
      target,
      values: { firstName: target.firstName, lastName: target.lastName, email: target.email, category: target.category },
    });
  },

  // PUT /users/:id
  async update(req, res) {
    const target = await User.findById(req.params.id);
    if (!target) {
      removeUploaded(req.file);
      return notFound(res);
    }

    // Los datos ya fueron validados por validations/usuarioValidation.js
    const rules = editRules(req.session.user, target);
    const errors = formErrors(req);

    if (Object.keys(errors).length) {
      removeUploaded(req.file);
      const { firstName, lastName, email } = req.body;
      const category = rules.canChangeCategory ? req.body.category : target.category;
      return renderEdit(res, req, { target, values: { firstName, lastName, email, category }, errors, status: 400 });
    }

    const data = { firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email };
    if (req.body.password) data.password = hashPassword(req.body.password);
    if (req.file) data.image = `/uploads/avatars/${req.file.filename}`;
    if (rules.canChangeCategory) data.category = req.body.category;

    await User.update(target.id, data);
    if (req.file) removeStoredImage(target.image); // se borra la foto anterior para no acumular archivos

    req.session.flash = { type: 'ok', message: rules.isSelf ? 'Tu perfil se actualizó correctamente.' : 'La cuenta se actualizó correctamente.' };
    res.redirect(rules.isSelf ? '/profile' : `/users/${target.id}`);
  },
};

module.exports = wrapController(userController);
