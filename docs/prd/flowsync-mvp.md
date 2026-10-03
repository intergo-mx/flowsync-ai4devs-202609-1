# PRD: FlowSync MVP

Documento de producto. Parte de `docs/prd/alcance-mvp.md`, que fija el alcance inicial. Describe qué necesita la persona usuaria, no cómo se implementa.

**Precedencia:** donde este PRD amplía o concreta `alcance-mvp.md`, manda este PRD. Las ampliaciones están listadas y aprobadas en la sección 4.

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

**Cuándo mirar la lista:** FlowSync no avisa, así que el hábito que sostiene el producto es mirar la lista **antes de empezar una tarea** y al llegar o volver de una reunión. Esa convención se acuerda con el equipo; el producto no la impone. **[SUPUESTO]**

## 3. Propuesta de valor

Una lista de tareas compartida donde **«en curso» se ve sin preguntar**. Así nadie empieza algo que otra persona ya está tocando, y cada quien elige lo siguiente sabiendo qué está libre.

- **Decisión que cambia:** no empezar lo que ya está en curso y elegir lo siguiente sabiendo qué está libre. Si el único resultado fuera «sentirse informado», no valdría la pena.
- **Menos rollo que Jira:** crear una tarea y cambiarle el estado en segundos, sin configuración.
- **Frescura, no presencia:** el estado es de la **tarea**, no de la persona. Es un resumen que espera, no un aviso que interrumpe.
- **Por qué se mantiene al día:** quien actualiza cobra en el momento. La lista es su propia cola de trabajo y, al mantenerla, deja de recibir preguntas.
- **Dónde vive el trabajo:** la intención es que FlowSync sea el lugar donde se ve el estado del trabajo, pero **este MVP no puede sustituir al gestor de tareas actual**. Una tarea solo tiene título, responsable, estado y fecha, sin descripción ni comentarios, y no hay migración de las tareas existentes: el equipo parte de una lista vacía. FlowSync crea sus propias tareas y no lee las de otro sitio.
  - **Consecuencia que se declara tal cual:** mientras el equipo conserve su gestor para el detalle del trabajo, tendrá que actualizar el estado en dos sitios. Ese es el riesgo de información vieja descrito en §9. El MVP no incluye ninguna mitigación para ello; solo se detecta a posteriori mediante M4.
  - **Si el equipo no puede asumir esa doble actualización, este MVP no es adecuado para él.** Sustituir al gestor actual no es una promesa de este MVP.
- **Alcance de la promesa:** una tarea es más fina que un módulo. FlowSync evita que dos personas tomen *la misma tarea* sin saberlo; que las tareas estén bien partidas depende del equipo. **[SUPUESTO]**

## 4. Alcance / Fuera de alcance

### Alcance

Una sola vertical fina, usable de punta a punta:

1. Espacio único compartido: todas las personas con cuenta ven y editan lo mismo.
2. Tareas con título y responsable obligatorios, y fecha de vencimiento opcional.
3. Tres estados fijos y no configurables: pendiente, en curso y hecho.
4. Cambio de estado en dos clics sobre la lista ya abierta.
5. Filtro de la lista por estado.
6. Cambios de otras personas visibles sin recargar a mano, en el plazo de RNF-1.
7. Ver qué se ha movido desde la última visita.
8. Cada requisito se entrega verificado contra su criterio de aceptación.

### Ampliaciones aprobadas sobre `alcance-mvp.md`

Este PRD incorpora, con aprobación, cuatro puntos que el alcance inicial no listaba. Se asumen dentro del MVP:

- **A1. «Ver qué se ha movido desde la última visita»** (punto 7 y épica E3). Es la forma concreta de cumplir «llego por la mañana y veo qué se ha movido». Lo que cada persona ve como «nuevo» depende de cuándo miró por última vez, y eso es privado (RF-19).
- **A2. La frescura cubre también altas de tareas y cambios de responsable**, no solo cambios de estado (RF-16).
- **A3. Editar tareas:** título, fecha de vencimiento y responsable de una tarea ya creada (RF-8 y RF-11).
- **A4. El responsable se elige entre las personas con cuenta del espacio** (RF-7).

