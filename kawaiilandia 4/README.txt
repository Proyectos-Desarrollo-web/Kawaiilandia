KAWAIILANDIA

Tienda kawaii de San Gil, Santander (peluches, mugs, termos, cuadros en aluminio, globos burbuja y ancheteas).
Proyecto del Trabajo Integrador - Sprint 4: JSON y metodos HTTP, con Node.js + Express (estructura MVC) + EJS.


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


RUTAS

CRUD de productos (Sprint 4)

GET     /products              Listado de productos (filtro opcional ?categoria=Peluches)
GET     /products/create       Formulario de creacion
GET     /products/:id          Detalle de un producto
POST    /products              Accion de creacion (valida y guarda)
GET     /products/:id/edit     Formulario de edicion
PUT     /products/:id          Accion de edicion (valida y guarda)
DELETE  /products/:id          Accion de borrado

Los formularios HTML solo envian GET y POST, asi que PUT y DELETE se simulan con la libreria method-override, usando ?_method=PUT o ?_method=DELETE en el action del formulario. Las rutas viejas (/productos, /productos/nuevo, etc.) redirigen a las nuevas.

Otras paginas

GET  /          Home: categorias, destacados, nosotros, resenas, FAQ y contacto
GET  /carrito   Carrito (datos de ejemplo)
GET  /registro  Registro (maqueta)
GET  /login     Login (maqueta)


FUENTES DE DATOS (JSON)

data/products.json
Campos: id, name, description, image, category, colors, price (ademas tag, material y sizes).

data/users.json
Campos: id, firstName, lastName, email, password (hash scrypt), category (admin o customer), image.

Los usuarios de ejemplo se generan con: npm run seed:users
Todos tienen la contrasena Kawaii2026! (guardada solo como hash).


ESTRUCTURA DEL PROYECTO

kawaiilandia/
  app.js                    Servidor Express y configuracion de EJS
  controllers/              Reciben la peticion y renderizan la vista
  models/
    product.model.js        Catalogo (lee y escribe data/products.json)
    user.model.js           Usuarios (lee data/users.json)
    cart.model.js           Carrito de ejemplo
    site.model.js           Textos de la home, resenas, FAQ, contacto
  routes/                   Rutas por modulo
  utils/
    format.js               formatPrice(): 49900 -> $49.900
    password.js             Hash y verificacion de contrasenas (scrypt)
    validateProduct.js      Validacion del formulario de productos
  scripts/seed-users.js     Genera data/users.json
  data/
    products.json           Productos (se actualiza al crear, editar o eliminar)
    users.json              Usuarios de ejemplo
  views/
    partials/               head, header, footer, product-card
    home/ products/ cart/ auth/ errors/
  public/                   css/ e img/


COMO SE USAN LOS PARCIALES

Cada vista incluye los componentes compartidos (head, header y footer), asi el menu y el pie de pagina existen una sola vez. El titulo, la descripcion y el item activo del menu los envia el controlador (title, description, active).


CREAR, EDITAR Y ELIMINAR PRODUCTOS

1. Entrar a Productos y pulsar Nuevo producto (o ir a /products/create).
2. Completar el formulario. Los errores se validan en el servidor y se muestran por campo; los datos escritos no se pierden.
3. Al guardar, lleva al detalle del producto con un aviso de confirmacion.
4. Para editar, usar el boton Editar producto en el detalle.
5. Para borrar, usar el boton Eliminar producto en el detalle (pide confirmacion y vuelve al listado).

Reglas: nombre de 3 a 60 caracteres, categoria de la lista, precio entero entre $100 y $10.000.000, descripcion de 10 a 400 caracteres, hasta 6 tamanos y hasta 6 colores. La imagen se elige de la lista de fotos o con una URL http(s).


IMAGENES

Los productos usan fotos reales de Unsplash (licencia gratuita, sin necesidad de atribucion). Se cargan por URL, asi que se necesita internet para verlas; si una no carga, se muestra el logo. Cuando la tienda tenga fotos propias, se pueden cambiar editando el producto (campo URL de otra foto) o guardandolas en public/img/ y usando la ruta /img/archivo.jpg.


NOTAS

- Los productos se guardan en data/products.json. Los que se creen, editen o eliminen mientras se prueba quedan reflejados en ese archivo; para volver a los datos originales se restaura con: git checkout data/products.json
- Solo los precios de Vacas corredoras ($40.000) y Domo de Snoopy ($80.000) vienen de la tienda; el resto de productos, precios, resenas y cifras (500+, 5.0, 2+ anos) son de ejemplo y deben validarse con la tienda.
- El carrito, el registro y el login aun no tienen logica (llegan en sprints posteriores).


ENTREGABLES DEL SPRINT 4

[x] retro.md con la retro del Sprint 3
[ ] Tablero de trabajo actualizado (link arriba)
[x] weekly.md con el seguimiento del Sprint 4
[x] data/products.json y data/users.json con datos generados
[x] Administracion completa de productos: listado, detalle, creacion, edicion y eliminacion

Entregables del Sprint 3
[x] Todas las vistas en formato .ejs, organizadas en subcarpetas por seccion
[x] Parciales reutilizables: head, header y footer
[x] Formularios funcionales de creacion y edicion de productos
[x] retro.md y weekly.md en el repositorio
[ ] Link al tablero de trabajo en este README
