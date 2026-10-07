# Tasks

Sin tests en este change, por decisión expresa. La verificación de cada capa se hace con typecheck, lint, build y comprobación manual contra la API o la pantalla.

## 1. Backend: datos

- [x] 1.1 Crear la migración `tasks` (id, title 255, status con valor por defecto `pending`, assignee_id FK a users, marcas de tiempo) y verificar que `node ace migration:run` termina sin error y regenera `database/schema.ts`
- [x] 1.2 Crear el modelo `Task` con la relación `assignee` hacia `User` y la definición única de los tres estados, y verificar que `npm run typecheck` pasa

## 2. Backend: API

- [x] 2.1 Crear los validadores de creación (solo `title`: trim, 1 a 255) y de actualización (`status` enum cerrado, `assigneeId` existente), y verificar con `npm run typecheck`
- [x] 2.2 Crear `TaskTransformer` que expone `id`, `title`, `status` y `assignee.fullName` sin correo, id de usuario ni fechas, y verificar que compila
- [x] 2.3 Crear `TasksController` con `index` (sin `orderBy`, con responsable precargado), `store` (responsable = quien crea, estado `pending`) y `update` (404 si no existe), y verificar que compila
- [x] 2.4 Registrar `GET/POST /api/v1/tasks` y `PATCH /api/v1/tasks/:id` bajo `middleware.auth()` y verificar con `node ace list:routes` que existen exactamente esas tres rutas de tareas
- [x] 2.5 Comprobar con `curl` los escenarios de la spec delta de `tasks` (401 sin token, crear, título en blanco y de 256 caracteres, estado inválido, responsable inexistente, 404, lista vacía) y anotar el resultado en el PR
- [x] 2.6 Ejecutar `npm run lint`, `npm run format` y `npm run typecheck` en `backend/` y verificar que no dan errores; commitear el diff regenerado de `.adonisjs/`

## 3. Frontend: cliente y rutas

- [x] 3.1 Añadir los tipos `Task` y `TaskStatus` (`pending`, `in_progress`, `done`) en `lib/types.ts` y el mapa de etiquetas Pendiente / En curso / Hecho, y verificar con `npm run build`
- [x] 3.2 Añadir `getTasks`, `createTask` y `updateTask` en `lib/api.ts` (con soporte `PATCH`, la etiqueta del campo `title` y los casos de regla nuevos), y verificar con `npm run build`
- [ ] 3.3 Registrar `/tasks` bajo `ProtectedRoute` y cambiar a `/tasks` la redirección de `PublicOnlyRoute` y de la ruta comodín, y verificar manualmente que sin sesión `/tasks` lleva al login y con sesión el login lleva a `/tasks`

## 4. Frontend: pantalla

- [ ] 4.1 Crear `pages/tasks-page.tsx` con carga de la lista, estado vacío explicativo y filas con título, responsable (`Sin nombre` si no tiene) y estado en castellano, y verificar manualmente que no aparecen fechas, correos ni ids
- [ ] 4.2 Añadir el formulario de un solo campo (título) con aviso junto al campo para vacío, en blanco y más de 255 caracteres, y verificar manualmente que la tarea nueva aparece sin recargar, como Pendiente y a nombre de quien la crea
- [ ] 4.3 Añadir en cada fila el control de tres botones para cambiar el estado, con aviso si falla y sin diálogo de confirmación, y verificar manualmente que cambia una tarea propia y una ajena
- [ ] 4.4 Añadir los enlaces entre `/tasks` y `/profile` y verificar manualmente la navegación en ambos sentidos y el cierre de sesión
- [x] 4.5 Ejecutar `npm run lint`, `npm run format` y `npm run build` en `frontend/` y verificar que no dan errores

## Workflow follow-up

- Integrar antes la spec `auth` del repositorio, de la que depende el delta de `auth` de este change.
- Archivar el change tras la revisión del PR.