### Fuera de alcance

| Se queda fuera | Por qué |
|---|---|
| Entidad «equipo» y varios equipos | El caso es un solo equipo; modelarlos añade pertenencia e invitaciones sin cambiar la decisión que se quiere habilitar. Se anota como supuesto. |
| Roles y permisos avanzados | Con 3 a 10 personas, todos editando lo mismo basta. |
| Estado «bloqueado» | Es la parte de la daily que se declaró no resuelta. |
| Estados configurables | Es el «rollo» de Jira que se quiere evitar. |
| Presencia e indicadores de actividad de personas | Es vigilancia y se rechaza a propósito. |
| Estado derivado de Git, PRs, CI o calendario | Es otro producto, con integraciones de terceros. |
| Conexión con otro gestor de tareas (leer o sincronizar sus tareas) | Es otro producto, con integraciones de terceros. Sin ella, y sin poder sustituir al gestor (ver §3), la convivencia será manual y obliga a actualizar dos veces: riesgo declarado, no resuelto. |
| Notificaciones push e integración con Slack | El caso es «llego y veo qué se movió», sin interrumpir. |
| Sincronización en tiempo real estricta | Unos segundos de demora no cambian la decisión de no duplicar trabajo. |
| Comentarios, chat, videollamada y edición simultánea | Son conversación, no estado. |
| Analítica y reporting | No hay lead que consuma reportes. |
| Sprints, estimaciones, épicas y backlog priorizado | Quien los necesite no es el usuario. |

### Aún sin decidir

Tratado como fuera de alcance del MVP **[SUPUESTO]**; a decidir antes de construir:

- Eliminar o archivar tareas (hoy una tarea creada por error solo puede editarse).
- Historial completo de cambios (el MVP solo muestra el último cambio de cada tarea, ver RF-18).
- Varios responsables por tarea.
- Migrar tareas desde el gestor actual.

## 5. Épicas del MVP

- **E1 «Cuentas y acceso»:** registro, inicio y cierre de sesión, y perfil propio; garantiza que solo personas con cuenta entran al espacio compartido.
- **E2 «Gestión de tareas»:** crear, asignar, cambiar de estado, poner fecha y filtrar las tareas del equipo.
- **E3 «Actividad del equipo»:** ver los cambios de otras personas sin recargar y qué se ha movido desde la última visita, sin avisos.

## 6. Requisitos funcionales

### E1 Cuentas y acceso

- **RF-1.** Una persona puede crear una cuenta con su email, una contraseña y su nombre. *(Ya existe.)*
- **RF-2.** Una persona con cuenta puede iniciar y cerrar sesión. *(Ya existe.)*
- **RF-3.** Una persona con sesión iniciada puede ver su propio perfil. *(Ya existe.)*
- **RF-4.** Sin sesión iniciada, no se puede ver ni modificar ninguna tarea; la persona es llevada a la pantalla de inicio de sesión. **[SUPUESTO]** Es el comportamiento esperado para un espacio compartido.
- **RF-5.** Toda persona con cuenta accede al mismo espacio compartido, sin invitación ni aprobación. **[SUPUESTO]** El registro abierto es aceptable para el caso de estudio; si el producto se expone públicamente, habrá que decidir cómo se restringe el acceso.

### E2 Gestión de tareas

