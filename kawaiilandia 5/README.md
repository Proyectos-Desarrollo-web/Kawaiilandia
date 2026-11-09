KAWAIILANDIA

Tienda kawaii de San Gil, Santander (peluches, mugs, termos, cuadros en aluminio, globos burbuja y ancheteas).
Proyecto del Trabajo Integrador - Sprint 5: Middlewares y autenticacion, con Node.js + Express (estructura MVC) + EJS.


EQUIPO

- Neider Stiven Triana Neira
- Julian David Pinzon Duran
- Liseth Yurani Rodriguez Solano


TABLERO DE TRABAJO

Link al tablero: (pegar aqui el enlace de Trello / GitHub Projects del equipo)


DOCUMENTACION AGIL

retro.md: retrospectivas con la dinamica de la estrella de mar.
weekly.md: seguimiento semanal del sprint (avance, decisiones, impedimentos).


COMO CORRERLO

Requiere Node.js 18 o superior.

1. Instalar dependencias:
   npm install

2. Iniciar el servidor:
   npm start
   Abrir en el navegador: http://localhost:3000

3. Modo desarrollo (reinicia al guardar cambios):
   npm run dev

Para usar otro puerto: PORT=4000 npm start

Variable de entorno SESSION_SECRET: secreto con el que se firman la sesion y la cookie de recordarme. Si no se define, se usa uno de desarrollo y el servidor avisa en consola.


USUARIOS DE PRUEBA

Se generan con: npm run seed:users
Todos tienen la contrasena Kawaii2026! (guardada solo como hash).

valentina.rojas@example.com     admin
sebastian.mendoza@example.com   admin
camila.torres@example.com       customer

Hay 8 usuarios en total (ver data/users.json). Los usuarios que se registran desde el sitio son siempre customer.


RUTAS

Acceso publico (huespedes y usuarios)

GET     /                      Home: categorias, destacados, nosotros, resenas, FAQ y contacto
GET     /products              Listado de productos (filtro opcional ?categoria=Peluches)
GET     /products/:id          Detalle de un producto

Solo huespedes (visitantes sin login). Si ya hay sesion, redirige a /profile

GET     /register              Formulario de registro
POST    /register              Crea la cuenta, guarda la foto e inicia sesion
GET     /login                 Formulario de login
POST    /login                 Verifica los datos e inicia sesion (con o sin recordarme)

Solo usuarios logueados. Si no hay sesion, redirige a /login

GET     /profile               Perfil del usuario
POST    /logout                Cierra la sesion y borra las cookies
GET     /carrito               Carrito (datos de ejemplo)

Solo administradores (category admin). Un usuario que no sea admin recibe el error 403

GET     /products/create       Formulario de creacion
POST    /products              Accion de creacion
GET     /products/:id/edit     Formulario de edicion
PUT     /products/:id          Accion de edicion
DELETE  /products/:id          Accion de borrado

Los formularios HTML solo envian GET y POST, asi que PUT y DELETE se simulan con method-override, usando ?_method=PUT o ?_method=DELETE en el action del formulario. Las rutas viejas (/productos, /registro, /perfil, etc.) redirigen a las nuevas.


MIDDLEWARES

De aplicacion (se ejecutan en cada pedido, ver app.js)
- express.static, express.urlencoded y method-override
- cookie-parser: lee las cookies firmadas
- express-session: guarda la sesion del usuario
- flash: mensajes que se muestran una sola vez
- userLogged: carga al usuario de la sesion o lo recupera con la cookie de recordarme, y lo deja disponible en todas las vistas

De ruta (ver middlewares/access.middleware.js)
- guest: solo huespedes (login y registro)
- auth: solo usuarios logueados (perfil, logout, carrito)
- admin: solo administradores (crear, editar y borrar productos)
- uploadAvatar: Multer, recibe la foto de perfil en el registro (JPG, PNG, WEBP o GIF, maximo 2 MB)


SESION Y RECORDARME

- Al iniciar sesion se guarda el usuario (sin la contrasena) en la sesion.
- Si se marca recordarme, se crea una cookie firmada de 30 dias. Si el navegador se cierra, userLogged la usa para volver a iniciar sesion sin pedir los datos.
- Al cerrar sesion se destruye la sesion y se borran las cookies.
- El login muestra el mismo mensaje si el correo no existe o la contrasena es incorrecta.


FUENTES DE DATOS (JSON)

data/products.json
Campos: id, name, description, image, category, colors, price (ademas tag, material y sizes).

data/users.json
Campos: id, firstName, lastName, email, password (hash scrypt), category (admin o customer), image.
Al registrarse, la foto se guarda en public/uploads/avatars/ y su ruta queda en el campo image. Si no se sube foto se usa /img/logo.svg.


ESTRUCTURA DEL PROYECTO

kawaiilandia/
  app.js                    Servidor Express, sesion, cookies y middlewares de aplicacion
  controllers/              Reciben la peticion y renderizan la vista
  middlewares/
    session.middleware.js   flash y userLogged
    access.middleware.js    guest, auth y admin
    upload.middleware.js    Multer para la foto de perfil
  models/                   product, user, cart y site (leen y escriben los JSON)
  routes/                   Rutas por modulo
  utils/
    format.js               formatPrice(): 49900 -> $49.900
    password.js             Hash y verificacion de contrasenas (scrypt)
    validateProduct.js      Validacion del formulario de productos
    validateUser.js         Validacion del registro y del login
  scripts/seed-users.js     Genera data/users.json
  data/                     products.json y users.json
  views/
    partials/               head, header, footer, product-card
    home/ products/ cart/ errors/
    auth/                   login, register, profile
  public/                   css/, img/ y uploads/avatars/


REGLAS DE VALIDACION

- Registro: nombre y apellido de 2 a 40 caracteres, correo valido y no repetido, contrasena de 8 a 64 caracteres, confirmacion igual a la contrasena, terminos aceptados y foto opcional.
- Login: correo valido y contrasena obligatoria.
- Productos: nombre de 3 a 60 caracteres, categoria de la lista, precio entero entre $100 y $10.000.000, descripcion de 10 a 400 caracteres, hasta 6 tamanos y hasta 6 colores.


NOTAS

- Los productos y usuarios se guardan en archivos JSON. Para volver a los datos originales se restaura con: git checkout data/products.json data/users.json
- Solo los precios de Vacas corredoras ($40.000) y Domo de Snoopy ($80.000) vienen de la tienda; el resto de productos, precios, resenas y cifras son de ejemplo y deben validarse con la tienda.
- Las fotos de los productos son de Unsplash y se cargan por URL, asi que se necesita internet para verlas.
- El carrito sigue con datos de ejemplo y es el mismo para todos los usuarios. El carrito por usuario llega con la base de datos.
- Las sesiones se guardan en memoria y se pierden al reiniciar el servidor.


ENTREGABLES DEL SPRINT 5

[x] Registro, login y logout de usuarios
[x] Recordarme con cookie firmada
[x] Rutas solo para huespedes (/register, /login) y solo para usuarios (/profile, /carrito, /logout)
[x] Pagina de perfil
[x] Middlewares de aplicacion y de ruta, y acceso de admin en el CRUD de productos
[x] Foto de perfil con Multer
[x] retro.md con la retro del Sprint 4
[x] weekly.md con el seguimiento del Sprint 5
[ ] Tablero de trabajo reiniciado (link arriba)
