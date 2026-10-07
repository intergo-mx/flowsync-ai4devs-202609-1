# Design

## Context

Ver `proposal.md` para el porqué. Ya existen la tabla `tasks`, el modelo `Task`, el `TaskTransformer` (que hoy no expone fechas), el `TasksController` con `index`, `store` y `update`, y la página `/tasks` con rutas protegidas y cliente de API único. El esquema se genera desde las migraciones. Este change no incluye tests.

**Zona horaria.** La fecha de vencimiento es de calendario: no lleva hora ni huso y se guarda tal cual la eligió la persona. El huso solo importa al decidir si está vencida, y ahí lo que cuenta es el día de quien mira. Por eso el cliente manda su día local en `today` y el servidor decide; no se guarda ningún instante ni se convierte ninguna hora. Sin `today`, el servidor usa el día actual en UTC.

## Goals / Non-Goals

**Goals:**
- Una única implementación de la regla de vencimiento, en el servidor.
- Veredicto calculado al leer, correcto para cada huso y sin procesos que marquen tareas.

**Non-Goals:**
- Pantalla de detalle completa, mostrar fechas en la lista, ordenar o filtrar por fecha, notificaciones.
- Cambiar las columnas de creación y modificación ni exponerlas.

## Decisions

**Columna `due_date`.** Tipo `date`, anulable, sin valor por defecto: las tareas anteriores quedan válidas sin fecha. Su reverso elimina la columna. No existe ninguna columna de vencimiento. El esquema generado y `.adonisjs/` se regeneran con los comandos del proyecto.

**Regla en el modelo.** `Task` expone un único método, `isOverdueOn(today)`, con `today` como fecha de calendario `YYYY-MM-DD`: verdadero si hay fecha, la fecha es estrictamente anterior a `today` y el estado no es `done`. Se comparan cadenas ISO de calendario, nunca instantes, lo que evita el error del día de más en el borde (hoy no vence) y cualquier conversión de huso. Ninguna otra capa reimplementa la regla; el transformer solo la llama. Alternativa descartada: columna o campo calculado en base de datos, que contradice «no se persiste».

**Día de referencia.** Un validador de consulta con `today` opcional en formato `YYYY-MM-DD` y fecha real; inválido da 422 con campo `today`. Sin él se toma la fecha UTC actual. El mismo día de referencia se usa en `index`, `show`, `store` y `update`, porque todas devuelven la representación de la tarea. Alternativas descartadas:
- Cabecera propia: funcionaría igual (la configuración de CORS ya admite cualquier cabecera y `Authorization` ya provoca preflight); se prefiere el parámetro de consulta porque es visible en la URL y trivial de probar con `curl`.
- Día UTC del servidor, sin parámetro: es lo más simple y cumple que decida el servidor, pero las personas de husos distintos recibirían el mismo veredicto, y una tarea con fecha de hoy se vería vencida durante horas antes de que termine el día de quien la mira. Rompe los escenarios «Dos personas en husos distintos», «Vence sola con el paso del día» y «Día de la persona».
- Huso horario guardado en la cuenta de cada persona: obliga a tocar registro y perfil, es decir, la capability `auth`, que este change no modifica, y falla con quien viaja o usa dos dispositivos. Contradice el escenario «Día de la persona», que fija el día del dispositivo.
- Que el frontend resuelva el veredicto: dejaría sin comprobación por HTTP todos los escenarios de «Regla de vencimiento» y contradice «Señal de tarea vencida», que toma el veredicto del servidor.

El coste asumido es que el servidor confía en el día que declara el cliente: un dispositivo con la fecha mal obtiene otro veredicto.

**Transformer.** `TaskTransformer` recibe el día de referencia como segundo argumento y devuelve `dueDate` (`YYYY-MM-DD` o `null`) e `isOverdue`. Las columnas de creación y modificación siguen sin exponerse.

**Validadores.** Creación: `title` como hoy y `dueDate` opcional y anulable, fecha de calendario válida; todo lo demás se descarta, incluido `isOverdue`. Actualización: `dueDate` opcional y anulable; ausente deja la fecha como estaba, `null` o cadena vacía la quita. No se rechaza ninguna fecha por ser pasada. En el controlador solo se asignan los campos recibidos, como ya se hace con `status` y `assigneeId`, para no pisar con `undefined`.

**Lectura individual.** `show` con `findOrFail` y la ruta `GET /api/v1/tasks/:id` dentro del grupo con `auth`. Es la superficie mínima para «abrir la tarea». Punto abierto: la forma de la pantalla de detalle completa queda para otro change.

**Frontend.**
- `lib/types.ts`: `Task` gana `dueDate: string | null` e `isOverdue: boolean`.
- `lib/api.ts`: `getTask(token, id, today)` y `updateTask` admite `dueDate`; el día se manda en `?today=`. El día local se obtiene de los componentes de fecha del dispositivo, nunca de `toISOString()`, que da el día UTC. `getTasks` no envía `today` porque la lista no usa estos datos; `updateTask` sí lo envía siempre, también al cambiar el estado desde la lista, lo que es inocuo.
- `pages/task-detail-page.tsx`: carga la tarea, muestra título, un `<input type="date">` con `Label`, el botón «Quitar fecha» (variante `outline`) y un `Alert` con texto «Vencida» e icono cuando `isOverdue`. Un 404 muestra el mensaje y un enlace a la lista.
- Guardado al instante: el cambio del campo envía la fecha si es completa y válida; si el navegador marca el valor como incompleto o inválido, se avisa junto al campo con `FieldError` y no se envía nada, de modo que se conserva la fecha previa. Un error de validación del servidor se muestra con el mismo mecanismo (`useAuthForm`/`ApiError.fieldErrors`). El estado local solo cambia con la respuesta del servidor, que también trae el nuevo `isOverdue`.
- Accesibilidad: el aviso lleva texto además de color, y el campo y el botón son nativos, por lo que se operan con teclado.
- Rutas: `/tasks/:id` bajo `ProtectedRoute`. En la lista, el título pasa a un `Link` hacia ella; no se añade ninguna fecha ni marca.
- Sin componentes nuevos de shadcn ni dependencias: se evita un selector de fecha de terceros y se usa el campo nativo.

## Risks / Trade-offs

- [El día lo declara el cliente: un dispositivo con fecha errónea ve un veredicto errado] → es coherente con «el día de referencia es el de quien mira»; el servidor valida solo el formato.
- [`today` ausente cae en UTC y puede discrepar del día local] → la interfaz siempre lo envía; solo afecta a clientes de API que no lo envíen.
- [El campo nativo de fecha varía entre navegadores] → se acepta por no añadir dependencia; el aviso de fecha incompleta cubre el caso común.
- [Guardar al cambiar puede lanzar peticiones seguidas] → cada respuesta reemplaza el estado; el último cambio gana. Condición de carrera completa queda en PA-8.
- [Volver de `done` con fecha pasada reaviva el vencimiento] → consecuencia directa de la regla; ligado a PA-7.
- [`openspec/config.yaml` describe otro proyecto (AdonisJS 6, PostgreSQL, reservas de salas) y su regla de cerrar cada capa con tests] → no se usa como contexto ni se sigue esa regla, por la restricción de no tener tests.

## Migration Plan

La migración añade una columna anulable, así que se aplica sobre la base existente sin tocar filas. Reversible con `migration:rollback`, que elimina la columna. La base de desarrollo es la misma que la de pruebas: migrar afecta también al estado local.