- **RF-6.** Una persona puede crear una tarea indicando un título y un responsable. No se puede crear sin ambos. *Aceptación:* al intentar guardar sin título o sin responsable, la tarea no se crea y se indica qué falta.
- **RF-7.** El responsable es una única persona con cuenta, elegida entre las del espacio. Si en el espacio solo hay una persona, puede asignarse a sí misma.
- **RF-8.** La fecha de vencimiento es opcional al crear y al editar la tarea.
- **RF-9.** Una tarea tiene exactamente uno de tres estados: pendiente, en curso o hecho. Toda tarea nueva empieza en pendiente.
- **RF-10.** Una persona puede cambiar el estado de una tarea desde la lista, en dos clics como máximo y sin salir de la lista. *Aceptación:* partiendo de la lista abierta, el cambio de estado se completa con dos clics o menos.
- **RF-11.** Cualquier persona del espacio puede cambiar el estado, el título, la fecha y el responsable de cualquier tarea. El sistema no lo impide; la convención es que lo hace quien trabaja la tarea. **[SUPUESTO]**
- **RF-12.** La lista muestra todas las tareas del espacio, sin ocultar ninguna, con su título, responsable, estado y fecha de vencimiento. **[SUPUESTO]** Se ordena con las tareas cambiadas más recientemente primero.
- **RF-13.** Una persona puede filtrar la lista por estado. Sin filtro, ve todas las tareas. *Aceptación:* con el filtro «en curso», solo se ven tareas en curso.
- **RF-14.** Una tarea con fecha de vencimiento pasada y estado distinto de «hecho» se muestra como vencida, con una marca visible en la lista. Una tarea sin fecha nunca se muestra como vencida, y una tarea «hecha» deja de contar como vencida. **[SUPUESTO]** Las dos reglas, «hecha deja de ser vencida» y la marca visible en lugar de un filtro propio, se asumen sin validar.
- **RF-15.** El día de vencimiento se interpreta en la zona horaria de la persona que mira la lista, no en la de quien creó la tarea. **[SUPUESTO]**

### E3 Actividad del equipo

- **RF-16.** Cuando otra persona crea una tarea, cambia su estado o cambia su responsable, quien tiene la lista abierta ve el cambio sin recargar la página a mano, dentro del plazo de RNF-1.
- **RF-17.** Al abrir la lista, las tareas con algún cambio posterior a la última vez que esa persona la abrió quedan marcadas como cambiadas. *Aceptación:* si otra persona cambia una tarea y yo abro la lista, la veo marcada; si la abro de nuevo sin más cambios, ya no está marcada. **[SUPUESTO]** «Última visita» significa la última vez que la persona abrió la lista.
- **RF-18.** Para cada tarea cambiada, la persona puede ver quién hizo el último cambio y cuándo. El MVP solo muestra el último cambio de cada tarea.
- **RF-19.** La marca de «cambiado desde mi última visita» es privada: ninguna otra persona la ve.
- **RF-20.** FlowSync no envía notificaciones push, correos ni mensajes a otras herramientas.
- **RF-21.** FlowSync no muestra quién está conectado ni indicadores de actividad de las personas. Solo muestra el estado de las tareas.

## 7. Requisitos no funcionales

- **RNF-1. Frescura.** Un cambio hecho por una persona se ve en la lista de las demás en un máximo de 10 segundos en condiciones normales de red. **[SUPUESTO]** 10 segundos es suficiente para la decisión de no duplicar trabajo; una demora de 5 a 10 segundos es aceptable y no se exige tiempo real estricto.
- **RNF-2. Rapidez de uso.** Cambiar el estado de una tarea toma dos clics como máximo (RF-10). Crear una tarea solo exige rellenar el título y el responsable; **[SUPUESTO]** el objetivo es hacerlo en 15 segundos o menos.
- **RNF-3. Sin configuración.** Para empezar a usar FlowSync no se necesita configurar nada más allá de crear la cuenta.
- **RNF-4. Idioma.** Toda la interfaz y los mensajes de error están en castellano.
- **RNF-5. Uso en varios husos horarios.** La fecha de vencimiento se muestra como el mismo día para todas las personas, sea cual sea su huso. Solo el cálculo de «vencida» depende de la zona horaria de quien mira (RF-15). **[SUPUESTO]**
- **RNF-6. Escala.** Funciona con equipos de 3 a 10 personas. **[SUPUESTO]** Se mantiene usable con unas 200 tareas en el espacio.
- **RNF-7. Plataforma.** Se usa desde un navegador de escritorio actual. **[SUPUESTO]** El uso en móvil no se prueba en el MVP.
- **RNF-8. Privacidad.** FlowSync no sabe ni muestra si una persona está conectada o activa. Solo muestra el estado de las tareas; lo único que se guarda de cada persona es cuándo miró por última vez (RF-17), y solo ella lo ve.
- **RNF-9. Seguridad básica.** El acceso a las tareas exige sesión iniciada, y la contraseña de una persona no es visible para nadie, ni siquiera para ella.
- **RNF-10. Calidad.** Cada requisito funcional se entrega verificado contra su criterio de aceptación.

