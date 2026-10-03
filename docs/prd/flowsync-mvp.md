# PRD: FlowSync MVP

Documento de producto. Parte de `docs/prd/alcance-mvp.md`, que fija el alcance. No contiene diseño técnico: ni modelo de datos, ni endpoints, ni arquitectura.

Todo lo marcado como **[SUPUESTO]** es una decisión o dato no validado, a confirmar con el equipo.

## 1. Problema y contexto

En equipos remotos pequeños, la única forma de saber qué hace cada quien es preguntar: en la daily o por chat. Eso interrumpe a quien trabaja y no evita el trabajo duplicado.

- **Dolor:** la daily de sincronización y el «¿en qué estás?» constante por Slack o chat. Nadie ve el estado del equipo sin interrumpir a alguien.
- **Episodio real:** dos personas tocaron el mismo módulo la misma semana, porque una empezó sin que la otra lo supiera. Se perdieron dos días.
- **Qué resuelve este MVP:** la ronda de «¿en qué estás?», que hoy ocupa la mitad de los 15 minutos de la daily.
- **Qué no resuelve:** la parte de bloqueos de la daily. Esa parte sigue haciéndose y este MVP no la sustituye.
- **Estado actual del producto:** existen cuentas y acceso (registro, inicio y cierre de sesión, perfil propio). Todavía no existe ninguna funcionalidad de tareas.
- **Caso de estudio (no es un cliente real):** un equipo de 6 personas de producto SaaS, en 3 husos horarios, que hoy usa un gestor de tareas pesado y una daily de 15 minutos por videollamada.

## 2. Usuarios y jobs-to-be-done

**Usuario:** integrante de un equipo remoto de 3 a 10 personas, con roles planos. Quien cobra el valor son los pares, no un lead: no hay reporte hacia arriba.

**Jobs-to-be-done**

| Cuando… | Quiero… | Para… |
|---|---|---|
| Voy a empezar algo | saber si otra persona ya lo está tocando | no duplicar trabajo |
| Termino una tarea y elijo la siguiente | ver qué está libre | decidir sin preguntar a nadie |
| Llego por la mañana o vuelvo de una reunión | ver qué se ha movido | ponerme al día sin interrumpir a otros |
| Estoy trabajando en algo | declarar que está en curso en segundos | dejar de recibir «¿cómo vas?» |
| Reviso mi trabajo | ver mis tareas y cuáles se pasaron de plazo | priorizar sin una reunión |

**Fuera del perfil de usuario:** equipos que necesiten sprints, estimaciones o reportes hacia arriba. No son el usuario de FlowSync.

## 3. Propuesta de valor

Una lista de tareas compartida donde **«en curso» se ve sin preguntar**. Así nadie empieza algo que otra persona ya está tocando, y cada quien elige lo siguiente sabiendo qué está libre.

- **Decisión que cambia:** no empezar lo que ya está en curso y elegir lo siguiente sabiendo qué está libre. Si el único resultado fuera «sentirse informado», no valdría la pena.
- **Menos rollo que Jira:** crear una tarea y cambiarle el estado en segundos, sin configuración.
- **Frescura, no presencia:** el estado es de la **tarea**, no de la persona. Es un resumen que espera, no un aviso que interrumpe.
- **Por qué se mantiene al día:** quien actualiza cobra en el momento. La lista es su propia cola de trabajo y, al mantenerla, deja de recibir preguntas.
- **Dónde vive el trabajo:** FlowSync sustituye al gestor de tareas actual, no convive con él. Crea sus propias tareas y no lee las de otro sitio.

## 4. Alcance / Fuera de alcance

### Alcance

Una sola vertical fina, usable de punta a punta:

1. Espacio único compartido: todas las personas con cuenta ven y editan lo mismo.
2. Tareas con título y responsable obligatorios, y fecha de vencimiento opcional.
3. Tres estados fijos y no configurables: pendiente, en curso y hecho.
4. Cambio de estado en dos clics sobre la lista ya abierta.
5. Filtro de la lista por estado.
6. Cambios de otras personas visibles sin recargar a mano, con una demora de pocos segundos.
7. Ver qué se ha movido desde la última visita.
8. Pruebas automatizadas incluidas en el trabajo.

### Fuera de alcance

