KAWAIILANDIA

Tienda kawaii de San Gil, Santander (peluches, mugs, termos, cuadros en aluminio, globos burbuja y ancheteas).
Proyecto del Trabajo Integrador - Sprint 7: Validaciones, con Node.js + Express (estructura MVC) + EJS + MySQL con Sequelize + Express Validator.


EQUIPO

- Neider Stiven Triana Neira
- Julian David Pinzon Duran
- Liseth Yurani Rodriguez Solano


TABLERO DE TRABAJO

Link al tablero: (pegar aqui el enlace de Trello / GitHub Projects del equipo)


DOCUMENTACION AGIL

retro.md: retrospectivas con la dinamica de la estrella de mar.
weekly.md: seguimiento semanal del sprint (avance, decisiones, impedimentos).
daily.md: opiniones del equipo sobre las dailys y weeklys.


COMO CORRERLO

Requiere Node.js 18 o superior y MySQL 8 o MariaDB 10.5 o superior encendido en el computador.

1. Instalar dependencias:
   npm install

2. Crear el archivo de configuracion y poner el usuario y la contrasena de MySQL:
   cp .env.example .env     (en Windows: copy .env.example .env)

3. Crear la base de datos con sus tablas y datos de ejemplo:
   npm run db:setup

4. Iniciar el servidor:
   npm start
   Abrir en el navegador: http://localhost:3000

Modo desarrollo (reinicia al guardar cambios): npm run dev

Variables del archivo .env
DB_HOST, DB_PORT, DB_USER, DB_PASSWORD y DB_NAME: datos de conexion a la base.
SESSION_SECRET: secreto con el que se firman la sesion y la cookie de recordarme.
PORT: puerto del sitio (por defecto 3000).


BASE DE DATOS

El diagrama entidad-relacion esta en docs/diagrama-der.pdf (el codigo del diagrama es docs/der.dot).

Archivos de la carpeta database
  structure.sql      Crea la base de datos, las tablas, los tipos, las restricciones y las relaciones
  data.sql           Datos de ejemplo: usuarios, productos, categorias, colores, tamanos y un carrito
  config/config.js   Conexion a la base (lee el archivo .env)
  models/            Un modelo de Sequelize por tabla, con sus relaciones

Comandos
npm run db:setup       Ejecuta structure.sql y data.sql
npm run db:structure   Solo la estructura (base vacia)
npm run db:data        Solo los datos

Tambien se pueden ejecutar los archivos con el cliente de MySQL:
mysql -u root -p < database/structure.sql
mysql -u root -p < database/data.sql

Cuidado: structure.sql empieza con DROP DATABASE IF EXISTS, asi que borra y vuelve a crear la base.

Tablas
user_categories     Tipos de usuario (admin y customer)
users               Nombre, apellido, correo unico, contrasena (hash scrypt), tipo y foto
categories          Categorias de productos
products            Slug, nombre, descripcion, precio, etiqueta, material, imagen y categoria
colors, sizes       Colores y tamanos que se reutilizan entre productos
product_colors      Relacion muchos a muchos entre productos y colores
product_sizes       Relacion muchos a muchos entre productos y tamanos
carts               Carrito de un usuario
cart_items          Productos de cada carrito, con cantidad, color y tamano


USUARIOS DE PRUEBA

Todos tienen la contrasena Kawaii2026! (se guarda solo el hash).

valentina.rojas@example.com     admin
sebastian.mendoza@example.com   admin
camila.torres@example.com       customer (con un carrito de ejemplo)

Hay 8 usuarios en total (ver database/data.sql). Los que se registran desde el sitio son siempre customer.


RUTAS

Acceso publico

GET     /                      Home
GET     /products              Listado con buscador y paginado (?q=peluche, ?categoria=Mugs, ?page=2)
GET     /products/:slug        Detalle de un producto (por ejemplo /products/domo-snoopy)

Solo huespedes

GET     /register              Formulario de registro
POST    /register              Crea el usuario en la base
GET     /check-email           Avisa si un email ya esta registrado (lo usan los formularios de registro y login)
GET     /login                 Formulario de login
POST    /login                 Inicia sesion (con o sin recordarme)

Solo usuarios logueados

GET     /profile               Mi perfil
GET     /users/:id             Detalle de un usuario (el propio, o cualquiera si es admin)
GET     /users/:id/edit        Formulario de edicion
PUT     /users/:id             Guarda los cambios (nombre, apellido, correo, foto y contrasena)
POST    /logout                Cierra la sesion
GET     /carrito               Mi carrito
POST    /carrito/items         Agrega un producto al carrito
PUT     /carrito/items/:id     Cambia la cantidad
DELETE  /carrito/items/:id     Quita un producto

Solo administradores

GET     /products/create       Formulario de creacion
POST    /products              Accion de creacion
GET     /products/:slug/edit   Formulario de edicion
PUT     /products/:slug        Accion de edicion
DELETE  /products/:slug        Accion de borrado
GET     /users                 Listado de usuarios con paginado

