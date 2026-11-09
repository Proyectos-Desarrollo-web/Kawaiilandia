RETROSPECTIVAS

Dinamica: estrella de mar (Starfish).
Equipo:
- Neider Stiven Triana Neira
- Julian David Pinzon Duran
- Liseth Yurani Rodriguez Solano

Como hacerla (15 a 20 minutos): cada integrante escribe ideas en notas (una por nota) para las 5 categorias, se agrupan las repetidas, se votan las mas importantes y se convierten en acuerdos concretos con responsable.


------------------------------------------------------------
RETRO DEL SPRINT 6 (BASES DE DATOS)
------------------------------------------------------------

Fecha: 06/11/2026
Participantes: Neider Stiven Triana Neira, Julian David Pinzon Duran, Liseth Yurani Rodriguez Solano

Comenzar a hacer:
- Validar desde el primer formulario y no al final: las reglas (largos, formatos) se definieron tarde y hubo que tocar vistas, controladores y base de datos.
- Probar los archivos .sql en una base vacia antes de entregar, como lo haria quien descargue el proyecto.
- Escribir las reglas de cada campo en un solo lugar para que servidor, navegador y base usen las mismas.

Hacer mas:
- Disenar con el diagrama primero: tener las tablas y relaciones claras evito rehacer modelos.
- Separar las consultas a la base en una capa propia (services), que dejo los controladores cortos.
- Probar los permisos con cada tipo de usuario.

Continuar haciendo:
- Mantener la estructura MVC y los usuarios de prueba documentados en el README.
- Guardar los secretos y los datos de conexion solo en .env.
- Documentar las decisiones tecnicas en el weekly mientras se toman.

Hacer menos:
- Dejar lo opcional sin cerrar (el CRUD de tablas secundarias quedo pendiente) sin anotarlo en el tablero.
- Datos y textos de ejemplo sin confirmar con la tienda.

Dejar de hacer:
- Confiar en que el formulario ya manda datos buenos: cualquier dato puede llegar mal, por error o a proposito.
- Dejar el tablero sin actualizar hasta el final del sprint.

Acuerdos para el Sprint 7
- Definir entre todos las reglas de cada campo antes de programar las validaciones (responsable: Neider)
- Reiniciar el tablero, pasar lo pendiente del Sprint 6 y pegar el link en el README (responsable: Julian)
- Probar cada formulario con datos incorrectos, con el JavaScript activado y desactivado (responsable: Liseth)
- Completar weekly y daily durante la semana (responsable: Liseth)


------------------------------------------------------------
RETRO DEL SPRINT 5 (MIDDLEWARES Y AUTENTICACION)
------------------------------------------------------------

Fecha: 31/10/2026
Participantes: Neider Stiven Triana Neira, Julian David Pinzon Duran, Liseth Yurani Rodriguez Solano

Comenzar a hacer:
- Disenar la base de datos (diagrama) antes de programar, para no rehacer tablas y modelos a mitad del sprint.
- Probar los permisos con los tres tipos de visitante: huesped, cliente y admin.
- Guardar secretos y datos de conexion solo en .env, nunca en el codigo.

Hacer mas:
- Reutilizar los middlewares guest, auth y admin en vez de repetir condiciones en cada controlador.
- Revisar la seguridad de cada formulario nuevo (contrasenas con hash, redirecciones internas).
- Documentar las decisiones tecnicas en el weekly mientras se toman.

Continuar haciendo:
- Mantener la estructura MVC y los parciales.
- Validar en el servidor y mostrar los errores por campo.
- Dejar en el README los usuarios de prueba y los pasos para correr el proyecto.

Hacer menos:
- Dejar funciones a medias: el carrito seguia siendo de ejemplo y el mismo para todos los usuarios.
- Depender de archivos JSON que se pisan al probar.

Dejar de hacer:
- Guardar datos en archivos JSON: no escalan ni tienen relaciones.
- Dejar el tablero sin actualizar hasta el final del sprint.

Acuerdos para el Sprint 6
- Hacer primero el diagrama de la base y revisarlo entre todos antes de escribir los modelos (responsable: Neider)
- Reiniciar el tablero, pasar lo pendiente del Sprint 5 y pegar el link en el README (responsable: Julian)
- Que cada integrante pruebe npm run db:setup en su computador antes de la entrega (responsable: Liseth)
- Completar el weekly durante la semana, con fecha y responsable de cada tarea (responsable: Liseth)


------------------------------------------------------------
RETRO DEL SPRINT 4 (JSON Y METODOS HTTP)
------------------------------------------------------------

Fecha: 26/10/2026
Participantes: Neider Stiven Triana Neira, Julian David Pinzon Duran, Liseth Yurani Rodriguez Solano

Comenzar a hacer:
- Revisar el package.json y los archivos de entrega antes de cerrar el sprint.
- Armar una lista con cada ruta y su resultado esperado para probarlas antes de entregar.
- Escribir la fecha y el responsable de cada tarea en el weekly mientras se trabaja.

Hacer mas:
- Probar los formularios con datos incorrectos (la validacion por campo del CRUD funciono bien).
- Documentar las decisiones tecnicas en el weekly (rutas en ingles, method-override, hash de contrasenas).
- Reutilizar los parciales.

Continuar haciendo:
- Mantener la estructura MVC.
- Validar en el servidor y mostrar los errores por campo sin perder lo escrito.
- Guardar las contrasenas solo como hash.

Hacer menos:
- Dejar vacios en la documentacion (fechas, responsables).
- Dejar funciones a medias a la vista: login, registro y CRUD quedaron abiertos a cualquier visitante porque aun no habia usuarios con sesion.
- Dejar el link del tablero para despues.

Dejar de hacer:
- Subir cambios sin que otro integrante los revise.
- Dejar el tablero sin actualizar hasta el final del sprint.

Acuerdos para el Sprint 5
- Reiniciar el tablero, pasar lo pendiente del Sprint 4 y pegar el link en el README (responsable: Julian)
- Probar cada ruta como huesped, cliente y admin antes de darla por terminada (responsable: Liseth)
- Completar retro y weekly durante la semana (responsable: Neider)


------------------------------------------------------------
RETRO DEL SPRINT 3 (TEMPLATE ENGINES CON EJS)
------------------------------------------------------------

Fecha: 19/10/2026
Participantes: Neider Stiven Triana Neira, Julian David Pinzon Duran, Liseth Yurani Rodriguez Solano

Comenzar a hacer:
- Repartir las tareas desde el inicio del sprint, indicando un responsable por cada una.
- Probar los formularios con datos incorrectos antes de entregar.
- Anotar en el tablero los impedimentos apenas aparezcan.

Hacer mas:
- Reutilizar componentes con parciales (head, header, footer, product-card).
- Revisar entre todos los cambios antes de unirlos al proyecto.
- Reuniones cortas durante la semana para ver el avance.

Continuar haciendo:
- Mantener la estructura MVC (rutas, controladores, modelos y vistas separados).
- Validar los datos en el servidor y mostrar los errores por campo.
- Documentar las decisiones tecnicas en el weekly.

Hacer menos:
- Dejar la documentacion (retro, weekly, tablero) para el final del sprint.
- Datos y textos de ejemplo sin confirmar con la tienda.

Dejar de hacer:
- Trabajar varias personas sobre el mismo archivo sin avisar.
- Dejar tareas sin estimar ni asignar.

Acuerdos para el Sprint 4
- Actualizar el tablero de trabajo al inicio del sprint (responsable: Julian)
- Completar retro y weekly durante la semana, no al final (responsable: Liseth)
- Probar cada ruta del CRUD antes de darla por terminada (responsable: Neider)
