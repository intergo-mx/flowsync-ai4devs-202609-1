# tasks Specification

## Purpose
Lista compartida de tareas del equipo: cualquier persona con sesión ve las mismas tareas, apunta una nueva escribiendo solo su título y cambia el estado de cualquiera desde la propia lista.

## Requirements

### Requirement: Listado de tareas por API

El sistema SHALL devolver todas las tareas existentes con `GET /api/v1/tasks`, la misma colección para cualquier persona con sesión, sin ordenarla de forma explícita ni paginarla.

#### Scenario: Dos personas piden la lista

- **WHEN** dos personas distintas con sesión piden la lista sin que nada cambie entre ambas peticiones
- **THEN** las dos reciben 200 con las mismas tareas, en `{ "data": [...] }`

#### Scenario: Tarea creada por otra persona

- **WHEN** otra persona ha creado una tarea y se la ha asignado a sí misma, y yo pido la lista
- **THEN** esa tarea aparece en la respuesta

#### Scenario: Todavía no hay tareas

- **WHEN** no se ha creado ninguna tarea y se pide la lista
- **THEN** la respuesta es 200 con `{ "data": [] }`

#### Scenario: Pedir la lista no modifica nada

- **WHEN** se pide la lista varias veces
- **THEN** ninguna tarea cambia de estado ni de responsable

### Requirement: Datos que expone cada tarea

El sistema SHALL devolver de cada tarea un identificador, su título, su estado, el nombre de su responsable, su fecha de vencimiento y si está vencida, y SHALL NOT devolver el correo ni el identificador de la cuenta del responsable, ni las marcas de creación o modificación.

#### Scenario: Tarea con responsable con nombre

- **WHEN** la lista contiene una tarea cuyo responsable tiene nombre "Ada Lovelace"
- **THEN** esa tarea trae `title`, `status`, `dueDate`, `isOverdue` y `assignee` con `fullName` igual a "Ada Lovelace"

#### Scenario: Responsable sin nombre

- **WHEN** la lista contiene una tarea cuyo responsable no tiene nombre puesto
- **THEN** su `assignee` trae `fullName` igual a `null`

#### Scenario: Nada más del responsable ni de la tarea

- **WHEN** se pide la lista
- **THEN** ninguna tarea contiene el correo del responsable, el identificador de su cuenta ni marcas de creación o modificación

### Requirement: Acceso a las tareas exige sesión

El sistema SHALL rechazar con 401 cualquier operación sobre tareas hecha sin un token de acceso válido.

#### Scenario: Sin token

- **WHEN** se pide la lista, se crea una tarea o se actualiza una sin cabecera `Authorization`
- **THEN** la respuesta es 401 y no se devuelve ni se modifica ninguna tarea

#### Scenario: Token desconocido

- **WHEN** se hace cualquiera de esas peticiones con un token que el sistema no reconoce
- **THEN** la respuesta es 401

### Requirement: Creación de una tarea con solo el título

El sistema SHALL crear una tarea con `POST /api/v1/tasks` a partir de `title` y, opcionalmente, `dueDate`, y SHALL responder con la tarea creada.

#### Scenario: Título válido

- **WHEN** una persona con sesión envía `{ "title": "Preparar la demo" }`
- **THEN** la respuesta es 200 con la tarea creada en `{ "data": {...} }`
- **THEN** la tarea aparece desde ese momento en la lista de todo el mundo

#### Scenario: Se ignora cualquier otro dato

- **WHEN** la petición incluye además `status`, un responsable o `isOverdue`
- **THEN** la tarea se crea igualmente con el estado y el responsable por defecto, sin tener en cuenta esos datos

#### Scenario: Espacios alrededor del título

- **WHEN** se envía un título con espacios al principio o al final
- **THEN** la tarea se crea con el título sin esos espacios

### Requirement: Título obligatorio y acotado

El sistema SHALL rechazar con 422 la creación de una tarea cuyo título falte, esté en blanco o supere los 255 caracteres, sin crear ninguna tarea ni recortar el título.

