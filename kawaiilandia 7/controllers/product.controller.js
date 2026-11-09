const Product = require('../services/product.service');
const { formErrors } = require('../utils/formErrors');
const { parsePage } = require('../utils/pagination');
const { removeUploaded, removeStoredImage } = require('../middlewares/upload.middleware');
const { wrapController } = require('../utils/asyncHandler');

const emptyValues = { name: '', category: '', price: '', tag: '', description: '', material: '', colors: [], sizes: [] };

const categoryNames = async () => (await Product.categories()).map((c) => c.name);

function notFound(res) {
  res.status(404).render('errors/404', { title: 'Producto no encontrado | Kawaiilandia' });
}

// Lo que se vuelve a mostrar en el formulario si hubo errores (los datos ya vienen limpios de las validaciones)
const valuesFromBody = (body) => ({
  name: body.name,
  category: body.category,
  price: body.price,
  tag: body.tag,
  description: body.description,
  material: body.material,
  colors: body.colors,
  sizes: body.sizes,
});

const valuesFromProduct = (product) => ({
  name: product.name,
  category: product.category,
  price: String(product.price),
  tag: product.tag || '',
  description: product.description,
  material: product.material || '',
  colors: product.colors,
  sizes: product.sizes,
});

async function renderForm(res, { mode, product = null, values, errors = {}, status = 200 }) {
  res.status(status).render('products/form', {
    title: (mode === 'create' ? 'Nuevo producto' : 'Editar producto') + ' | Kawaiilandia',
    active: 'products',
    mode,
    product,
    values,
    errors,
    categories: await categoryNames(),
    allColors: await Product.colors(),
    allSizes: await Product.sizes(),
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
    const errors = formErrors(req);
    if (Object.keys(errors).length) {
      removeUploaded(req.file); // no dejar imágenes huérfanas si el formulario tiene errores
      return renderForm(res, { mode: 'create', values: valuesFromBody(req.body), errors, status: 400 });
    }

    const product = await Product.create({
      ...req.body,
      price: Number(req.body.price),
      image: `/uploads/products/${req.file.filename}`,
    });
    res.redirect(`/products/${product.slug}?estado=creado`);
  },

  // GET /products/:id/edit
  async editForm(req, res) {
    const product = await Product.findBySlug(req.params.id);
    if (!product) return notFound(res);
    await renderForm(res, { mode: 'edit', product, values: valuesFromProduct(product) });
  },

  // PUT /products/:id
  async update(req, res) {
    const product = await Product.findBySlug(req.params.id);
    if (!product) {
      removeUploaded(req.file);
      return notFound(res);
    }

    const errors = formErrors(req);
    if (Object.keys(errors).length) {
      removeUploaded(req.file);
      return renderForm(res, { mode: 'edit', product, values: valuesFromBody(req.body), errors, status: 400 });
    }

    await Product.update(product.slug, {
      ...req.body,
      price: Number(req.body.price),
      image: req.file ? `/uploads/products/${req.file.filename}` : null,
    });
    if (req.file) removeStoredImage(product.image); // se borra la imagen anterior para no acumular archivos

    res.redirect(`/products/${product.slug}?estado=actualizado`);
  },

  // DELETE /products/:id
  async destroy(req, res) {
    const product = await Product.findBySlug(req.params.id);
    if (!product) return notFound(res);

    await Product.remove(product.slug);
    removeStoredImage(product.image);
    res.redirect('/products?estado=eliminado');
  },
};

module.exports = wrapController(productController);
