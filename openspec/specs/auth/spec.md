# auth Specification

## Purpose

Cuentas y acceso de FlowSync: registro de personas usuarias, inicio y cierre de sesión, persistencia de la sesión y consulta del perfil propio. Describe el comportamiento actual tanto de la API HTTP como de las pantallas de acceso.

## Requirements

### Requirement: Registro de cuenta por API

El sistema SHALL permitir crear una cuenta con `POST /api/v1/auth/signup` enviando `fullName` (texto o `null`), `email`, `password` y `passwordConfirmation`, y SHALL responder con el usuario creado y un token de acceso, sin necesidad de iniciar sesión por separado.

#### Scenario: Registro válido

- **WHEN** se envía un registro con un email que no existe, una contraseña de entre 8 y 32 caracteres y una confirmación idéntica
- **THEN** la respuesta es 200 con `{ "data": { "user": {...}, "token": "<texto>" } }`, y el token enviado como `Authorization: Bearer <token>` da acceso al perfil

#### Scenario: Nombre ausente

- **WHEN** se envía un registro válido con `fullName` igual a `null`
- **THEN** la cuenta se crea y el usuario devuelto tiene `fullName` igual a `null`

#### Scenario: Email ya registrado

- **WHEN** se envía un registro con un email que ya pertenece a otra cuenta
- **THEN** la respuesta es 422 con un error de campo `email` de regla `database.unique`, y no se crea ninguna cuenta nueva

#### Scenario: Email con formato inválido o demasiado largo

- **WHEN** se envía un registro cuyo `email` no tiene formato de email o supera los 254 caracteres
- **THEN** la respuesta es 422 con un error de campo `email`

#### Scenario: Contraseña fuera de longitud

- **WHEN** se envía un registro cuya `password` tiene menos de 8 o más de 32 caracteres
- **THEN** la respuesta es 422 con un error de campo `password`

#### Scenario: Confirmación distinta

- **WHEN** se envía un registro cuya `passwordConfirmation` no coincide con `password`
- **THEN** la respuesta es 422 con un error de campo `passwordConfirmation` de regla `sameAs`

#### Scenario: Campos obligatorios ausentes

- **WHEN** se envía un registro sin `email`, sin `password` o sin `passwordConfirmation`
- **THEN** la respuesta es 422 con un error de regla `required` por cada campo que falte

### Requirement: Inicio de sesión por API

El sistema SHALL permitir iniciar sesión con `POST /api/v1/auth/login` enviando `email` y `password`, y SHALL responder con el usuario y un token de acceso nuevo.

#### Scenario: Credenciales correctas

- **WHEN** se envía el email y la contraseña de una cuenta existente
- **THEN** la respuesta es 200 con `{ "data": { "user": {...}, "token": "<texto>" } }`

#### Scenario: Contraseña incorrecta o cuenta inexistente

- **WHEN** se envía una contraseña que no corresponde a la cuenta, o un email que no pertenece a ninguna cuenta
- **THEN** la respuesta es 400 con el código de error `E_INVALID_CREDENTIALS`, y la respuesta es la misma en ambos casos, de modo que no revela si el email existe

#### Scenario: Email con formato inválido

- **WHEN** se envía un `email` que no tiene formato de email
- **THEN** la respuesta es 422 con un error de campo `email`

#### Scenario: Varias sesiones simultáneas

- **WHEN** la misma cuenta inicia sesión dos veces
- **THEN** cada inicio devuelve un token distinto, y ambos tokens dan acceso al perfil a la vez

### Requirement: Consulta del perfil propio

El sistema SHALL devolver los datos de la persona autenticada con `GET /api/v1/account/profile` cuando la petición lleva un token de acceso válido.

#### Scenario: Perfil con token válido

- **WHEN** se pide el perfil con `Authorization: Bearer <token>` de un token vigente
- **THEN** la respuesta es 200 con `{ "data": {...} }` que contiene `id`, `fullName`, `email`, `createdAt`, `updatedAt` e `initials`, y la respuesta no contiene la contraseña en ninguna forma

#### Scenario: Petición sin token

- **WHEN** se pide el perfil sin cabecera `Authorization`
- **THEN** la respuesta es 401

#### Scenario: Token desconocido

- **WHEN** se pide el perfil con un token que el sistema no reconoce
- **THEN** la respuesta es 401

### Requirement: Iniciales del usuario

El sistema SHALL incluir en cada usuario devuelto un campo `initials` en mayúsculas, calculado a partir del nombre si existe y, si no, del email.