#### Scenario: Título ausente

- **WHEN** se envía una creación sin `title`
- **THEN** la respuesta es 422 con un error de campo `title` de regla `required`
- **THEN** no se crea ninguna tarea

#### Scenario: Título solo con espacios

- **WHEN** se envía un `title` formado únicamente por espacios
- **THEN** la respuesta es 422 igual que si faltara, y la lista no gana ninguna fila

#### Scenario: Título que se pasa de largo

- **WHEN** se envía un `title` de más de 255 caracteres
- **THEN** la respuesta es 422 con un error de campo `title` de regla `maxLength`
- **THEN** no se guarda ninguna versión recortada

#### Scenario: Título en el límite

- **WHEN** se envía un `title` de exactamente 255 caracteres
- **THEN** la tarea se crea con el título completo

### Requirement: Responsable y estado por defecto

El sistema SHALL asignar a toda tarea nueva como responsable a la persona que la crea y el estado `pending`.

#### Scenario: Nace mía

- **WHEN** una persona crea una tarea sin indicar nada más que el título
- **THEN** el responsable de la tarea devuelta es esa persona

#### Scenario: Nace pendiente

- **WHEN** una persona crea una tarea sin indicar nada más que el título
- **THEN** el estado de la tarea devuelta es `pending`

### Requirement: Estados cerrados

El sistema SHALL admitir únicamente los estados `pending`, `in_progress` y `done`, y SHALL rechazar con 422 cualquier otro valor, sin ofrecer forma de añadir, renombrar ni eliminar estados.

#### Scenario: Valor fuera del conjunto

- **WHEN** se actualiza una tarea con un `status` distinto de los tres valores, por ejemplo "En curso" o "blocked"
- **THEN** la respuesta es 422 con un error de campo `status`
- **THEN** la tarea conserva el estado que tenía

#### Scenario: Los tres valores son válidos

- **WHEN** se actualiza una tarea con `status` igual a `pending`, `in_progress` o `done`
- **THEN** la respuesta es 200 y la tarea queda en ese estado

### Requirement: Actualización de estado y responsable

El sistema SHALL permitir con `PATCH /api/v1/tasks/:id` cambiar el estado, el responsable y la fecha de vencimiento de cualquier tarea, sea de quien sea, enviando solo los campos que cambian.

#### Scenario: Cambiar el estado de una tarea ajena

- **WHEN** una persona cambia el estado de una tarea cuyo responsable es otra persona
- **THEN** la respuesta es 200 con la tarea en su nuevo estado
- **THEN** el cambio se aplica sin ningún permiso especial ni advertencia

#### Scenario: Cualquier cambio de estado es válido

- **WHEN** una tarea en `done` se actualiza a `pending`, o una en `pending` a `done`
- **THEN** el cambio se aplica

#### Scenario: Cambiar el responsable

- **WHEN** se envía un `assigneeId` que corresponde a una cuenta existente
- **THEN** la respuesta es 200 y la tarea queda con el responsable nuevo
- **THEN** su estado, su título y su fecha no cambian

#### Scenario: Responsable inexistente

- **WHEN** se envía un `assigneeId` que no corresponde a ninguna cuenta
- **THEN** la respuesta es 422 con un error de campo `assigneeId`
- **THEN** la tarea conserva su responsable

#### Scenario: Tarea inexistente

- **WHEN** se actualiza una tarea con un identificador que no existe
- **THEN** la respuesta es 404

#### Scenario: El título no se edita

- **WHEN** la petición de actualización incluye `title`
- **THEN** el título de la tarea no cambia

### Requirement: Superficie de la API de tareas

El sistema SHALL ofrecer sobre tareas únicamente listar, leer una, crear y actualizar, y SHALL NOT ofrecer borrado ni endpoints de equipo.

#### Scenario: Leer una sola tarea

- **WHEN** se hace `GET /api/v1/tasks/:id` con sesión sobre una tarea que existe
- **THEN** la respuesta es 200 con la tarea

#### Scenario: Borrar una tarea