## 8. Restricciones

- **Stack actual:** el backend es AdonisJS 7 y el frontend es React 19. El MVP se construye sobre ese stack, sin cambiarlo.
- **Autenticación existente:** el registro, el inicio y cierre de sesión y el perfil ya funcionan. El MVP los reutiliza y no los rehace.
- **Sin base previa de tareas:** hoy no hay funcionalidad de tareas ni de actividad; se construye desde cero.
- **Sin integraciones externas:** el MVP no lee ni escribe datos en otras herramientas.
- **Una sola vertical:** se prefiere una capacidad terminada de punta a punta antes que varias a medias.
- **Caso de estudio, no cliente real:** los resultados con ese equipo no demuestran todavía que el producto funcione en otros equipos.

## 9. Métricas de éxito

La validación se hace con el equipo del caso de estudio durante una semana de uso real, con una semana previa de línea base. Todos los umbrales son **[SUPUESTO]** y se ajustan tras medir esa línea base. Con 6 personas y una semana, los resultados son indicativos, no estadísticos.

| Métrica | Cómo se mide | Objetivo **[SUPUESTO]** |
|---|---|---|
| **M1. La ronda de «¿en qué estás?» se cancela** (métrica principal) | El equipo retira la ronda de la daily y, al cabo de 7 días, se pregunta a cada integrante si pide reinstaurarla | Nadie la pide. Si la siguen haciendo igual, no funcionó |
| **M2. Menos interrupciones** | Mensajes de «¿en qué estás?» o «¿cómo vas?» por chat, contados en la semana de línea base y en la de prueba | Bajan al menos a la mitad |
| **M3. Menos trabajo duplicado** | Casos en que dos personas hacen la misma tarea sin saberlo, según el equipo | 0 casos en la semana de prueba |
| **M4. Información fresca** | Porcentaje de tareas «en curso» con algún cambio en los últimos 3 días | 80 % o más |
| **M5. Adopción** | Personas del equipo que cambian el estado de alguna tarea al menos una vez en la semana | 80 % o más de las personas |
| **M6. Esfuerzo de actualizar** | Clics necesarios para cambiar el estado, comprobado en una prueba manual | 2 o menos |

**Señales de fallo:** tareas «en curso» sin cambios durante días, personas que dejan de actualizar su estado, y preguntas por chat que siguen igual que antes. Si la información se queda vieja, el producto pierde el sentido: es el riesgo principal a validar. Hoy el MVP no tiene un indicador propio de tareas obsoletas; M4 es la forma de detectarlo.

**Lo que la métrica M1 no mide:** la parte de bloqueos de la daily sigue existiendo. Que la daily se mantenga por ese motivo no cuenta como fallo.

## 10. Puntos abiertos

Decisiones de producto que no se cierran en este documento, y cuestiones que se pueden resolver durante la construcción. Cada una indica el argumento y lo que haría falta para decidirla. La fecha de vencimiento y el filtro por estado siguen dentro del alcance, bajo E2: lo que se cuestiona aquí es cómo se comportan, no que estén.

### Decisiones de producto