#### Scenario: Nombre de dos o más palabras

- **WHEN** el usuario tiene `fullName` "Ada Lovelace"
- **THEN** `initials` es "AL", y si el nombre tiene más de dos palabras, se usan las dos primeras

#### Scenario: Nombre de una sola palabra

- **WHEN** el usuario tiene `fullName` "Ada"
- **THEN** `initials` es "AD", las dos primeras letras de la palabra

#### Scenario: Sin nombre

- **WHEN** el usuario tiene `fullName` igual a `null` y el email `tu@email.com`
- **THEN** `initials` es "TE", la primera letra de la parte anterior a la arroba y la primera letra del dominio

### Requirement: Cierre de sesión por API

El sistema SHALL invalidar el token de acceso usado en la petición cuando se llama a `POST /api/v1/account/logout`, sin afectar a los demás tokens de la misma cuenta.

#### Scenario: Cierre con token válido

- **WHEN** se llama a logout con un token vigente
- **THEN** la respuesta es 200 con el mensaje `Logged out successfully`, y ese mismo token recibe 401 en peticiones posteriores al perfil

#### Scenario: Otras sesiones sobreviven

- **WHEN** una cuenta con dos tokens vigentes cierra sesión con uno de ellos
- **THEN** el otro token sigue dando acceso al perfil

#### Scenario: Cierre sin token

- **WHEN** se llama a logout sin token o con un token desconocido
- **THEN** la respuesta es 401

### Requirement: Formato de las respuestas de la API

El sistema SHALL responder siempre en JSON en las rutas de cuentas y acceso, envolviendo las respuestas correctas en `{ "data": ... }` y devolviendo los fallos de validación como 422 con una lista `errors` donde cada elemento indica `message`, `rule` y `field`.

#### Scenario: Petición que no pide JSON

- **WHEN** se llama a cualquier ruta de cuentas y acceso con una cabecera `Accept` distinta de JSON
- **THEN** la respuesta sigue siendo JSON

#### Scenario: Fallo de validación

- **WHEN** una petición de registro o inicio de sesión incumple una regla de validación
- **THEN** la respuesta es 422 con `{ "errors": [ { "message": "...", "rule": "...", "field": "..." } ] }`

### Requirement: Protección de pantallas según la sesión

La aplicación SHALL mostrar el perfil y la lista de tareas solo a quien tenga una sesión válida y SHALL mostrar las pantallas de registro e inicio de sesión solo a quien no la tenga.

#### Scenario: Visitante sin sesión pide el perfil

- **WHEN** una persona sin sesión abre la dirección del perfil
- **THEN** ve la pantalla de inicio de sesión

#### Scenario: Visitante sin sesión pide la lista de tareas

- **WHEN** una persona sin sesión abre la dirección de la lista de tareas
- **THEN** ve la pantalla de inicio de sesión

#### Scenario: Persona con sesión pide acceso o registro

- **WHEN** una persona con sesión abre la pantalla de inicio de sesión o la de registro
- **THEN** ve la lista de tareas

#### Scenario: Dirección desconocida

- **WHEN** una persona abre una dirección que la aplicación no tiene
- **THEN** ve la lista de tareas si tiene sesión, o la pantalla de inicio de sesión si no la tiene

#### Scenario: Comprobación de la sesión guardada

- **WHEN** la aplicación arranca con una sesión guardada y aún no ha comprobado si sigue siendo válida
- **THEN** ve un indicador de carga y no se la redirige a ninguna otra pantalla hasta terminar la comprobación

### Requirement: Pantalla de registro

La aplicación SHALL ofrecer una pantalla "Crea tu cuenta" con los campos "Nombre completo (opcional)", "Email", "Contraseña" y "Repite la contraseña", el botón "Crear cuenta" y un enlace "Inicia sesión" hacia la pantalla de acceso.

#### Scenario: Registro correcto

- **WHEN** la persona rellena email, contraseña y confirmación válidos y pulsa "Crear cuenta"
- **THEN** el botón muestra "Creando cuenta…" y queda deshabilitado mientras se envía, y al terminar entra con sesión iniciada y ve la lista de tareas

#### Scenario: Nombre en blanco

- **WHEN** la persona deja el nombre vacío o solo con espacios y se registra
- **THEN** la cuenta se crea sin nombre y el perfil muestra "Sin nombre"

#### Scenario: Contraseñas distintas

- **WHEN** la persona pulsa "Crear cuenta" con la contraseña y su repetición diferentes
- **THEN** ve "Las contraseñas no coinciden." bajo el campo "Repite la contraseña", y no se envía ninguna petición al servidor