- **WHEN** se hace `DELETE /api/v1/tasks/:id`
- **THEN** la respuesta es 404 o 405 y la tarea sigue en la lista

### Requirement: Pantalla de la lista compartida

La aplicación SHALL ofrecer en la dirección `/tasks` una única lista con todas las tareas, igual para todas las personas, en la que cada fila muestra el título, el nombre del responsable y el estado.

#### Scenario: Ver el trabajo del equipo sin abrir nada

- **WHEN** una persona con sesión abre la lista y hay tareas repartidas entre varias personas
- **THEN** cada fila muestra su título, el nombre de quien la lleva y su estado, sin necesidad de abrirla

#### Scenario: Responsable identificado por su nombre

- **WHEN** el responsable de una tarea tiene nombre
- **THEN** la fila muestra ese nombre, y no su correo ni un identificador

#### Scenario: Responsable sin nombre

- **WHEN** el responsable de una tarea no tiene nombre puesto
- **THEN** la fila muestra "Sin nombre", y no su correo ni un identificador

#### Scenario: Estados con su nombre en castellano

- **WHEN** una tarea está en `pending`, `in_progress` o `done`
- **THEN** la fila muestra respectivamente "Pendiente", "En curso" o "Hecho"

#### Scenario: Sin fechas ni marcas de vencida

- **WHEN** se mira la lista
- **THEN** ninguna fila muestra fechas ni marca de vencida

#### Scenario: Sin vistas ni señales añadidas

- **WHEN** se busca otra vista de tareas, tareas privadas o quién está conectado
- **THEN** no existe ninguna vista "mis tareas", ninguna forma de ocultar una tarea a los demás ni señal de presencia

#### Scenario: Mirar no cambia nada

- **WHEN** se abre y se recorre la lista
- **THEN** ninguna tarea cambia de estado ni de responsable

### Requirement: Estado vacío de la lista

La aplicación SHALL explicar para qué sirve la lista y ofrecer crear la primera tarea cuando todavía no existe ninguna.

#### Scenario: Primera visita sin tareas

- **WHEN** una persona abre la lista y no hay ninguna tarea
- **THEN** ve un texto que explica qué es la lista y el formulario para crear la primera tarea
- **THEN** no ve una lista vacía sin más

### Requirement: Crear una tarea desde la pantalla

La aplicación SHALL ofrecer un formulario con un solo campo, el título, y SHALL mostrar la tarea nueva en la lista sin recargar ni navegar.

#### Scenario: Crear con solo el título

- **WHEN** la persona escribe un título y pulsa el botón de crear
- **THEN** la tarea aparece en la lista como "Pendiente" y con su nombre como responsable
- **THEN** el campo queda vacío para apuntar otra

#### Scenario: El formulario no pide nada más

- **WHEN** la persona recorre el formulario de creación
- **THEN** no se le ofrece ni sugiere responsable, estado ni fecha

#### Scenario: Título vacío o en blanco

- **WHEN** la persona intenta crear con el campo vacío o con solo espacios
- **THEN** ve junto al campo un aviso en lenguaje corriente y no aparece ninguna fila nueva

#### Scenario: Título demasiado largo

- **WHEN** la persona intenta crear con un título de más de 255 caracteres
- **THEN** ve junto al campo un aviso de que se pasa de largo
- **THEN** no se guarda ninguna versión recortada

### Requirement: Cambiar el estado desde la fila

La aplicación SHALL permitir cambiar el estado de cualquier tarea desde su propia fila con un solo gesto, ofreciendo como únicos destinos Pendiente, En curso y Hecho.

#### Scenario: Cambio inmediato

- **WHEN** la persona elige otro estado en la fila de una tarea
- **THEN** la fila muestra el nuevo estado al terminar la petición, sin abrir la tarea, sin diálogo de confirmación y sin rellenar ningún campo

#### Scenario: Tarea de otra persona

- **WHEN** la persona cambia el estado de una tarea cuyo responsable es otra
- **THEN** el cambio se aplica igual que en una tarea propia, sin permiso ni advertencia