Los formularios HTML solo envian GET y POST, asi que PUT y DELETE se simulan con method-override, usando ?_method=PUT o ?_method=DELETE en el action del formulario. Las rutas viejas (/productos, /registro, /perfil, etc.) redirigen a las nuevas.

Reglas de edicion de usuarios
- Cada persona edita solo su cuenta; un administrador puede editar cualquiera.
- Para cambiar su propia contrasena hay que escribir la actual.
- Solo un administrador puede cambiar el tipo de cuenta de otra persona.
- No hay borrado de usuarios.


VALIDACIONES

Los datos se validan en tres lugares:
1. Navegador (JavaScript): respuesta inmediata y menos viajes al servidor. Se puede desactivar.
2. Servidor (Express Validator): es la validacion que cuenta.
3. Base de datos: restricciones NOT NULL, UNIQUE, claves foraneas y CHECK.

Registro
- Nombre y apellido: obligatorios, minimo 2 caracteres.
- Email: obligatorio, formato valido y no repetido.
- Contrasena: obligatoria, minimo 8 caracteres, con mayusculas, minusculas, un numero y un caracter especial.
- Confirmar contrasena: igual a la contrasena.
- Imagen: opcional, archivo JPG, JPEG, PNG o GIF.

Login
- Email: obligatorio, formato valido y debe existir en la base.
- Contrasena: obligatoria y debe coincidir con la guardada.

Productos (crear y editar)
- Nombre: obligatorio, minimo 5 caracteres.
- Descripcion: minimo 20 caracteres.
- Precio: entero entre $100 y $10.000.000.
- Categoria: debe existir en la base.
- Colores y tamanos: deben existir en la base.
- Imagen: archivo JPG, JPEG, PNG o GIF. Obligatoria al crear; al editar, si no se sube una nueva se conserva la actual.

Otros formularios
- Editar usuario: mismas reglas del registro; la contrasena nueva es opcional.
- Carrito: cantidad entera de 1 a 10, y solo colores y tamanos que el producto tiene.

Donde esta el codigo
- Servidor: carpeta validations, un archivo por formulario (registroValidation, loginValidation, usuarioValidation, productoValidation y carritoValidation). Se agregan en las rutas antes del controlador.
- Navegador: public/js/validaciones.js. Cada formulario lleva el atributo data-validate y sus reglas estan en el objeto FORMS del archivo.
- Los mensajes de error son los mismos en el servidor y en el navegador. Si se cambia una regla, hay que cambiarla en los dos.


ESTRUCTURA DEL PROYECTO

kawaiilandia/
  app.js                    Servidor Express, sesion, cookies y conexion a la base
  database/                 Configuracion de Sequelize, modelos y archivos SQL
  services/                 Consultas a la base (productos, usuarios y carrito)
  controllers/              Reciben el pedido, llaman a los servicios y renderizan la vista
  validations/              Reglas de Express Validator por formulario
  routes/                   Rutas por modulo
  middlewares/              session (flash, userLogged), access (guest, auth, admin) y upload (Multer)
  models/site.model.js      Textos fijos del sitio
  utils/                    format, password, formErrors, paginado, slugify y asyncHandler
  views/                    partials, home, products, cart, auth, users y errors
  public/                   css/, js/ (validaciones.js, qty.js), img/ y uploads/
  scripts/setup-db.js       Ejecuta structure.sql y data.sql (npm run db:setup)
  docs/                     Diagrama entidad-relacion


NOTAS

- Solo los precios de Vacas corredoras ($40.000) y Domo de Snoopy ($80.000) vienen de la tienda; el resto de productos, precios, resenas y cifras son de ejemplo y deben validarse con la tienda.
- Las fotos de los productos de ejemplo son de Unsplash y se cargan por URL, asi que se necesita internet para verlas. Los productos nuevos usan la imagen que se sube.
- Para volver a los datos de ejemplo se ejecuta npm run db:setup (borra lo que se haya creado probando; los archivos subidos quedan en public/uploads).
- Las sesiones se guardan en memoria y se pierden al reiniciar el servidor.
- El boton de pago del carrito sigue deshabilitado.
- No se hizo el CRUD de tablas secundarias (categorias, colores y tamanos), que es opcional. Para agregar un color o tamano nuevo hay que hacerlo con SQL.


ENTREGABLES DEL SPRINT 7

[x] retro.md con la retro del Sprint 6
[x] daily.md con las opiniones del equipo
[ ] Tablero de trabajo actualizado (link arriba)
[x] Validaciones del back-end con Express Validator: registro, login, creacion y modificacion de productos y el resto de formularios
[x] Validaciones del front-end con JavaScript: registro, login, creacion y modificacion de productos y el resto de formularios
[x] Opcionales: contrasena con mayusculas, minusculas, numero y caracter especial; email no repetido; colores y tamanos que existan en la base
