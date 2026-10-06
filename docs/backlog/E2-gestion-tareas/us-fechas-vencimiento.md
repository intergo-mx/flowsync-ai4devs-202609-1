# Fecha de vencimiento y tareas vencidas

**ID:** FS-118
**Épica:** E2 Gestión de tareas

## Historia

Como integrante del equipo, quiero poner, cambiar o quitar una fecha de vencimiento en una tarea y ver cuáles se pasaron de plazo, para priorizar mi trabajo sin tener que preguntar ni reunirme.

## Criterios de aceptación

### Poner, cambiar y quitar la fecha

1. **Fecha opcional al crear**
   - **DADO** que estoy creando una tarea con título y responsable
   - **CUANDO** la guardo sin fecha de vencimiento
   - **ENTONCES** la tarea se crea sin fecha.

2. **Fecha al crear**
   - **DADO** que estoy creando una tarea con título y responsable
   - **CUANDO** indico una fecha de vencimiento y la guardo
   - **ENTONCES** la tarea aparece en la lista con esa fecha.

3. **Cambiar la fecha**
   - **DADO** una tarea con fecha de vencimiento
   - **CUANDO** la edito y pongo otra fecha
   - **ENTONCES** la lista muestra la nueva fecha y deja de mostrar la anterior.

4. **Poner fecha a una tarea que no la tenía**
   - **DADO** una tarea sin fecha
   - **CUANDO** le pongo una fecha
   - **ENTONCES** la tarea queda con esa fecha.

5. **Quitar la fecha**
   - **DADO** una tarea con fecha de vencimiento
   - **CUANDO** borro la fecha y guardo
   - **ENTONCES** la tarea queda sin fecha y deja de poder aparecer como vencida.

6. **Fecha que no se entiende**
   - **DADO** que estoy creando o editando una tarea
   - **CUANDO** escribo una fecha que no es válida (por ejemplo, 31 de febrero)
   - **ENTONCES** no se guarda el cambio, se me indica en castellano que la fecha no es válida y la tarea conserva su fecha anterior.

7. **Fecha que ya pasó al crear o editar**
   - **DADO** que estoy creando o editando una tarea
   - **CUANDO** indico una fecha anterior a hoy
   - **ENTONCES** se guarda sin bloquearme y la tarea se muestra como vencida desde ese momento.

8. **Editar la fecha no altera el resto**
   - **DADO** una tarea con título, responsable, estado y fecha
   - **CUANDO** cambio solo la fecha
   - **ENTONCES** el título, el responsable y el estado siguen igual.

### Qué es «vencida»

9. **Tarea vencida**
   - **DADO** una tarea con fecha de vencimiento anterior a hoy y en estado pendiente o en curso
   - **CUANDO** miro la lista
   - **ENTONCES** la tarea lleva una marca visible de vencida.

10. **Sin fecha, nunca vencida**
    - **DADO** una tarea sin fecha de vencimiento
    - **CUANDO** pasa el tiempo, sea cual sea
    - **ENTONCES** la tarea nunca se muestra como vencida.

11. **Hecha deja de ser vencida**
    - **DADO** una tarea vencida
    - **CUANDO** su estado pasa a «hecho»
    - **ENTONCES** la marca de vencida desaparece.

12. **Reabrir una tarea hecha**
    - **DADO** una tarea «hecha» cuya fecha ya pasó
    - **CUANDO** la vuelvo a pendiente o en curso
    - **ENTONCES** vuelve a mostrarse como vencida.

13. **El día de vencimiento todavía no está vencida**
    - **DADO** una tarea cuya fecha es hoy
    - **CUANDO** miro la lista durante ese día
    - **ENTONCES** la tarea no aparece como vencida, y pasa a estarlo al empezar el día siguiente.

14. **Corregir la fecha quita la marca**
    - **DADO** una tarea vencida
    - **CUANDO** le pongo una fecha de hoy o futura, o le quito la fecha
    - **ENTONCES** la marca de vencida desaparece.

15. **La marca convive con el filtro por estado**
    - **DADO** tareas vencidas en la lista
    - **CUANDO** filtro por estado (por ejemplo «pendiente»)
    - **ENTONCES** las tareas vencidas que cumplen el filtro siguen mostrando su marca.

### Zonas horarias

16. **Mismo día para todos**
    - **DADO** una tarea con fecha de vencimiento
    - **CUANDO** dos personas en husos distintos miran la lista
    - **ENTONCES** ambas ven la misma fecha (el mismo día).

17. **«Vencida» según quien mira**
    - **DADO** una tarea con fecha de vencimiento
    - **CUANDO** el día de esa fecha ya terminó en mi zona horaria, pero no en la de otra persona
    - **ENTONCES** yo la veo vencida y la otra persona todavía no.
