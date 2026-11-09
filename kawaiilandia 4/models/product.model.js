// Modelo de productos.
// Los datos se guardan en data/products.json para que los productos creados
// o editados sigan ahí cuando se reinicia el servidor. En un sprint posterior
// este modelo se reemplazará por una base de datos.

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'products.json');

const CATEGORIES = ['Peluches', 'Mugs', 'Termos', 'Cuadros en aluminio', 'Globos burbuja', 'Ancheteas y detalles'];

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

function readAll() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeAll(products) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2) + '\n');
}

function slugify(text) {
  return (
    text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'producto'
  );
}

function uniqueId(base, products) {
  let id = base;
  let n = 2;
  while (products.some((p) => p.id === id)) {
    id = `${base}-${n++}`;
  }
  return id;
}

const Product = {
  categories: CATEGORIES,
  images: IMAGES,

  findAll({ category } = {}) {
    const products = readAll();
    return category ? products.filter((p) => p.category === category) : products;
  },

  findById(id) {
    return readAll().find((p) => p.id === id) || null;
  },

  // Productos relacionados: primero de la misma categoría, luego el resto.
  findRelated(product, limit = 4) {
    const others = readAll().filter((p) => p.id !== product.id);
    const same = others.filter((p) => p.category === product.category);
    const rest = others.filter((p) => p.category !== product.category);
    return [...same, ...rest].slice(0, limit);
  },

  create(data) {
    const products = readAll();
    const product = { id: uniqueId(slugify(data.name), products), ...data };
    products.push(product);
    writeAll(products);
    return product;
  },

  update(id, data) {
    const products = readAll();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...data, id };
    writeAll(products);
    return products[index];
  },

  remove(id) {
    const products = readAll();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    products.splice(index, 1);
    writeAll(products);
    return true;
  },
};

module.exports = Product;
