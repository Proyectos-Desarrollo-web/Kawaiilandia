// Acceso a datos de usuarios con Sequelize.
const { User, UserCategory } = require('../database/models');
const { buildPagination } = require('../utils/pagination');

const DEFAULT_IMAGE = '/img/logo.svg';
const PAGE_SIZE = 8;
const INCLUDE = [{ model: UserCategory, as: 'category' }];

// Usuario "público": nunca incluye la contraseña. `category` es el nombre ('admin' o 'customer').
function toPublic(user) {
  if (!user) return null;
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    category: user.category ? user.category.name : null,
    image: user.image,
    createdAt: user.createdAt,
  };
}

async function categoryId(name) {
  const category = await UserCategory.findOne({ where: { name } });
  return category ? category.id : null;
}

const UserService = {
  defaultImage: DEFAULT_IMAGE,
  pageSize: PAGE_SIZE,
  categories: ['admin', 'customer'],

  async findById(id) {
    const n = Number(id);
    if (!Number.isInteger(n) || n < 1) return null;
    return toPublic(await User.findByPk(n, { include: INCLUDE }));
  },

  // Devuelve el usuario con el hash en `password` (solo para verificar la contraseña en el login).
  async findByEmail(email) {
    const user = await User.findOne({ where: { email: String(email).trim().toLowerCase() }, include: INCLUDE });
    return user ? { ...toPublic(user), password: user.password } : null;
  },

  // Para validar contraseñas actuales: devuelve el hash de un usuario.
  async getPasswordHash(id) {
    const user = await User.findByPk(id);
    return user ? user.password : null;
  },

  async findPage(page = 1) {
    const total = await User.count();
    const pagination = buildPagination({ total, page, pageSize: PAGE_SIZE });
    const rows = await User.findAll({ include: INCLUDE, order: [['id', 'ASC']], limit: PAGE_SIZE, offset: pagination.offset });
    return { users: rows.map(toPublic), pagination };
  },

  // Los usuarios que se registran desde el sitio siempre son "customer".
  async create({ firstName, lastName, email, password, image }) {
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password, // ya viene hasheada desde utils/password.js
      categoryId: await categoryId('customer'),
      image: image || DEFAULT_IMAGE,
    });
    return this.findById(user.id);
  },

  // data: { firstName, lastName, email, password? (hash), image?, category? }
  async update(id, data) {
    const user = await User.findByPk(id);
    if (!user) return null;
    const changes = { firstName: data.firstName, lastName: data.lastName, email: data.email.toLowerCase() };
    if (data.password) changes.password = data.password;
    if (data.image) changes.image = data.image;
    if (data.category) changes.categoryId = await categoryId(data.category);
    await user.update(changes);
    return this.findById(id);
  },
};

module.exports = UserService;