| Se queda fuera | Por qué |
|---|---|
| Entidad «equipo» y varios equipos | El caso es un solo equipo; modelarlos añade pertenencia e invitaciones sin cambiar la decisión que se quiere habilitar. |
| Roles y permisos avanzados | Con 3 a 10 personas, todos editando lo mismo basta. |
| Estado «bloqueado» | Es la parte de la daily que se declaró no resuelta. |
| Estados configurables | Es el «rollo» de Jira que se quiere evitar. |
| Presencia e indicadores de actividad de personas | Es vigilancia y se rechaza a propósito. |
| Estado derivado de Git, PRs, CI o calendario | Es otro producto, con integraciones de terceros. |
| Convivir con otro gestor de tareas | Obliga a actualizar dos veces. |
| Notificaciones push e integración con Slack | El caso es «llego y veo qué se movió», sin interrumpir. |
| Sincronización en tiempo real estricta | Unos segundos de demora no cambian la decisión de no duplicar trabajo. |
| Comentarios, chat, videollamada y edición simultánea | Son conversación, no estado. |
| Analítica y reporting | No hay lead que consuma reportes. |
| Sprints, estimaciones, épicas y backlog priorizado | Quien los necesite no es el usuario. |

**Aún sin decidir, tratado como fuera de alcance [SUPUESTO]:** eliminar o archivar tareas, historial completo de cambios y varios responsables por tarea.

## 5. Épicas del MVP

- **E1 «Cuentas y acceso»:** registro, inicio y cierre de sesión, y perfil propio; garantiza que solo personas con cuenta entran al espacio compartido.
- **E2 «Gestión de tareas»:** crear, asignar, cambiar de estado, poner fecha y filtrar las tareas del equipo.
- **E3 «Actividad del equipo»:** ver los cambios de otras personas sin recargar y qué se ha movido desde la última visita, sin avisos.

## 6. Requisitos funcionales

### E1 Cuentas y acceso

- **RF-1.** Una persona puede crear una cuenta con su email, una contraseña y su nombre. *(Ya existe.)*
- **RF-2.** Una persona con cuenta puede iniciar y cerrar sesión. *(Ya existe.)*
- **RF-3.** Una persona con sesión iniciada puede ver su propio perfil. *(Ya existe.)*
- **RF-4.** Sin sesión iniciada, no se puede ver ni modificar ninguna tarea; la persona es llevada a iniciar sesión.
- **RF-5.** Toda persona con cuenta accede al mismo espacio compartido, sin invitación ni aprobación. **[SUPUESTO]** El registro abierto es aceptable para el caso de estudio; si el producto se expone públicamente, habrá que decidir cómo se restringe el acceso.

### E2 Gestión de tareas

- **RF-6.** Una persona puede crear una tarea indicando un título y un responsable. No se puede crear sin ambos.
- **RF-7.** El responsable es una única persona con cuenta, elegida entre las del espacio.
- **RF-8.** La fecha de vencimiento es opcional al crear y al editar la tarea.
- **RF-9.** Una tarea tiene exactamente uno de tres estados: pendiente, en curso o hecho. Toda tarea nueva empieza en pendiente.
- **RF-10.** Una persona puede cambiar el estado de una tarea desde la lista, en dos clics como máximo y sin abrir un formulario.
- **RF-11.** Cualquier persona del espacio puede cambiar el estado, el título, la fecha y el responsable de cualquier tarea. El sistema no lo impide; la convención es que lo hace quien trabaja la tarea. **[SUPUESTO]**
- **RF-12.** La lista muestra todas las tareas del espacio con su título, responsable, estado y fecha de vencimiento.
- **RF-13.** Una persona puede filtrar la lista por estado. Sin filtro, ve todas las tareas.
- **RF-14.** Una tarea con fecha de vencimiento pasada y estado distinto de «hecho» se muestra como vencida. Una tarea sin fecha nunca se muestra como vencida. **[SUPUESTO]** Una tarea «hecha» deja de contar como vencida.
- **RF-15.** El día de vencimiento se interpreta en la zona horaria de la persona que mira la lista, no en la de quien creó la tarea. **[SUPUESTO]**

### E3 Actividad del equipo

- **RF-16.** Cuando otra persona crea una tarea, cambia su estado o su responsable, quien tiene la lista abierta ve el cambio sin recargar la página a mano.
- **RF-17.** Al abrir FlowSync, la persona distingue de un vistazo las tareas que han cambiado desde la última vez que la visitó. **[SUPUESTO]** Basta con marcarlas en la lista; no hace falta una pantalla aparte.
- **RF-18.** Para cada tarea cambiada, la persona puede ver quién hizo el último cambio y cuándo.
- **RF-19.** La marca de «cambiado desde mi última visita» es privada: ninguna otra persona la ve.
- **RF-20.** FlowSync no envía notificaciones push, correos ni mensajes a otras herramientas.
- **RF-21.** FlowSync no muestra quién está conectado ni indicadores de actividad de las personas. Solo muestra el estado de las tareas.

