# Tasks

Sin tests en este change, por decisión expresa. La verificación de cada capa se hace con typecheck, lint, build y comprobación manual contra la API o la pantalla.

## 1. Backend: datos y regla

- [x] 1.1 Crear la migración que añade `due_date` (tipo fecha, anulable) a `tasks`, con reverso que la elimina, y verificar que `node ace migration:run` pasa sobre la base con tareas, que las tareas existentes siguen con fecha `null` y que `database/schema.ts` se regenera sin editarlo
- [x] 1.2 Añadir al modelo `Task` el método `isOverdueOn(today)` con la regla (fecha presente, estrictamente anterior a `today` y estado distinto de `done`, comparando fechas de calendario ISO) y verificar con `npm run typecheck` y, en 2.5, con los casos de borde: ayer, hoy, mañana, sin fecha y `done`

## 2. Backend: API

- [x] 2.1 Ampliar los validadores: `dueDate` opcional y anulable (fecha de calendario real; `""` y `null` la quitan; las pasadas se aceptan) en creación y actualización, y un validador del parámetro `today` (`YYYY-MM-DD` real y opcional); `isOverdue` y cualquier otro campo se descartan; verificar con `npm run typecheck`
- [x] 2.2 Ampliar `TaskTransformer` con `dueDate` e `isOverdue` calculado con el día de referencia recibido, sin exponer las marcas de creación ni de modificación, y verificar que compila
- [x] 2.3 Actualizar `TasksController`: `index`, `store` y `update` devuelven la representación con el día de referencia (`today` o UTC si falta), `update` asigna solo los campos recibidos, y añadir `show` con 404 si no existe; verificar con `npm run typecheck`
- [x] 2.4 Registrar `GET /api/v1/tasks/:id` bajo `middleware.auth()` y verificar con `node ace list:routes` que las rutas de tareas son exactamente listar, leer, crear y actualizar
- [x] 2.5 Comprobar con `curl` (haciendo copia de la base antes y limpiando los datos de prueba al acabar) los escenarios de la spec delta: fecha puesta, cambiada y quitada con `null` y con `""`; fecha pasada aceptada al crear y al actualizar; fecha imposible e incompleta en 422; `isOverdue` enviado e ignorado; `today` distintos para la misma tarea; hoy no vence; `done` no vence; volver desde `done` revive; `today` inválido en 422; `GET /:id` con 200, 404 y 401; y que cambiar estado, responsable o título no altera la fecha
- [x] 2.6 Ejecutar `npm run lint` y `npm run typecheck` en `backend/` y verificar que no dan errores; formatear solo los archivos tocados y commitear el diff regenerado de `.adonisjs/` y `database/schema.ts`

## 3. Frontend: cliente y rutas

- [x] 3.1 Ampliar `Task` en `lib/types.ts` con `dueDate` e `isOverdue`, y verificar con `npm run build`
- [x] 3.2 Añadir en `lib/api.ts` `getTask` y la actualización de `dueDate` (con `today` en la consulta, calculado con el día local del dispositivo y no con UTC), con el título de campo `dueDate` en las etiquetas de error, y verificar con `npm run build`
- [x] 3.3 Registrar `/tasks/:id` bajo `ProtectedRoute` y hacer que el título de cada fila de la lista sea un enlace a ella sin añadir fecha ni marca, y verificar manualmente que sin sesión `/tasks/:id` lleva al login y que la lista sigue sin mostrar fechas

## 4. Frontend: página de la tarea

- [x] 4.1 Crear `pages/task-detail-page.tsx` con carga de la tarea, título, campo de fecha, mensaje de tarea no encontrada con enlace de vuelta a la lista, y verificar manualmente que una tarea sin fecha no muestra aviso alguno
- [ ] 4.2 Añadir el guardado inmediato de la fecha, el botón «Quitar fecha» sin confirmación y el aviso junto al campo para fecha incompleta o inválida conservando la anterior, y verificar manualmente poner, cambiar, quitar y fecha incompleta
- [x] 4.3 Añadir el aviso «Vencida» con icono y texto tomando `isOverdue` del servidor, y verificar manualmente fecha de ayer (vencida), de hoy (no), futura (no), tarea en Hecho (no) y que aplazar o quitar la fecha lo retira
- [x] 4.4 Ejecutar `npm run lint` y `npm run build` en `frontend/`, formatear solo los archivos tocados, y verificar que no dan errores

## Workflow follow-up

- Abrir el PR de este change contra la rama correcta y pasar la revisión adversarial.
- Archivar el change tras la revisión del PR.