#### Scenario: Email ya registrado

- **WHEN** la persona se registra con un email que ya tiene cuenta
- **THEN** ve "Ese email ya está registrado. Inicia sesión en su lugar." bajo el campo "Email"

#### Scenario: Otros errores de validación

- **WHEN** el servidor rechaza un campo visible, por ejemplo una contraseña de menos de 8 caracteres
- **THEN** ve el mensaje en castellano bajo ese campo, por ejemplo "la contraseña debe tener al menos 8 caracteres.", y no ve además el aviso general en la parte superior del formulario

#### Scenario: Ayuda sobre la contraseña

- **WHEN** el campo "Contraseña" no tiene error
- **THEN** ve bajo él el texto "Entre 8 y 32 caracteres."

### Requirement: Pantalla de inicio de sesión

La aplicación SHALL ofrecer una pantalla "Inicia sesión" con los campos "Email" y "Contraseña", el botón "Entrar" y un enlace "Crea una" hacia el registro.

#### Scenario: Acceso correcto

- **WHEN** la persona introduce credenciales correctas y pulsa "Entrar"
- **THEN** el botón muestra "Entrando…" y queda deshabilitado mientras se envía, y al terminar ve la lista de tareas

#### Scenario: Credenciales incorrectas

- **WHEN** la persona introduce un email o una contraseña que no corresponden a ninguna cuenta
- **THEN** ve en un aviso en la parte superior "El email o la contraseña no son correctos.", y permanece en la pantalla de inicio de sesión con el botón de nuevo habilitado

#### Scenario: Email mal formado

- **WHEN** la persona introduce un email sin formato válido y pulsa "Entrar"
- **THEN** ve "Introduce una dirección de email válida." bajo el campo "Email"

#### Scenario: Servidor inaccesible

- **WHEN** la persona intenta entrar y el servidor no responde
- **THEN** ve el aviso "No se pudo conectar con el servidor. Comprueba que el backend está arrancado."

#### Scenario: Error inesperado del servidor

- **WHEN** el servidor responde con un fallo que no es de credenciales ni de validación
- **THEN** ve el aviso "Algo ha ido mal en el servidor. Inténtalo de nuevo en un momento."

### Requirement: Persistencia y restauración de la sesión

La aplicación SHALL mantener la sesión al recargar la página mientras el servidor siga reconociendo el token, y SHALL explicar en la pantalla de inicio de sesión por qué se perdió una sesión previa.

#### Scenario: Recarga con sesión válida

- **WHEN** una persona con sesión iniciada recarga la página
- **THEN** sigue en su perfil sin volver a introducir credenciales

#### Scenario: Sesión caducada o revocada

- **WHEN** la persona recarga la página y el servidor ya no reconoce su token
- **THEN** ve la pantalla de inicio de sesión con el aviso "Tu sesión ha caducado. Vuelve a iniciar sesión.", y al recargar de nuevo no se vuelve a intentar restaurar esa sesión

#### Scenario: Servidor caído al restaurar

- **WHEN** la persona recarga la página y el servidor no responde
- **THEN** ve la pantalla de inicio de sesión con un aviso que explica el fallo, y al recargar cuando el servidor vuelve, recupera su sesión sin introducir credenciales

#### Scenario: El aviso desaparece al entrar

- **WHEN** la persona ve un aviso de sesión perdida e inicia sesión correctamente
- **THEN** el aviso deja de mostrarse

### Requirement: Pantalla de perfil y cierre de sesión

La aplicación SHALL mostrar en el perfil las iniciales, el nombre, el email y la fecha de alta de la persona, y SHALL permitirle cerrar sesión.

#### Scenario: Datos del perfil

- **WHEN** una persona con sesión abre su perfil
- **THEN** ve un círculo con sus iniciales, su nombre completo (o "Sin nombre" si no tiene), su email y "Miembro desde" con su fecha de alta en formato largo en castellano, por ejemplo "7 de octubre de 2026"

#### Scenario: Cerrar sesión

- **WHEN** la persona pulsa "Cerrar sesión"
- **THEN** el botón muestra "Cerrando sesión…" y queda deshabilitado, y ve la pantalla de inicio de sesión sin ningún aviso de error, y al recargar la página sigue sin sesión

#### Scenario: Cerrar sesión con el servidor inaccesible

- **WHEN** la persona pulsa "Cerrar sesión" y el servidor no responde o ya no reconoce su token
- **THEN** la sesión se cierra igualmente en la pantalla y no se muestra ningún error
