require('dotenv').config({ quiet: true }); // variables de entorno desde .env
const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const routes = require('./routes');
const Site = require('./models/site.model');
const { formatPrice } = require('./utils/format');
const { flash, userLogged } = require('./middlewares/session.middleware');
const { sequelize } = require('./database/models');

const app = express();
const PORT = process.env.PORT || 3000;

// Secreto para firmar la sesión y la cookie de "Recordarme".
// En producción debe venir de la variable de entorno SESSION_SECRET.
const SECRET = process.env.SESSION_SECRET || 'kawaiilandia-secreto-solo-para-desarrollo';
if (!process.env.SESSION_SECRET) {
  console.warn('Aviso: usando un secreto de desarrollo. Define SESSION_SECRET antes de publicar el sitio.');
}

// Motor de plantillas: EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Disponible en todas las vistas
app.locals.formatPrice = formatPrice;
app.locals.contact = Site.contact;

// Archivos estáticos y lectura de formularios
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
// Express 5 deja req.body sin definir cuando el pedido no trae cuerpo
app.use((req, res, next) => {
  if (req.body === undefined) req.body = {};
  next();
});
// Los formularios HTML solo envían GET/POST: con ?_method=PUT o ?_method=DELETE se usan esos métodos
app.use(methodOverride('_method'));

// Cookies firmadas y sesión
app.use(cookieParser(SECRET));
app.use(
  session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: 'lax' }, // sin maxAge: la sesión dura hasta cerrar el navegador
  })
);

// Middlewares de aplicación (se ejecutan en cada pedido)
app.use(flash); //       mensajes de una sola vez (res.locals.flash)
app.use(userLogged); //  usuario logueado, "Recordarme" y contador del carrito (res.locals.authUser)

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

// Primero se comprueba la conexión a la base de datos y después se levanta el servidor
sequelize
  .authenticate()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Kawaiilandia corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('No se pudo conectar a la base de datos:', err.message);
    console.error('Revisa que MySQL/MariaDB esté encendido, que el archivo .env tenga los datos correctos');
    console.error('y que hayas creado la base con: npm run db:setup');
    process.exit(1);
  });