## 7. Requisitos no funcionales

- **RNF-1. Frescura.** Un cambio hecho por una persona se ve en la lista de las demás en un máximo de 10 segundos. Una demora de 5 a 10 segundos es aceptable; no se exige tiempo real estricto.
- **RNF-2. Rapidez de uso.** Cambiar el estado de una tarea toma dos clics como máximo. Crear una tarea toma unos pocos segundos, sin campos adicionales a los obligatorios. **[SUPUESTO]** Objetivo: 15 segundos o menos.
- **RNF-3. Sin configuración.** Para empezar a usar FlowSync no se necesita configurar nada más allá de crear la cuenta.
- **RNF-4. Idioma.** Toda la interfaz y los mensajes de error están en castellano.
- **RNF-5. Uso en varios husos horarios.** Las fechas se muestran de forma coherente para personas en husos distintos.
- **RNF-6. Escala.** Funciona con equipos de 3 a 10 personas. **[SUPUESTO]** Se mantiene usable con unas 200 tareas en el espacio.
- **RNF-7. Plataforma.** Se usa desde un navegador de escritorio actual. **[SUPUESTO]** El uso en móvil no se prueba en el MVP.
- **RNF-8. Privacidad.** No se recoge ni se muestra ningún dato sobre la actividad o conexión de las personas, más allá del estado de las tareas.
- **RNF-9. Seguridad básica.** Las contraseñas no se muestran ni se devuelven en ninguna pantalla, y el acceso a las tareas exige sesión iniciada.
- **RNF-10. Calidad.** Cada requisito funcional nuevo llega con pruebas automatizadas que cubren su recorrido principal.

## 8. Restricciones

- **Stack actual:** el backend es AdonisJS 7 y el frontend es React 19. El MVP se construye sobre ese stack, sin cambiarlo.
- **Autenticación existente:** el registro, el inicio y cierre de sesión y el perfil ya funcionan. El MVP los reutiliza y no los rehace.
- **Sin base previa de tareas:** hoy no hay funcionalidad de tareas ni de actividad; la construimos desde cero.
- **Sin integraciones externas:** el MVP no lee ni escribe datos en otras herramientas.
- **Una sola vertical:** se prefiere una capacidad terminada de punta a punta antes que varias a medias.
- **Caso de estudio, no cliente real:** los resultados con ese equipo no demuestran todavía que el producto funcione en otros equipos.

## 9. Métricas de éxito

La validación se hace con el equipo del caso de estudio durante una semana de uso real. Todos los umbrales son **[SUPUESTO]** y se ajustan tras medir la línea base.

| Métrica | Cómo se mide | Objetivo |
|---|---|---|
| **M1. La ronda de «¿en qué estás?» se cancela** (métrica principal) | El equipo decide quitarla de la daily y, al cabo de una semana, nadie pide que vuelva | Sí. Si la siguen haciendo igual, no funcionó |
| **M2. Menos interrupciones** | Mensajes de «¿en qué estás?» o «¿cómo vas?» por chat, antes y después | Bajan respecto a la semana de línea base |
| **M3. Cero trabajo duplicado** | Casos en que dos personas hacen lo mismo sin saberlo, según el equipo | 0 casos en la semana de prueba |
| **M4. Información fresca** | Porcentaje de tareas «en curso» con algún cambio en los últimos 3 días | 80 % o más |
| **M5. Adopción** | Personas del equipo que cambian el estado de sus tareas al menos una vez en la semana | Todas |
| **M6. Esfuerzo de actualizar** | Clics necesarios para cambiar el estado, comprobado en una prueba manual | 2 o menos |

**Señales de fallo:** tareas «en curso» sin cambios durante días, personas que dejan de actualizar su estado, y preguntas por chat que siguen igual que antes. Si la información se queda vieja, el producto pierde el sentido: es el riesgo principal a validar.

**Lo que la métrica M1 no mide:** la parte de bloqueos de la daily sigue existiendo. Que la daily se mantenga por ese motivo no cuenta como fallo.
