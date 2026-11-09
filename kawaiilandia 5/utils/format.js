// Formatea un número como precio en pesos colombianos: 49900 -> "$49.900"
function formatPrice(value) {
  const n = Math.round(Number(value) || 0);
  return '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

module.exports = { formatPrice };
