const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const routes = require('./routes');
const Cart = require('./models/cart.model');
const Site = require('./models/site.model');
const { formatPrice } = require('./utils/format');

const app = express();
const PORT = process.env.PORT || 3000;

// Motor de plantillas: EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Disponible en todas las vistas
app.locals.formatPrice = formatPrice;
app.locals.contact = Site.contact;

// Archivos estáticos y lectura de formularios
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
// Los formularios HTML solo envían GET/POST: con ?_method=PUT o ?_method=DELETE se usan esos métodos
app.use(methodOverride('_method'));

// Datos que usan todas las páginas (el contador del carrito está en el header)
app.use((req, res, next) => {
  res.locals.cartCount = Cart.count();
  next();
});

// Rutas de la aplicación
app.use('/', routes);

// 404
app.use((req, res) => {
  res.status(404).render('errors/404', { title: 'Página no encontrada | Kawaiilandia' });
});

// 500
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('errors/500', { title: 'Algo salió mal | Kawaiilandia' });
});

app.listen(PORT, () => {
  console.log(`Kawaiilandia corriendo en http://localhost:${PORT}`);
});
