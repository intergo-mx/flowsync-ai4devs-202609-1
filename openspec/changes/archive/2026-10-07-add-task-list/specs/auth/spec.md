# Spec Delta

## MODIFIED Requirements

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
