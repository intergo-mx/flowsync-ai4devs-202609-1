# Proposal

## Why

FlowSync todavía no tiene el recurso central del producto: las tareas. Sin una lista compartida, nadie del equipo puede ver en qué anda cada persona ni apuntar su propio trabajo en segundos. Es el sustrato sobre el que se apoyarán después los filtros, los vencimientos y las actualizaciones en vivo (historias E3-1, E2-1, E2-2, E2-3 y E2-4 del backlog).

## What Changes

- Nueva API de tareas con exactamente tres operaciones: listar todas, crear una y actualizarla. Todas exigen sesión iniciada.
- Una tarea tiene título, estado y responsable. El estado es un conjunto cerrado de tres valores, `pending`, `in_progress` y `done`, que la interfaz pinta como Pendiente, En curso y Hecho; cualquier otro valor se rechaza con 422.
- Al crear solo se pide el título (obligatorio, sin contar espacios en blanco, máximo 255 caracteres). La tarea nace en `pending` y con quien la crea como responsable.
- La actualización permite cambiar el estado y el responsable de cualquier tarea, sea de quien sea.
- La lista devuelve del responsable únicamente su nombre, nunca su correo ni su id de cuenta.
- Nueva pantalla de lista compartida en `/tasks`, con formulario de un solo campo, estado vacío, y cambio de estado desde la propia fila. Pasa a ser la pantalla principal tras iniciar sesión; el perfil sigue en `/profile` con enlace desde la lista.
- Se reutilizan los componentes de `frontend/src/components/ui/` y el patrón de páginas, rutas protegidas y cliente de API que ya usa el login. Sin dependencias nuevas.

## Capabilities

### New Capabilities
- `tasks`: lista compartida de tareas del equipo, su creación con solo el título, el responsable y estado por defecto, y el cambio de estado.

### Modified Capabilities

- `auth`: al iniciar sesión, registrarse, abrir login/registro con sesión o abrir una dirección desconocida, la persona llega a la lista de tareas en vez de al perfil. Se modifican tres requisitos (protección de pantallas, registro e inicio de sesión); el resto de `auth` no cambia.

## Puntos abiertos

- **Orden de la lista (PA-3).** No hay regla decidida, ni tampoco agrupar por persona. Este change no ordena de forma explícita ni inventa criterio: la lista sale en el orden en que la entrega la base de datos, que no es un contrato. Hay que decidirlo antes de dar la historia E3-1 por completa, porque CA-5 (enumerar el trabajo de cada persona) depende de ello.
- **Longitud máxima del título (PA-9).** Se fija 255 como límite técnico provisional; el umbral de producto sigue sin decidir.
- **Transiciones de estado legales (PA-7).** Se permite pasar de cualquier estado a cualquier otro, incluido volver atrás desde Hecho. Sin decidir.
- **Pérdida o cambio de manos de una tarea abierta (PA-8)** y **tope de tareas En curso por persona (PA-4).** Fuera de este change.

## Fuera de alcance

- Fecha de vencimiento: ni en la tarea, ni en la API, ni en la lista, ni marcas de vencida. Tampoco se deja preparada.
- Lectura individual de una tarea, borrado de tareas y endpoints de equipo o de usuarios.
- Cambiar el responsable desde la interfaz: solo lo admite la API, porque sin endpoint de equipo no hay de dónde poblar un selector.
- Vista «mis tareas», tareas privadas, roles o permisos por tarea.
- Orden, agrupación, filtros y paginación de la lista.
- Refresco automático ante cambios de otras personas (E3-2) y señales de presencia.
- Tests y base de pruebas: este change no los incluye por decisión expresa.

## Impact

- `backend/`: nueva migración, modelo, validadores, transformer, controlador y rutas bajo `/api/v1/tasks`; `database/schema.ts` y `.adonisjs/` se regeneran.
- `frontend/`: nueva página de tareas, funciones nuevas en `lib/api.ts`, tipos en `lib/types.ts`, ruta protegida y cambio de la redirección por defecto.
- Sin dependencias nuevas. Sin cambios en `auth`.