#### Scenario: Solo tres destinos

- **WHEN** la persona mira a qué estados puede cambiar una tarea
- **THEN** ve únicamente Pendiente, En curso y Hecho, y la tarea queda en exactamente uno de ellos

#### Scenario: El cambio falla

- **WHEN** el servidor rechaza o no puede completar el cambio de estado
- **THEN** la fila conserva el estado anterior y la persona ve un aviso del fallo

#### Scenario: La pantalla exige sesión

- **WHEN** una persona sin sesión intenta abrir `/tasks`
- **THEN** no ve ninguna tarea y llega a la pantalla de inicio de sesión

### Requirement: Fecha de vencimiento de una tarea

El sistema SHALL permitir que una tarea tenga una fecha de vencimiento de calendario, sin hora, en formato `YYYY-MM-DD` y expuesta como `dueDate` (`null` si no tiene), que se puede poner, cambiar y quitar.

#### Scenario: Tarea nueva sin fecha

- **WHEN** una persona crea una tarea enviando solo el título
- **THEN** la tarea devuelta tiene `dueDate` igual a `null`

#### Scenario: Poner una fecha

- **WHEN** se actualiza una tarea sin fecha con `{ "dueDate": "2026-12-01" }`
- **THEN** la respuesta es 200 con `dueDate` igual a "2026-12-01"
- **THEN** pedirla de nuevo devuelve esa misma fecha

#### Scenario: Cambiar la fecha

- **WHEN** se actualiza una tarea con fecha enviando otra fecha distinta
- **THEN** la tarea queda con la fecha nueva

#### Scenario: Quitar la fecha enviándola vacía

- **WHEN** se actualiza una tarea con fecha enviando `{ "dueDate": null }` o `{ "dueDate": "" }`
- **THEN** la respuesta es 200 con `dueDate` igual a `null`
- **THEN** la tarea deja de considerarse vencida si lo estaba

#### Scenario: No enviar la fecha no la toca

- **WHEN** se actualiza el estado o el responsable de una tarea sin incluir `dueDate`
- **THEN** la fecha de la tarea queda como estaba

#### Scenario: Fecha pasada aceptada al crear

- **WHEN** se crea una tarea con una `dueDate` anterior a hoy
- **THEN** la respuesta es 200 y la tarea nace con esa fecha y con `isOverdue` igual a `true`

#### Scenario: Fecha pasada aceptada al actualizar

- **WHEN** se actualiza una tarea con una `dueDate` anterior a hoy
- **THEN** la respuesta es 200 y la tarea queda con esa fecha, sin rechazo

#### Scenario: Fecha imposible o incompleta

- **WHEN** se envía una `dueDate` que no existe, como "2026-02-30", o incompleta, como "2026-12"
- **THEN** la respuesta es 422 con un error de campo `dueDate`
- **THEN** la tarea conserva la fecha que tuviera

#### Scenario: Cualquiera cambia la fecha de cualquier tarea

- **WHEN** una persona cambia la fecha de una tarea cuyo responsable es otra
- **THEN** el cambio se aplica sin advertencia ni permiso especial

#### Scenario: Reasignar no toca la fecha

- **WHEN** se cambia el responsable de una tarea con fecha
- **THEN** su `dueDate` y su `isOverdue` quedan como estaban

### Requirement: Regla de vencimiento

El sistema SHALL marcar una tarea con `isOverdue` igual a `true` solo cuando tiene fecha, esa fecha es anterior al día de referencia y su estado no es `done`; en cualquier otro caso `isOverdue` SHALL ser `false`.

#### Scenario: Fecha de ayer y sin hacer

- **WHEN** una tarea `pending` o `in_progress` tiene una fecha anterior al día de referencia
- **THEN** su `isOverdue` es `true`

#### Scenario: Vence hoy todavía no está vencida

- **WHEN** una tarea sin hacer tiene como fecha el propio día de referencia
- **THEN** su `isOverdue` es `false`

#### Scenario: Fecha futura

- **WHEN** una tarea tiene una fecha posterior al día de referencia
- **THEN** su `isOverdue` es `false`

