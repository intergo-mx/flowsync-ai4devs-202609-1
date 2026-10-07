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

El sistema SHALL devolver de cada tarea un identificador, su título, su estado y el nombre de su responsable, y SHALL NOT devolver el correo ni el identificador de la cuenta del responsable, ni ninguna fecha.

#### Scenario: Tarea con responsable con nombre

- **WHEN** la lista contiene una tarea cuyo responsable tiene nombre "Ada Lovelace"
- **THEN** esa tarea trae `title`, `status` y `assignee` con `fullName` igual a "Ada Lovelace"

#### Scenario: Responsable sin nombre

- **WHEN** la lista contiene una tarea cuyo responsable no tiene nombre puesto
- **THEN** su `assignee` trae `fullName` igual a `null`

#### Scenario: Nada más del responsable ni de la tarea

- **WHEN** se pide la lista
- **THEN** ninguna tarea contiene el correo del responsable, el identificador de su cuenta ni campos de fecha

### Requirement: Acceso a las tareas exige sesión

El sistema SHALL rechazar con 401 cualquier operación sobre tareas hecha sin un token de acceso válido.

#### Scenario: Sin token

- **WHEN** se pide la lista, se crea una tarea o se actualiza una sin cabecera `Authorization`
- **THEN** la respuesta es 401 y no se devuelve ni se modifica ninguna tarea

#### Scenario: Token desconocido

- **WHEN** se hace cualquiera de esas peticiones con un token que el sistema no reconoce
- **THEN** la respuesta es 401

### Requirement: Creación de una tarea con solo el título

El sistema SHALL crear una tarea con `POST /api/v1/tasks` a partir únicamente de `title`, y SHALL responder con la tarea creada.

#### Scenario: Título válido

- **WHEN** una persona con sesión envía `{ "title": "Preparar la demo" }`
- **THEN** la respuesta es 200 con la tarea creada en `{ "data": {...} }`
- **THEN** la tarea aparece desde ese momento en la lista de todo el mundo

#### Scenario: Se ignora cualquier otro dato

- **WHEN** la petición incluye además `status` o un responsable
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

El sistema SHALL permitir con `PATCH /api/v1/tasks/:id` cambiar el estado y el responsable de cualquier tarea, sea de quien sea, enviando solo los campos que cambian.

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
- **THEN** su estado y su título no cambian

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

El sistema SHALL ofrecer sobre tareas únicamente listar, crear y actualizar, y SHALL NOT ofrecer lectura individual, borrado ni endpoints de equipo.

#### Scenario: Leer una sola tarea

- **WHEN** se hace `GET /api/v1/tasks/:id`
- **THEN** la respuesta es 404 o 405, y no devuelve la tarea

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
