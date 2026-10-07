# Design

## Context

Ver `proposal.md` para el porqué. Hoy el backend solo tiene cuentas y tokens de acceso (`users`, `auth_access_tokens`), y el frontend tiene login, registro y perfil con rutas protegidas. El esquema de base de datos se genera desde las migraciones y los modelos no declaran columnas. Toda respuesta pasa por `serialize()` y por un transformer. Este change no incluye base de tests.

No toca horarios: la tarea no expone fechas ni la pantalla las pinta, así que no hay decisión de zona horaria. Las marcas de tiempo que Lucid mantiene (`created_at`, `updated_at`) existen solo en base de datos.

## Goals / Non-Goals

**Goals:**
- Tres operaciones sobre un único recurso `tasks`, todas tras el guard de acceso que ya existe.
- Una pantalla de lista que reutiliza los componentes y el patrón de páginas y rutas del login.

**Non-Goals:**
- Orden, agrupación, filtros, paginación, tiempo real, borrado, lectura individual, fecha de vencimiento, edición del título.
- Componentes nuevos de shadcn ni dependencias nuevas.

## Decisions

**Tabla `tasks`.** Columnas: `id`, `title` (string, 255), `status` (string, por defecto `pending`), `assignee_id` (FK a `users`, no nula) y las marcas de tiempo estándar. El estado se guarda como texto y el conjunto cerrado lo impone la validación de la API, no una restricción de base de datos. Alternativa descartada: columna enum o CHECK, porque SQLite la emula mal y duplicaría la fuente de verdad. La lista de tres valores vive en un único sitio del backend y de ella salen el validador y el valor por defecto.

**Rutas.** Un grupo `/api/v1/tasks` con `GET /`, `POST /` y `PATCH /:id`, bajo `middleware.auth()`, siguiendo el estilo del grupo `account`. `PATCH` y no `PUT` porque se envían solo los campos que cambian. No se declara ninguna otra ruta, así que leer o borrar una tarea cae en el 404 del router.

**Validación (VineJS).** Creación: `title` con `trim`, mínimo 1 y máximo 255; todo campo que no sea `title` se descarta, lo que da el comportamiento «se ignora cualquier otro dato». Actualización: `status` opcional como enum cerrado y `assigneeId` opcional que debe existir en `users`; `title` no se acepta. Una tarea inexistente da 404 vía `findOrFail`. Al aplicar, comprobar qué regla concreta devuelve VineJS para un título en blanco (`required` o `minLength`) y ajustar el escenario si hace falta.

**Qué se expone.** Un `TaskTransformer` devuelve `id`, `title`, `status` y `assignee: { fullName }`. Se precarga el responsable y nunca se serializa el modelo de usuario entero, para no filtrar correo, id ni datos de cuenta a una vista que solo necesita el nombre. Consecuencia asumida: `assigneeId` solo se acepta como entrada; como no hay endpoint de equipo, quien llama a la API solo conoce su propio id (por `GET /account/profile`).

**Sin orden.** La consulta de la lista no lleva `orderBy`. El orden resultante es el de la base de datos y no es un contrato (punto abierto del proposal). En la pantalla no se reordena en cliente: la tarea nueva se añade al estado local como la devuelve la API.

**Frontend.**
- `lib/types.ts`: tipo `Task` y el tipo unión `TaskStatus` con los tres valores en inglés; el mapa de etiquetas (`pending` → Pendiente, etc.) vive en la capa de presentación. Los valores en castellano no se usan nunca como identificadores.
- `lib/api.ts`: `getTasks`, `createTask` y `updateTask(id, patch)`, ampliando `request` para admitir `PATCH` y añadiendo a `translate` los casos de regla que aparezcan (`enum`, `exists`) y el campo `title` en `FIELD_LABELS`.
- `pages/tasks-page.tsx`: carga la lista al montar, estado vacío, formulario de un campo, filas con título, responsable (`fullName ?? 'Sin nombre'`) y estado.
- Control de estado en la fila: tres `Button` del sistema (rellena la actual, `outline` el resto, con `aria-pressed`). Un clic cambia el estado sin diálogos. Alternativa descartada: `select` de shadcn, porque exige añadir el componente y una dependencia de Radix.
- Cambio de estado: la fila refleja el nuevo valor al responder la API; si falla, conserva el anterior y se muestra un aviso. No hay actualización optimista.
- Rutas: `/tasks` bajo `ProtectedRoute`; `PublicOnlyRoute` y la ruta comodín redirigen a `/tasks`; enlaces entre la lista y `/profile`.

## Risks / Trade-offs

- [El orden de la lista no está definido] → queda como punto abierto en el proposal; no se ordena para no fijar un contrato implícito.
- [Cambiar a «Hecho» por error es muy barato (PA-7)] → se permiten todas las transiciones y no se pide confirmación, según la historia; se revisará con PA-7.
- [Lista sin paginar] → aceptable en el volumen del MVP; se revisará si crece.
- [`assigneeId` sin forma de descubrir ids] → el cambio de responsable queda casi solo para uso programático; asumido por la restricción de no tener endpoints de equipo.
- [La spec `auth` del repo vive en otra rama] → el delta de `auth` de este change presupone que esa spec ya está integrada antes de archivar.
- [`openspec/config.yaml` describe otro proyecto (AdonisJS 6, PostgreSQL, reservas de salas)] → no se usa como contexto de este change; conviene corregirlo aparte.