#### Scenario: Sin fecha nunca vence

- **WHEN** una tarea sin fecha lleva semanas pendiente
- **THEN** su `isOverdue` es `false`

#### Scenario: Hecha con la fecha pasada

- **WHEN** una tarea en `done` tiene una fecha anterior al día de referencia
- **THEN** su `isOverdue` es `false`

#### Scenario: Pasar a hecho deja de vencer sin tocar la fecha

- **WHEN** una tarea vencida se actualiza a `done`
- **THEN** su `isOverdue` pasa a `false` y su `dueDate` no cambia

#### Scenario: Aplazar la fecha

- **WHEN** una tarea vencida recibe una fecha posterior al día de referencia
- **THEN** su `isOverdue` pasa a `false`

#### Scenario: Volver desde hecho

- **WHEN** una tarea en `done` con la fecha pasada se actualiza a `pending`
- **THEN** su `isOverdue` pasa a `true`

### Requirement: Día de referencia aportado por el cliente

El sistema SHALL calcular `isOverdue` en cada lectura respecto al día que el cliente indica en el parámetro de consulta `today` (`YYYY-MM-DD`), o respecto al día actual en UTC si no lo indica.

#### Scenario: Dos personas en husos distintos

- **WHEN** una tarea sin hacer tiene fecha 2026-10-07 y una persona la pide con `today=2026-10-08` y otra con `today=2026-10-07`
- **THEN** a la primera le llega `isOverdue` igual a `true` y a la segunda `false`

#### Scenario: Vence sola con el paso del día

- **WHEN** una tarea sin hacer con fecha de hoy se pide de nuevo con el día siguiente como `today`, sin que nadie la haya modificado
- **THEN** su `isOverdue` es `true`

#### Scenario: Sin día de referencia

- **WHEN** se pide una tarea sin parámetro `today`
- **THEN** el veredicto se calcula con el día actual en UTC

#### Scenario: Día de referencia inválido

- **WHEN** se envía `today` con un valor que no es una fecha `YYYY-MM-DD` válida
- **THEN** la respuesta es 422 con un error de campo `today`

### Requirement: El vencimiento se calcula y no se envía

El sistema SHALL calcular `isOverdue` en cada lectura sin guardarlo, e ignorar cualquier `isOverdue` enviado por el cliente.

#### Scenario: El cliente envía isOverdue

- **WHEN** una petición de creación o actualización incluye `isOverdue` igual a `true` o `false`
- **THEN** el valor se ignora y la respuesta trae el veredicto calculado por el servidor

#### Scenario: Sin marcas por el paso del tiempo

- **WHEN** pasa un día sin ninguna petición de escritura
- **THEN** el estado guardado de las tareas no cambia y el veredicto sale de la lectura siguiente

### Requirement: Lectura individual de una tarea

El sistema SHALL devolver una tarea con `GET /api/v1/tasks/:id`, con la misma representación que en la lista, a cualquier persona con sesión.

#### Scenario: Tarea existente

- **WHEN** una persona con sesión pide una tarea que existe
- **THEN** la respuesta es 200 con `{ "data": {...} }` que contiene `id`, `title`, `status`, `assignee`, `dueDate` e `isOverdue`

#### Scenario: Tarea inexistente

- **WHEN** se pide una tarea con un identificador que no existe
- **THEN** la respuesta es 404

#### Scenario: Sin sesión

- **WHEN** se pide una tarea sin token o con un token desconocido
- **THEN** la respuesta es 401

#### Scenario: Mirar no cambia nada

- **WHEN** se pide varias veces una tarea
- **THEN** su estado, responsable y fecha no cambian

### Requirement: Abrir una tarea desde la lista

La aplicación SHALL permitir abrir una tarea desde la lista y mostrar en `/tasks/:id` su título, su fecha de vencimiento editable y, si lo está, una señal de que está vencida.

#### Scenario: Abrir desde la lista

- **WHEN** la persona pulsa el título de una tarea en la lista
- **THEN** ve la página de esa tarea con su título y su fecha, o el campo vacío si no tiene

