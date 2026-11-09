// "Peluche Kawaii ñandú" -> "peluche-kawaii-nandu"
function slugify(text) {
  return (
    String(text)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 70) || 'producto'
  );
}

module.exports = { slugify };
