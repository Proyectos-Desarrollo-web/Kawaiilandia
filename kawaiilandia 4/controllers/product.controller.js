const Product = require('../models/product.model');
const { validateProduct, productToFormValues } = require('../utils/validateProduct');

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

function notFound(res) {
  res.status(404).render('errors/404', { title: 'Producto no encontrado | Kawaiilandia' });
}

function renderForm(res, { mode, product = null, values, errors = {}, status = 200 }) {
  res.status(status).render('products/form', {
    title: (mode === 'create' ? 'Nuevo producto' : 'Editar producto') + ' | Kawaiilandia',
    active: 'products',
    mode,
    product,
    values,
    errors,
    categories: Product.categories,
    images: Product.images,
  });
}

const productController = {
  // GET /products
  index(req, res) {
    const category = Product.categories.includes(req.query.categoria) ? req.query.categoria : null;
    res.render('products/index', {
      title: 'Productos | Kawaiilandia',
      description: 'Todos los productos de Kawaiilandia: peluches, mugs, termos, cuadros en aluminio, globos burbuja y ancheteas.',
      active: 'products',
      products: Product.findAll({ category }),
      categories: Product.categories,
      selectedCategory: category,
      status: req.query.estado || null,
    });
  },

  // GET /products/:id
  detail(req, res) {
    const product = Product.findById(req.params.id);
    if (!product) return notFound(res);

    res.render('products/detail', {
      title: `${product.name} | Kawaiilandia`,
      description: product.description,
      active: 'products',
      product,
      related: Product.findRelated(product),
      status: req.query.estado || null,
    });
  },

  // GET /products/create
  newForm(req, res) {
    renderForm(res, { mode: 'create', values: emptyValues });
  },

  // POST /products
  create(req, res) {
    const { errors, values, data, isValid } = validateProduct(req.body);
    if (!isValid) return renderForm(res, { mode: 'create', values, errors, status: 400 });

    const product = Product.create(data);
    res.redirect(`/products/${product.id}?estado=creado`);
  },

  // GET /products/:id/edit
  editForm(req, res) {
    const product = Product.findById(req.params.id);
    if (!product) return notFound(res);
    renderForm(res, { mode: 'edit', product, values: productToFormValues(product) });
  },

  // PUT /products/:id
  update(req, res) {
    const product = Product.findById(req.params.id);
    if (!product) return notFound(res);

    const { errors, values, data, isValid } = validateProduct(req.body);
    if (!isValid) return renderForm(res, { mode: 'edit', product, values, errors, status: 400 });

    Product.update(product.id, data);
    res.redirect(`/products/${product.id}?estado=actualizado`);
  },

  // DELETE /products/:id
  destroy(req, res) {
    const product = Product.findById(req.params.id);
    if (!product) return notFound(res);

    Product.remove(product.id);
    res.redirect('/products?estado=eliminado');
  },
};

module.exports = productController;