#### Scenario: Tarea que no existe

- **WHEN** la persona abre `/tasks/:id` de una tarea que no existe
- **THEN** ve un mensaje de que no se encontró la tarea y un enlace de vuelta a la lista

#### Scenario: Volver a la lista

- **WHEN** la persona pulsa el enlace de vuelta
- **THEN** ve la lista de tareas

#### Scenario: La página exige sesión

- **WHEN** una persona sin sesión abre `/tasks/:id`
- **THEN** no ve ninguna tarea y llega a la pantalla de inicio de sesión

### Requirement: Señal de tarea vencida

La aplicación SHALL indicar en la página de una tarea que está vencida con un aviso propio con texto, sin depender solo del color, tomando el veredicto del servidor.

#### Scenario: Tarea vencida

- **WHEN** la persona abre una tarea sin hacer con fecha anterior a hoy
- **THEN** ve un aviso con el texto "Vencida", sin tener que comparar la fecha con hoy

#### Scenario: Vence hoy

- **WHEN** abre una tarea sin hacer con fecha de hoy
- **THEN** no ve el aviso de vencida

#### Scenario: Hecha, futura o sin fecha

- **WHEN** abre una tarea en Hecho con fecha pasada, una con fecha futura o una sin fecha
- **THEN** no ve el aviso de vencida

#### Scenario: Sin fecha no se avisa de nada

- **WHEN** abre una tarea sin fecha
- **THEN** no ve ningún aviso, recordatorio ni indicación de que le falte algo

#### Scenario: Día de la persona

- **WHEN** la aplicación pide la tarea
- **THEN** envía como día de referencia el día de calendario del dispositivo de la persona

### Requirement: Editar la fecha desde la página de la tarea

La aplicación SHALL permitir poner, cambiar y quitar la fecha desde la página de la tarea, guardándola al instante sin paso de guardado ni confirmación.

#### Scenario: Poner una fecha

- **WHEN** la persona elige una fecha completa en el campo de fecha
- **THEN** la fecha queda guardada y la página la refleja al instante, sin recargar ni reabrir

#### Scenario: Poner una fecha pasada

- **WHEN** la persona elige una fecha anterior a hoy en una tarea sin hacer
- **THEN** se acepta y la página muestra enseguida el aviso de vencida

#### Scenario: Quitar la fecha

- **WHEN** la persona pulsa "Quitar fecha"
- **THEN** la tarea queda sin fecha, sin diálogo de confirmación, y el aviso de vencida desaparece si estaba

#### Scenario: Fecha incompleta o inválida

- **WHEN** la persona deja una fecha incompleta o imposible en el campo
- **THEN** ve junto al campo un aviso en castellano y no se envía el cambio
- **THEN** la tarea conserva la fecha que tuviera

#### Scenario: Tarea de otra persona

- **WHEN** la persona cambia la fecha de una tarea cuyo responsable es otra
- **THEN** el cambio se aplica sin advertencia ni permiso especial

#### Scenario: Operable con teclado

- **WHEN** la persona usa solo el teclado
- **THEN** puede alcanzar el campo de fecha y el botón "Quitar fecha" y accionarlos

### Requirement: La lista no muestra fechas ni vencimientos

La aplicación SHALL mantener la lista mostrando solo título, responsable y estado, sin fecha ni marca de vencida, y sin avisar de que a una tarea le falte la fecha.

#### Scenario: Tareas con fecha y vencidas

- **WHEN** la persona abre la lista y hay tareas con fecha, algunas vencidas
- **THEN** ninguna fila muestra una fecha ni una marca de vencida

#### Scenario: Tareas sin fecha

- **WHEN** la persona abre la lista y hay tareas sin fecha
- **THEN** ninguna fila muestra aviso ni señal de que falte la fecha

#### Scenario: El formulario de creación no ofrece fecha

- **WHEN** la persona recorre el formulario de creación de la lista
- **THEN** no se le ofrece ni se le sugiere ninguna fecha
