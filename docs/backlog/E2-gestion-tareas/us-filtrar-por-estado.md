# Filtrar la lista por estado

**ID:** FS-142
**Épica:** E2 Gestión de tareas

## Historia

Como integrante del equipo, quiero filtrar la lista de tareas por estado, para centrarme en lo pendiente y ver qué está en curso sin ruido del resto.

## Criterios de aceptación

### Camino feliz

1. **Sin filtro, todas las tareas**
   - **DADO** una lista con tareas pendientes, en curso y hechas
   - **CUANDO** abro la lista sin aplicar ningún filtro
   - **ENTONCES** veo todas las tareas del espacio, sin ocultar ninguna.

2. **Filtrar por un estado**
   - **DADO** una lista con tareas en los tres estados
   - **CUANDO** filtro por «en curso»
   - **ENTONCES** solo veo tareas en curso.

3. **Los tres estados son filtrables**
   - **DADO** una lista con tareas en los tres estados
   - **CUANDO** filtro por «pendiente», «en curso» o «hecho»
   - **ENTONCES** en cada caso veo únicamente las tareas de ese estado.

4. **Quitar el filtro**
   - **DADO** que tengo un filtro aplicado
   - **CUANDO** lo quito
   - **ENTONCES** vuelvo a ver todas las tareas.

5. **El filtro no modifica nada**
   - **DADO** que filtro la lista
   - **CUANDO** miro o quito el filtro
   - **ENTONCES** ninguna tarea cambia de estado, responsable, fecha ni título, y las demás personas no notan nada.

6. **El filtro conserva la información de cada tarea**
   - **DADO** una lista filtrada
   - **CUANDO** miro una tarea
   - **ENTONCES** veo su título, responsable, estado y fecha, y las tareas vencidas conservan su marca (FS-118).

### Errores y edge cases

7. **Estado que no existe**
   - **DADO** que pido ver las tareas de un estado que no es pendiente, en curso ni hecho (por ejemplo «bloqueado», o un enlace guardado o editado a mano con un estado inventado)
   - **CUANDO** se aplica ese filtro
   - **ENTONCES** se me avisa en castellano de que ese estado no existe e indica cuáles son los válidos, y no se me muestra una lista vacía como si no hubiera tareas.

8. **Tras el aviso de estado inexistente**
   - **DADO** que recibí el aviso del criterio 7
   - **CUANDO** elijo un estado válido o quito el filtro
   - **ENTONCES** veo la lista correspondiente y el aviso desaparece.

9. **Estado válido sin tareas**
   - **DADO** que ninguna tarea está en el estado que filtro (por ejemplo, no hay tareas «en curso»)
   - **CUANDO** aplico el filtro
   - **ENTONCES** veo un mensaje que dice que no hay tareas en ese estado, claramente distinto del aviso de error del criterio 7.

10. **Espacio sin ninguna tarea**
    - **DADO** un espacio donde todavía no hay tareas
    - **CUANDO** abro la lista, con o sin filtro
    - **ENTONCES** veo un mensaje que dice que aún no hay tareas, sin tratarlo como error.

### Filtro y cambios en la lista

11. **Cambio de estado de una tarea mientras filtro**
    - **DADO** que filtro por «pendiente» y cambio una tarea a «en curso»
    - **CUANDO** el cambio se completa
    - **ENTONCES** la tarea sale de la vista filtrada y puedo ver, con un aviso, que se movió a «en curso».

12. **Cambios de otras personas respetan mi filtro**
    - **DADO** que tengo la lista abierta con un filtro
    - **CUANDO** otra persona crea una tarea o cambia el estado de una
    - **ENTONCES** veo el cambio sin recargar, dentro del plazo de frescura, y la tarea aparece o desaparece según coincida o no con mi filtro.

13. **El filtro es solo mío**
    - **DADO** que aplico un filtro
    - **CUANDO** otra persona mira la lista
    - **ENTONCES** ella ve su propia vista, sin mi filtro.

14. **Recarga y regreso**
    - **DADO** que tengo un filtro aplicado
    - **CUANDO** recargo la página o vuelvo a abrir la lista
    - **ENTONCES** la lista se muestra con el filtro que había elegido.
