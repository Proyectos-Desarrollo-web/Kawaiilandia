WEEKLY - SPRINT 5 (MIDDLEWARES Y AUTENTICACION)

Integrantes:
- Neider Stiven Triana Neira
- Julian David Pinzon Duran
- Liseth Yurani Rodriguez Solano

Periodo: 26/10/2026 a 30/10/2026

Objetivo del sprint: que el sitio permita registrarse, ingresar, recordar al usuario y cerrar sesion, con rutas solo para huespedes (sin login) y rutas solo para usuarios logueados.


REUNION SEMANAL

Fecha: 28/10/2026
Asistentes: Neider Stiven Triana Neira, Julian David Pinzon Duran, Liseth Yurani Rodriguez Solano

Que hizo cada integrante, impedimentos y que hara:

Neider Stiven Triana Neira
- Que hizo: modelo de usuarios (crear usuario con contrasena hasheada), registro y login.
- Impedimentos: no sabia donde guardar la sesion para que no se perdiera al cambiar de pagina.
- Que hara: logout y pruebas de las rutas como huesped y como cliente.

Julian David Pinzon Duran
- Que hizo: sesiones con express-session, cookie de recordarme y los middlewares guest, auth y admin.
- Impedimentos: la cookie de recordarme no se leia porque faltaba cookie-parser.
- Que hara: proteger las rutas del CRUD de productos y el carrito.

Liseth Yurani Rodriguez Solano
- Que hizo: vistas de registro, login y perfil, y foto de perfil con Multer.
- Impedimentos: ninguno.
- Que hara: header y footer segun si hay sesion o no, README, retro y weekly.


AVANCE TECNICO

Estado: Hecho / En curso.

1. Retro del Sprint 4 y tablero reiniciado - Hecho
2. Instalar express-session, cookie-parser y multer - Hecho
3. Registro (GET y POST /register) con validacion por campo y correo no repetido - Hecho - Neider
4. Foto de perfil con Multer - Hecho - Liseth
5. Login (GET y POST /login) con verificacion del hash - Hecho - Neider
6. Recordarme con cookie firmada de 30 dias - Hecho - Julian
7. Logout (POST /logout) - Hecho - Neider
8. Pagina de perfil (/profile) - Hecho - Liseth
9. Middleware de aplicacion userLogged y mensajes de una sola vez (flash) - Hecho - Julian
10. Middlewares de ruta guest, auth y admin - Hecho - Julian
11. Perfil, logout y carrito solo para logueados; crear, editar y borrar productos solo para admin - Hecho - Julian
12. Header y footer segun el estado del usuario - Hecho - Liseth
13. Pruebas de cada ruta como huesped, cliente y admin - Hecho
14. README, retro y weekly - Hecho - Liseth


DECISIONES TECNICAS

- Las rutas nuevas quedaron en ingles (/register, /login, /profile, /logout), igual que /products. Las viejas redirigen con codigo 301.
- La sesion se guarda en memoria con express-session y se pierde al reiniciar el servidor.
- Recordarme usa una cookie firmada que solo guarda el id del usuario.
- El secreto de las cookies sale de la variable SESSION_SECRET.
- Las contrasenas se guardan con scrypt y nunca se guardan en la sesion.
- El logout es POST para que no se pueda cerrar la sesion solo con abrir un enlace.
- Crear, editar y borrar productos queda solo para usuarios con categoria admin.
- Quien se registra desde el sitio es siempre customer.


IMPEDIMENTOS

- Los datos de prueba se mezclaban con los reales en los archivos JSON.


PROXIMOS PASOS

- Pasar de los archivos JSON a base de datos (Sprint 6).
- Carrito por usuario (hoy es de ejemplo y el mismo para todos).
- Poder editar el perfil.
