WEEKLY - SPRINT 7 (VALIDACIONES)

Integrantes:
- Neider Stiven Triana Neira
- Julian David Pinzon Duran
- Liseth Yurani Rodriguez Solano

Periodo: 06/11/2026 a 09/11/2026

Objetivo del sprint: validar los formularios en el back-end con Express Validator y en el front-end con JavaScript, para que no lleguen datos invalidos a la base de datos.


REUNION SEMANAL

Fecha: 07/11/2026
Asistentes: Neider Stiven Triana Neira, Julian David Pinzon Duran, Liseth Yurani Rodriguez Solano

Que hizo cada integrante, impedimentos y que hara:

Neider Stiven Triana Neira
- Que hizo: validaciones del back-end de registro y login con Express Validator.
- Impedimentos: la imagen llegaba antes de validarse y quedaba guardada aunque el formulario tuviera errores.
- Que hara: validaciones de productos y pruebas con datos incorrectos.

Julian David Pinzon Duran
- Que hizo: archivo public/js/validaciones.js con las reglas del front-end.
- Impedimentos: ninguno.
- Que hara: conectar el archivo a los formularios de registro, login y productos.

Liseth Yurani Rodriguez Solano
- Que hizo: vistas con los errores por campo y validacion del formulario de editar usuario.
- Impedimentos: ninguno.
- Que hara: README, retro, weekly y daily.


AVANCE TECNICO

Estado: Hecho / En curso.

1. Retro del Sprint 6 y tablero reiniciado - Hecho
2. Instalar express-validator y crear la carpeta validations - Hecho - Neider
3. Back-end, registro: nombre y apellido (minimo 2 caracteres), email valido y no repetido, contrasena de minimo 8 caracteres con mayusculas, minusculas, numero y caracter especial, imagen valida - Hecho - Neider
4. Back-end, login: el email debe existir en la base y la contrasena debe coincidir - Hecho - Neider
5. Back-end, productos: nombre de minimo 5 caracteres, descripcion de minimo 20, imagen valida y colores y tamanos que existan en la base - Hecho - Neider
6. Back-end en los demas formularios: editar usuario y carrito - Hecho - Liseth
7. La imagen de los productos pasa a ser un archivo subido con Multer (JPG, JPEG, PNG o GIF) - Hecho - Neider
8. Front-end, registro, login y productos, con las mismas reglas del servidor - Hecho - Julian
9. Front-end en los demas formularios - Hecho - Julian
10. Restricciones CHECK en structure.sql - Hecho - Liseth
11. Pruebas de cada formulario con datos incorrectos - Hecho
12. README, retro, weekly y daily - Hecho - Liseth


DECISIONES TECNICAS

- Se valida en el navegador, en el servidor y en la base de datos. La del servidor es la que cuenta, porque la del navegador se puede desactivar.
- Los mensajes de error son los mismos en el navegador y en el servidor.
- La contrasena nueva debe tener mayusculas, minusculas, numero y caracter especial. El login no lo exige para que los usuarios existentes puedan seguir entrando.
- La imagen del producto ahora es un archivo. Se quito WEBP y solo se aceptan JPG, JPEG, PNG y GIF.
- Los colores y tamanos del formulario de productos se eligen de la lista que sale de la base.
- El login muestra el error en cada campo: si el email no existe o si la contrasena no coincide.
- Las validaciones del servidor estan en la carpeta validations, una por formulario.


IMPEDIMENTOS

- Las imagenes subidas con formularios incorrectos quedaban guardadas; se corrigio borrandolas.


PROXIMOS PASOS

- Revisar el proyecto completo antes de la entrega final.
