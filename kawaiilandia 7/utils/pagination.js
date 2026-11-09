// Calcula la página pedida (?page=) y arma los datos que necesita la vista de paginación.
function parsePage(value) {
  const n = parseInt(value, 10);
  return Number.isInteger(n) && n > 0 ? n : 1;
}

function buildPagination({ total, page, pageSize }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, pages);
  return { total, page: current, pages, pageSize, offset: (current - 1) * pageSize, hasPrev: current > 1, hasNext: current < pages };
}

module.exports = { parsePage, buildPagination };
