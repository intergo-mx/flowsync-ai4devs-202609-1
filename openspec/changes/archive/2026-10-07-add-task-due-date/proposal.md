# Proposal

## Why

Hoy una tarea no puede comprometerse con una fecha, así que nadie descubre que algo se pasó de plazo hasta que pregunta. La historia FS-118 (RF-13, RF-14 y RF-15) pide poner, cambiar y quitar una fecha de vencimiento y ver si la tarea está vencida, sin ensuciar la lista ni penalizar a quien no pone fecha.

## What Changes

- La tarea gana una fecha de vencimiento de calendario, sin hora (`dueDate`, `YYYY-MM-DD`, opcional). Se puede poner al crear y al actualizar, cambiar y quitar; quitarla es enviarla explícitamente vacía. Una fecha anterior a hoy se acepta y la tarea nace vencida.
- La representación de una tarea añade `dueDate` y `isOverdue`. El servidor decide el veredicto: vencida si tiene fecha, la fecha es anterior al día de referencia y el estado no es `done`. Vencer hoy todavía no es estar vencida.
- `isOverdue` no se guarda en ninguna columna ni lo marca ningún proceso: se calcula en cada lectura. Si el cliente lo envía, se ignora.
- El día de referencia lo aporta el cliente con el parámetro de consulta `today` (`YYYY-MM-DD`, su día local) para respetar el huso de cada persona; sin él se usa el día actual en UTC.
- Nueva lectura individual `GET /api/v1/tasks/:id`, la superficie mínima que necesita "abrir la tarea" de la historia. El borrado y los endpoints de equipo siguen sin existir.
- Nueva página mínima `/tasks/:id`, a la que se llega pulsando el título de una fila: muestra el título, un campo de fecha que se guarda al instante, un botón "Quitar fecha" y el aviso "Vencida" cuando corresponde. Reutiliza los componentes de `components/ui/` y el patrón de páginas y rutas existente; sin dependencias nuevas.
- La lista no cambia lo que muestra: título, responsable y estado, sin fecha ni marca de vencida. Solo el título pasa a ser un enlace.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities
- `tasks`: se añaden la fecha de vencimiento, la regla de vencimiento, el día de referencia, la lectura individual y la página de la tarea; se modifican cuatro requisitos (datos que expone cada tarea, creación, actualización y superficie de la API) porque ya no es cierto que la tarea no exponga fechas ni que no exista lectura individual.

## Decisiones y puntos abiertos

- **Lectura individual.** Se añade `GET /api/v1/tasks/:id` por ser lo mínimo que la historia necesita para "abrir la tarea". Punto abierto: la pantalla de detalle completa (estado, responsable y resto de ediciones) está fuera de este change y su forma depende de PA-6 del PRD.
- **Volver de «Hecho» (PA-7).** Con la regla actual, una tarea en `done` con la fecha pasada que vuelve a `pending` pasa a estar vencida. Es la consecuencia directa de la regla y queda especificada, pero PA-7 sigue sin decidir si ese camino de vuelta debe existir.
- **Dos personas cambiando la fecha a la vez (PA-8).** Gana el último cambio; sin decidir qué ve quien pierde.
- **CA-4 sigue marcado como propuesto** en la historia. La señal de vencida se construye antes de que se valide; si cambia, se rehace.

## Fuera de alcance

- Notificaciones, recordatorios, avisos de que falta la fecha y recurrencia.
- Ordenar o filtrar por fecha o por vencimiento.
- Mostrar fecha o marca de vencida en la lista.
- La pantalla de detalle completa: cambiar el estado, el responsable u otros campos desde `/tasks/:id`.
- Borrado de tareas y endpoints de equipo.
- Tests de cualquier tipo.

## Impact

- `backend/`: nueva migración (`due_date` anulable) que respeta las tareas existentes; modelo con la regla de vencimiento; validadores de creación y actualización; transformer con `dueDate` e `isOverdue`; `show` en el controlador y ruta `GET /api/v1/tasks/:id`. `database/schema.ts` y `.adonisjs/` se regeneran.
- `frontend/`: tipos y funciones de `lib/api.ts` (lectura de una tarea y actualización de la fecha), página `/tasks/:id`, ruta protegida y título de fila como enlace.
- Cambia la spec `tasks`. Sin dependencias nuevas y sin cambios en `auth`.