1. **Quién puede registrarse (RF-5).** *Argumento:* con registro abierto y un único espacio compartido, cualquiera que llegue a la dirección ve y edita todas las tareas del equipo. *Para decidirlo:* saber dónde se va a usar (público o interno), si las tareas contienen información sensible, y elegir entre invitación, un código de espacio o aceptar el riesgo para el caso de estudio.
2. **Que cualquiera edite la tarea de otro (RF-11).** *Argumento:* permite que alguien marque como «hecha» una tarea ajena, y eso erosiona la confianza en el estado, que es el producto. *Para decidirlo:* ver en la semana de prueba si ocurre, y comparar «solo el responsable cambia el estado» con «cualquiera, con el último cambio visible» (RF-18).
3. **Qué cuenta como «última visita» (RF-17).** *Argumento:* no está definido con varios dispositivos, con una pestaña que se queda abierta, ni si un cambio recibido en vivo cuenta como visto. Abrir la lista sin mirarla borra las marcas, y el caso «vuelvo de una reunión» es justo el que falla. *Para decidirlo:* probar el caso con 2 o 3 personas del equipo y fijar una regla que lo cubra.
4. **Si «ver qué se ha movido» (A1) entra en el MVP o se recorta.** *Argumento:* es lo más caro y lo menos definido, y puede que la lista ordenada ya baste. *Para decidirlo:* comprobar con el equipo si la lista, sin marcas, ya les deja ver qué se movió al volver.
5. **Orden de la lista (RF-12).** *Argumento:* con la lista actualizándose en vivo, ordenar por «cambiado más reciente» mueve las filas bajo el cursor y choca con los dos clics de RF-10. *Para decidirlo:* probar un orden estable (por estado o por fecha) frente al de «más reciente», con la lista en vivo.
6. **«Vencida» y zona horaria (RF-14, RF-15, RNF-5), dentro de E2.** *Argumento:* al interpretarse en la zona de quien mira, la misma tarea puede estar vencida para una persona y no para otra. *Para decidirlo:* preguntar al equipo de 3 husos qué esperan, y elegir entre la zona de cada persona, una zona única del espacio o el día calendario sin hora.
7. **Lista que crece sin archivar ni eliminar (RF-13, RNF-6), dentro de E2.** *Argumento:* las tareas «hechas» se acumulan y la lista por defecto, con todas, se llena de ruido a las pocas semanas. *Para decidirlo:* ver cuántas tareas «hechas» se acumulan en dos semanas y decidir si el filtro por defecto oculta las «hechas» y si hace falta archivar o eliminar (ver también «Aún sin decidir» en §4).
8. **Mostrar quién hizo el último cambio (RF-18) frente al rechazo de indicadores de actividad (RF-21).** *Argumento:* atribuir un cambio a una persona queda cerca de lo que se rechazó como vigilancia, y la épica se llama «Actividad del equipo». *Para decidirlo:* acordar con el equipo si el estado es de la tarea o también de quien la toca, y si el nombre de la épica sigue siendo adecuado.
9. **Cómo se mide el éxito (§9).** *Argumento:* M3 probablemente ya era cercana a 0 sin FlowSync y no puede mostrar mejora; M5 mide que alguien cambió un estado, no que lo use; M4 mide actividad, no verdad, y penaliza tareas largas legítimas; M1 la decide el equipo y una semana es efecto novedad; no hay criterio de qué hacer si falla; no hay métrica de que una decisión cambió. *Para decidirlo:* medir una línea base, acordar con el equipo qué evidencia aceptan y valorar una pregunta corta del tipo «elegí otra tarea porque vi que esta estaba en curso».
10. **Promesa frente al episodio real (§2 y §3).** *Argumento:* el episodio fue en un módulo, y una tarea es más fina; además, sin avisos (RF-20), evitar el duplicado depende de que la gente mire antes de empezar. *Para decidirlo:* ver cómo parte el trabajo el equipo del caso de estudio y si el hábito de mirar la lista antes de empezar se mantiene.

### Subsanables durante la construcción

- **RNF-1:** definir qué son «condiciones normales de red» para poder medir los 10 segundos.
- **RNF-10 y criterios de aceptación:** solo RF-6, RF-10, RF-13 y RF-17 tienen criterio de aceptación; hay que escribirlo para el resto de requisitos funcionales.
