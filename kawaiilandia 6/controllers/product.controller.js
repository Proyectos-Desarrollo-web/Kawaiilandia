const Product = require('../services/product.service');
const { validateProduct, productToFormValues } = require('../utils/validateProduct');
const { parsePage } = require('../utils/pagination');
const { wrapController } = require('../utils/asyncHandler');

const emptyValues = {
  name: '',
  category: '',
  price: '',
  tag: '',
  description: '',
  material: '',
  sizes: '',
  colors: '',
  imageFile: Product.images[0].file,
  imageUrl: '',
};

const categoryNames = async () => (await Product.categories()).map((c) => c.name);

function notFound(res) {
  res.status(404).render('errors/404', { title: 'Producto no encontrado | Kawaiilandia' });
}

async function renderForm(res, { mode, product = null, values, errors = {}, status = 200 }) {
  res.status(status).render('products/form', {
    title: (mode === 'create' ? 'Nuevo producto' : 'Editar producto') + ' | Kawaiilandia',
    active: 'products',
    mode,
    product,
    values,
    errors,
    categories: await categoryNames(),
    images: Product.images,
  });
}

const productController = {
  // GET /products?categoria=Peluches&q=peluche&page=2
  async index(req, res) {
    const names = await categoryNames();
    const category = names.includes(req.query.categoria) ? req.query.categoria : null;
    const q = typeof req.query.q === 'string' ? req.query.q : '';
    const { products, pagination, q: term } = await Product.findPage({ category, q, page: parsePage(req.query.page) });

    res.render('products/index', {
      title: 'Productos | Kawaiilandia',
      description: 'Todos los productos de Kawaiilandia: peluches, mugs, termos, cuadros en aluminio, globos burbuja y ancheteas.',
      active: 'products',
      products,
      pagination,
      categories: names,
      selectedCategory: category,
      q: term,
      status: req.query.estado || null,
    });
  },

  // GET /products/:id  (el "id" de la URL es el slug del producto, por ejemplo domo-snoopy)
  async detail(req, res) {
    const product = await Product.findBySlug(req.params.id);
    if (!product) return notFound(res);

    res.render('products/detail', {
      title: `${product.name} | Kawaiilandia`,
      description: product.description,
      active: 'products',
      product,
      related: await Product.findRelated(product),
      status: req.query.estado || null,
    });
  },

  // GET /products/create
  async newForm(req, res) {
    await renderForm(res, { mode: 'create', values: emptyValues });
  },

  // POST /products
  async create(req, res) {
    const { errors, values, data, isValid } = validateProduct(req.body, await categoryNames());
    if (!isValid) return renderForm(res, { mode: 'create', values, errors, status: 400 });

    const product = await Product.create(data);
    res.redirect(`/products/${product.slug}?estado=creado`);
  },

  // GET /products/:id/edit
  async editForm(req, res) {
    const product = await Product.findBySlug(req.params.id);
    if (!product) return notFound(res);
    await renderForm(res, { mode: 'edit', product, values: productToFormValues(product) });
  },

  // PUT /products/:id
  async update(req, res) {
    const product = await Product.findBySlug(req.params.id);
    if (!product) return notFound(res);

    const { errors, values, data, isValid } = validateProduct(req.body, await categoryNames());
    if (!isValid) return renderForm(res, { mode: 'edit', product, values, errors, status: 400 });

    await Product.update(product.slug, data);
    res.redirect(`/products/${product.slug}?estado=actualizado`);
  },

  // DELETE /products/:id
  async destroy(req, res) {
    const product = await Product.findBySlug(req.params.id);
    if (!product) return notFound(res);

    await Product.remove(product.slug);
    res.redirect('/products?estado=eliminado');
  },
};

module.exports = wrapController(productController);
