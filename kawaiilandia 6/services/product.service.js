// Acceso a datos de productos con Sequelize.
// Devuelve objetos planos para las vistas:
// { id, slug, name, category: 'Peluches', colors: ['Rosa'], sizes: ['30 cm'], ... }
const { Op } = require('sequelize');
const { sequelize, Product, Category, Color, Size, ProductColor, ProductSize } = require('../database/models');
const { slugify } = require('../utils/slugify');
const { buildPagination } = require('../utils/pagination');

const PAGE_SIZE = 6;

// Fotos reales (Unsplash, licencia gratuita) disponibles para elegir en el formulario.
// 'file' es la clave que viaja en el formulario; 'url' es la imagen que se guarda en el producto.
const IMAGES = [
  { file: 'peluches', label: 'Peluches', url: 'https://images.unsplash.com/photo-1744608257868-b3a034a85d22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800' },
  { file: 'vacas', label: 'Vacas corredoras', url: 'https://images.unsplash.com/photo-1631567210298-d385d8d9476c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800' },
  { file: 'snoopy', label: 'Domo de Snoopy', url: 'https://images.unsplash.com/photo-1762089423685-60f5cef02cda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800' },
  { file: 'mugs', label: 'Mugs', url: 'https://images.unsplash.com/photo-1610632380989-680fe40816c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800' },
  { file: 'termos', label: 'Termos', url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800' },
  { file: 'cuadros', label: 'Cuadros en aluminio', url: 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800' },
  { file: 'globos', label: 'Globos burbuja', url: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800' },
  { file: 'ancheta', label: 'Ancheta', url: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800' },
];

const byPosition = (a, b) => a.position - b.position;

// Instancia de Sequelize -> objeto plano para las vistas
function toPlain(product) {
  if (!product) return null;
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: product.price,
    tag: product.tag,
    material: product.material,
    image: product.image,
    categoryId: product.categoryId,
    category: product.category ? product.category.name : '',
    colors: (product.colors || [])
      .map((c) => ({ name: c.name, position: c.ProductColor.position }))
      .sort(byPosition)
      .map((c) => c.name),
    sizes: (product.sizes || [])
      .map((s) => ({ name: s.name, position: s.ProductSize.position }))
      .sort(byPosition)
      .map((s) => s.name),
  };
}

const FULL_INCLUDE = [
  { model: Category, as: 'category' },
  { model: Color, as: 'colors', through: { attributes: ['position'] } },
  { model: Size, as: 'sizes', through: { attributes: ['position'] } },
];

// Escapa % y _ para que se busquen como texto normal dentro de un LIKE
const escapeLike = (text) => text.replace(/[\\%_]/g, '\\$&');

const Product_ = {
  images: IMAGES,
  pageSize: PAGE_SIZE,

  // Lista de categorías, ya ordenada: [{ id, name }]
  async categories() {
    const rows = await Category.findAll({ order: [['id', 'ASC']] });
    return rows.map((c) => ({ id: c.id, name: c.name }));
  },

  // Listado con filtro por categoría, búsqueda (nombre o descripción) y paginación
  async findPage({ category = null, q = '', page = 1 } = {}) {
    const term = String(q || '').trim().slice(0, 60);
    const where = {};
    if (term) {
      const like = `%${escapeLike(term)}%`;
      where[Op.or] = [{ name: { [Op.like]: like } }, { description: { [Op.like]: like } }];
    }
    const include = [{ model: Category, as: 'category', ...(category ? { where: { name: category }, required: true } : {}) }];

    const total = await Product.count({ where, include });
    const pagination = buildPagination({ total, page, pageSize: PAGE_SIZE });
    const rows = await Product.findAll({ where, include, order: [['id', 'ASC']], limit: PAGE_SIZE, offset: pagination.offset });

    return { products: rows.map(toPlain), pagination, q: term };
  },

  // Productos destacados de la home
  async findFeatured(limit = 8) {
    const rows = await Product.findAll({ include: [{ model: Category, as: 'category' }], order: [['id', 'ASC']], limit });
    return rows.map(toPlain);
  },

  async findBySlug(slug) {
    const product = await Product.findOne({ where: { slug: String(slug) }, include: FULL_INCLUDE });
    return toPlain(product);
  },

  // Productos relacionados: primero de la misma categoría, luego el resto.
  async findRelated(product, limit = 4) {
    const include = [{ model: Category, as: 'category' }];
    const same = await Product.findAll({
      where: { id: { [Op.ne]: product.id }, categoryId: product.categoryId },
      include,
      order: [['id', 'ASC']],
      limit,
    });
    let rows = same;
    if (same.length < limit) {
      const rest = await Product.findAll({
        where: { id: { [Op.ne]: product.id }, categoryId: { [Op.ne]: product.categoryId } },
        include,
        order: [['id', 'ASC']],
        limit: limit - same.length,
      });
      rows = [...same, ...rest];
    }
    return rows.map(toPlain);
  },

  // data: { name, category (nombre), price, tag, description, material, image, sizes[], colors[] }
  async create(data) {
    const id = await sequelize.transaction(async (t) => {
      const category = await Category.findOne({ where: { name: data.category }, transaction: t });
      const slug = await uniqueSlug(slugify(data.name), t);
      const product = await Product.create(
        {
          slug,
          name: data.name,
          description: data.description,
          price: data.price,
          tag: data.tag,
          material: data.material,
          image: data.image,
          categoryId: category.id,
        },
        { transaction: t }
      );
      await syncVariants(product.id, data.colors, data.sizes, t);
      return product.id;
    });
    return this.findBySlug((await Product.findByPk(id)).slug);
  },

  async update(slug, data) {
    return sequelize.transaction(async (t) => {
      const product = await Product.findOne({ where: { slug }, transaction: t });
      if (!product) return null;
      const category = await Category.findOne({ where: { name: data.category }, transaction: t });
      await product.update(
        {
          name: data.name,
          description: data.description,
          price: data.price,
          tag: data.tag,
          material: data.material,
          image: data.image,
          categoryId: category.id,
        },
        { transaction: t }
      );
      await syncVariants(product.id, data.colors, data.sizes, t);
      return product.slug;
    });
  },

  // Al borrar un producto, la base borra solo sus colores/tamaños asignados y sus ítems de carrito (ON DELETE CASCADE)
  async remove(slug) {
    const deleted = await Product.destroy({ where: { slug } });
    return deleted > 0;
  },
};

// Slug único: "domo-snoopy", "domo-snoopy-2", ...
// "create" está reservado porque /products/create es el formulario de creación.
const RESERVED_SLUGS = ['create'];

async function uniqueSlug(base, transaction) {
  let slug = base;
  let n = 2;
  while (RESERVED_SLUGS.includes(slug) || (await Product.findOne({ where: { slug }, transaction }))) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

// Reemplaza los colores y tamaños de un producto, conservando el orden en que se escribieron.
// Los colores/tamaños nuevos se agregan a sus tablas; los que ya existen se reutilizan.
async function syncVariants(productId, colorNames, sizeNames, transaction) {
  const colorIds = await resolveIds(Color, colorNames, transaction);
  const sizeIds = await resolveIds(Size, sizeNames, transaction);

  await ProductColor.destroy({ where: { productId }, transaction });
  await ProductSize.destroy({ where: { productId }, transaction });
  if (colorIds.length) {
    await ProductColor.bulkCreate(colorIds.map((colorId, position) => ({ productId, colorId, position })), { transaction });
  }
  if (sizeIds.length) {
    await ProductSize.bulkCreate(sizeIds.map((sizeId, position) => ({ productId, sizeId, position })), { transaction });
  }
}

async function resolveIds(Model, names, transaction) {
  const ids = [];
  for (const name of names || []) {
    const [row] = await Model.findOrCreate({ where: { name }, defaults: { name }, transaction });
    if (!ids.includes(row.id)) ids.push(row.id); // "rosa" y "Rosa" son el mismo color
  }
  return ids;
}

module.exports = Product_;
