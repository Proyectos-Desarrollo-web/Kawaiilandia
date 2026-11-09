// Express 4 no captura los errores de funciones async: si fallan, el pedido se queda colgado.
// Esto envuelve cada función del controlador para mandar el error al middleware de errores (500).
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Envuelve todas las funciones de un objeto controlador
function wrapController(controller) {
  return Object.fromEntries(Object.entries(controller).map(([name, fn]) => [name, typeof fn === 'function' ? wrap(fn) : fn]));
}

module.exports = { wrap, wrapController };
