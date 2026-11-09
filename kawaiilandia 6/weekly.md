WEEKLY - SPRINT 6 (BASES DE DATOS)

Integrantes:
- Neider Stiven Triana Neira
- Julian David Pinzon Duran
- Liseth Yurani Rodriguez Solano

Periodo: 31/10/2026 a 05/11/2026

Objetivo del sprint: dejar los archivos JSON y trabajar con una base de datos MySQL usando Sequelize, con el CRUD de productos y de usuarios funcionando sobre ella.


REUNION SEMANAL

Fecha: 03/11/2026
Asistentes: Neider Stiven Triana Neira, Julian David Pinzon Duran, Liseth Yurani Rodriguez Solano

Que hizo cada integrante, impedimentos y que hara:

Neider Stiven Triana Neira
- Que hizo: diagrama entidad-relacion, structure.sql y data.sql.
- Impedimentos: hubo que cambiar la tabla de carrito despues de revisar el diagrama con el equipo.
- Que hara: probar el script en una base vacia y revisar las relaciones.

Julian David Pinzon Duran
- Que hizo: configuracion de Sequelize, modelos con sus relaciones y servicios de productos.
- Impedimentos: las relaciones muchos a muchos (colores y tamanos) no devolvian el orden esperado.
- Que hara: CRUD de productos, buscador y paginado.

Liseth Yurani Rodriguez Solano
- Que hizo: registro y login sobre la base de datos, y vistas de usuarios.
- Impedimentos: ninguno.
- Que hara: carrito por usuario, README, retro, weekly y daily.


AVANCE TECNICO

Estado: Hecho / En curso.

1. Retro del Sprint 5 y tablero reiniciado - Hecho
2. Diagrama entidad-relacion en PDF (docs/diagrama-der.pdf) - Hecho - Neider
3. structure.sql: base de datos, tablas, tipos, restricciones y claves foraneas - Hecho - Neider
4. data.sql: usuarios, productos, categorias, colores, tamanos y un carrito - Hecho - Neider
5. Instalar Sequelize, mysql2 y dotenv; configuracion con .env y .sequelizerc - Hecho - Julian
6. Modelos de Sequelize con sus relaciones - Hecho - Julian
7. Script npm run db:setup para crear la base sin usar el cliente de mysql - Hecho - Neider
8. Servicios (carpeta services) con las consultas a la base - Hecho - Julian
9. CRUD de productos: crear, editar, eliminar, listar y detalle - Hecho - Julian
10. Buscador por nombre o descripcion junto con el filtro de categoria - Hecho - Julian
11. Paginado en productos y en usuarios - Hecho - Julian
12. Registro y login con la base de datos - Hecho - Liseth
13. Usuarios: detalle y edicion (nombre, correo, foto y contrasena) - Hecho - Liseth
14. Listado de usuarios solo para administradores - Hecho - Liseth
15. Carrito por usuario: agregar, cambiar cantidad y quitar - Hecho - Liseth
16. Pruebas de rutas y permisos como huesped, cliente y admin - Hecho
17. README, retro, weekly y daily - Hecho - Liseth
18. CRUD de tablas secundarias (categorias, colores, tamanos) - No se hizo (opcional)


DECISIONES TECNICAS

- Las tablas y los campos estan en ingles porque Sequelize trabaja mejor asi.
- La base tiene 10 tablas: user_categories, users, categories, products, colors, sizes, product_colors, product_sizes, carts y cart_items.
- Las consultas a la base estan en la carpeta services para que los controladores queden cortos.
- Los datos de conexion estan en el archivo .env (hay un .env.example de ejemplo).
- El slug del producto se usa en la URL (por ejemplo /products/domo-snoopy).
- Cada usuario edita solo su cuenta; el administrador puede editar cualquiera y cambiar el tipo de cuenta de otras personas.
- Las contrasenas siguen guardadas con scrypt.


IMPEDIMENTOS

- Ajustes en el diagrama despues de revisarlo (la tabla del carrito).
- Las validaciones de los formularios todavia son minimas.


PROXIMOS PASOS

- Validaciones del back-end y del front-end (Sprint 7).
- CRUD de tablas secundarias (opcional).
