# Alcance del MVP de FlowSync

Alcance consensuado, base del PRD. Es un documento de producto: no define modelo de datos, esquema, endpoints ni mecanismo técnico de sincronización. Eso se decide en la spec de implementación.

## 1. Problema

En equipos remotos pequeños, la única forma de saber qué hace cada quien es preguntar: en la daily o por chat. Eso interrumpe a quien trabaja y no evita el trabajo duplicado.

- **Dolor concreto:** la daily de sincronización y el «¿en qué estás?» constante por Slack o chat. Nadie ve el estado del equipo sin interrumpir a alguien.
- **Episodio real:** dos personas del equipo tocaron el mismo módulo la misma semana, porque una empezó sin que la otra lo supiera. Se perdieron dos días.
- **Qué desaparece y qué no (respuesta honesta):** desaparece la ronda de «¿en qué estás?», que hoy se come la mitad de los 15 minutos de la daily. **No desaparece la parte de bloqueos**, y este MVP no la resuelve.

## 2. Usuarios

- **Quién cobra el valor:** los pares, no un lead. No hay reporte hacia arriba, y a un manager le daría igual. Duele a quienes descubren tarde que iban a lo mismo y a quien interrumpe a otro para preguntar.
- **Equipo objetivo:** equipos remotos pequeños, de 3 a 10 personas. Roles planos: en el MVP todos ven y editan lo mismo, sin jerarquía de permisos.
- **Primer usuario concreto:** un equipo de 6 personas de producto SaaS, en 3 husos horarios, que hoy usa un gestor de tareas pesado y una daily de 15 minutos por videollamada.
- **Advertencia:** este equipo es un **caso de estudio, no un cliente real**. Que funcione ahí no demuestra todavía que funcione en otros equipos.
- **Frontera:** un único espacio compartido, sin entidad «equipo». Varios equipos separados, o gente en más de uno, queda fuera y se anota como supuesto.

## 3. Propuesta de valor

Una lista de tareas compartida donde **«en curso» se ve sin preguntar**. Así nadie empieza algo que otra persona ya está tocando, y cada quien elige lo siguiente sabiendo qué está libre.

- **Decisión que cambia:** no empezar lo que ya está en curso y elegir lo siguiente sabiendo qué está libre. Si el único resultado fuera «sentirse informado», el tiempo real no valdría lo que cuesta.
- **Frescura, no presencia:** el estado es de la **tarea**, no de la persona. Es un resumen que espera, no un aviso que interrumpe: se llega por la mañana o se vuelve de una reunión y se ve qué se ha movido.
- **Por qué se sostiene:** quien actualiza cobra en el momento. La misma lista es su cola de trabajo y, al mantenerla, deja de recibir preguntas sobre cómo va. Actualizar cuesta dos clics sobre una lista ya abierta, sin campos de configuración, sin sprint ni estimación. Si el beneficio fuera solo para los demás, nadie la mantendría.
- **Dónde vive el trabajo:** FlowSync es donde se hace el trabajo, no donde se cuenta. Sustituye al gestor de tareas, no convive con él: crea sus propias tareas y no lee las de otro sitio, porque convivir exigiría doble actualización.
- **«Menos rollo que Jira»:** crear una tarea y cambiar su estado en segundos, sin flujos de configuración. Lo mínimo para saber quién está en qué.

## 4. Alcance (IN)

Una sola vertical fina, usable de punta a punta. Se prefiere una capability terminada a tres a medias.

1. **Espacio único compartido.** Todas las personas con cuenta ven y editan lo mismo.
2. **Crear una tarea** con título, responsable y fecha de vencimiento opcional.
   - **Obligatorios:** título y responsable. Una tarea sin responsable no cumple el propósito del producto.
   - **Opcional:** fecha de vencimiento. Sin fecha, la tarea nunca aparece como vencida.
3. **Tres estados fijos y no configurables: pendiente, en curso y hecho.**
   - «En curso» es la señal que el producto existe para transmitir.
   - Los nombres exactos en código se definen en la spec de implementación, no en el PRD.
4. **Cambiar el estado en dos clics** sobre la lista ya abierta. Lo hace quien hace la tarea.
5. **Filtrar la lista por estado,** para centrarse en lo pendiente y ver de un vistazo qué se pasó de plazo.
6. **Frescura sin recargar a mano.** Los cambios de estado se ven sin refrescar ni preguntar. **Una demora de 5 a 10 segundos es aceptable.**
7. **Tests incluidos.** El trabajo llega con pruebas; se da por hecho en el alcance.

### Criterio de éxito

- **Para el usuario:** dejar de hacer la ronda de «¿en qué estás?» porque el estado del equipo se ve de un vistazo.
- **A una semana de uso real:** el equipo cancela esa ronda y nadie pide que vuelva. Si la siguen haciendo igual, no funcionó.

### Riesgo principal

**Que la información se quede vieja.** Si pasa, el producto pierde el sentido. Es el riesgo #1 a validar, no un detalle. La mitigación es que actualizar cueste dos clics, sin obligar a nadie.

## 5. NO-alcance (OUT)

| Se queda fuera | Por qué |
|---|---|
| **Entidad «equipo» y varios equipos** | El caso de estudio es un solo equipo. Modelarlos añade invitaciones y pertenencia sin cambiar la decisión que se quiere habilitar. Se anota como supuesto. |
| **Roles y permisos avanzados** | Con 3 a 10 personas de confianza, todos editando lo mismo basta y evita una pantalla de administración. |
| **Estado «bloqueado»** | Es la mitad de la daily que se declaró no resuelta. Añadirlo sería prometer más de lo que el MVP cumple. |
| **Estados configurables** | Es el «rollo» de Jira que se quiere evitar. Tres fijos bastan para transmitir «en curso». |
| **Presencia («quién está conectado») e indicadores de actividad** | Es vigilancia y se rechaza a propósito. El estado es de la tarea, no de la persona. |
| **Estado derivado de Git, PRs, CI o calendario** | Es otro producto, con integraciones y OAuth de terceros. Aquí el estado lo teclea quien hace la tarea, en segundos. |
| **Convivir con otro gestor de tareas** | Exigiría doble actualización, que es como muere esta categoría. |
| **Notificaciones push e integración con Slack** | El caso es «llego y veo qué se movió». Las notificaciones contradicen la promesa de menos interrupciones. |
| **Sincronización en tiempo real estricta** | Con 5 a 10 segundos de demora la decisión de no duplicar trabajo no cambia, y lo estricto cuesta bastante más. |
| **Comentarios en tareas, chat, videollamada y edición simultánea** | Son conversación, no estado. Competirían con el chat existente y ampliarían la superficie sin atacar el problema. |
| **Analítica y reporting** | No hay lead que consuma reportes: el valor es para los pares. |
| **Sprints, estimaciones, épicas y backlog priorizado** | Un equipo que los necesite no es nuestro usuario. Es lo que diferencia a FlowSync de Jira. |

## Supuestos a validar

- Un único espacio compartido basta para equipos de 3 a 10 personas.
- El equipo del caso de estudio representa a otros equipos similares (aún no demostrado).
- Un resumen que espera cubre la necesidad de saber qué se movió, sin avisos.
- Actualizar el estado en dos clics es un coste que el equipo sostiene en el tiempo.
