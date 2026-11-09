// Validación del formulario de productos (crear y editar).
// Devuelve los valores limpios, los errores por campo y los datos listos para guardar.

const Product = require('../models/product.model');

const text = (value) => (typeof value === 'string' ? value.trim() : '');

function validateProduct(body) {
  const errors = {};
  const values = {
    name: text(body.name),
    category: text(body.category),
    price: text(body.price),
    tag: text(body.tag),
    description: text(body.description),
    material: text(body.material),
    sizes: text(body.sizes),
    colors: text(body.colors),
    imageFile: text(body.imageFile),
    imageUrl: text(body.imageUrl),
  };

  if (values.name.length < 3 || values.name.length > 60) {
    errors.name = 'El nombre debe tener entre 3 y 60 caracteres.';
  }

  if (!Product.categories.includes(values.category)) {
    errors.category = 'Selecciona una categoría válida.';
  }

  if (!/^\d+$/.test(values.price)) {
    errors.price = 'Ingresa solo números, sin puntos, comas ni símbolos. Ejemplo: 49900.';
  } else if (Number(values.price) < 100 || Number(values.price) > 10000000) {
    errors.price = 'El precio debe estar entre $100 y $10.000.000.';
  }

  if (values.tag.length > 20) {
    errors.tag = 'La etiqueta puede tener máximo 20 caracteres.';
  }

  if (values.description.length < 10 || values.description.length > 400) {
    errors.description = 'La descripción debe tener entre 10 y 400 caracteres.';
  }

  if (values.material.length > 80) {
    errors.material = 'El material puede tener máximo 80 caracteres.';
  }

  const sizes = values.sizes
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (sizes.length > 6 || sizes.some((s) => s.length > 20)) {
    errors.sizes = 'Indica hasta 6 tamaños separados por coma, de máximo 20 caracteres cada uno.';
  }

  const colors = values.colors
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean);
  if (colors.length > 6 || colors.some((c) => c.length > 20)) {
    errors.colors = 'Indica hasta 6 colores separados por coma, de máximo 20 caracteres cada uno.';
  }

  // Imagen: una URL propia tiene prioridad sobre las fotos de la lista.
  let image = '';
  if (values.imageUrl) {
    try {
      const url = new URL(values.imageUrl);
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error('protocolo');
      image = url.href;
    } catch {
      errors.imageUrl = 'Ingresa una URL válida que empiece por http:// o https://.';
    }
  } else if (Product.images.some((img) => img.file === values.imageFile)) {
    image = Product.images.find((img) => img.file === values.imageFile).url;
  } else {
    errors.imageFile = 'Selecciona una imagen.';
  }

  const data = {
    name: values.name,
    category: values.category,
    price: Number(values.price),
    tag: values.tag,
    image,
    description: values.description,
    material: values.material,
    sizes,
    colors,
  };

  return { errors, values, data, isValid: Object.keys(errors).length === 0 };
}

// Convierte un producto guardado en los valores que muestra el formulario.
function productToFormValues(product) {
  const localFile = Product.images.find((img) => img.url === product.image);
  return {
    name: product.name,
    category: product.category,
    price: String(product.price),
    tag: product.tag || '',
    description: product.description,
    material: product.material || '',
    sizes: (product.sizes || []).join(', '),
    colors: (product.colors || []).join(', '),
    imageFile: localFile ? localFile.file : Product.images[0].file,
    imageUrl: localFile ? '' : product.image,
  };
}

module.exports = { validateProduct, productToFormValues };
