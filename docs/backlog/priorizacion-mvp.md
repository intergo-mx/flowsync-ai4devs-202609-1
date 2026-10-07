# Priorización del backlog: impacto frente a complejidad

Historias de E2 «Gestión de tareas» (incluidas las que quedaron fuera del MVP) y la frescura (sync) de E3 «Actividad del equipo».

Impacto y complejidad son un juicio de trabajo, no una medición, y conviene que el equipo lo revise. El impacto se mide con la propuesta de valor del PRD: «en curso» visible sin preguntar. La complejidad sale de la superficie, la incertidumbre y la novedad.

El «sync en tiempo real» de E3 se trata como la frescura del MVP (RF-16, hasta 10 s de demora). La sincronización estricta en tiempo real está fuera de alcance en el PRD.

## Historias evaluadas

| Historia | Impacto | Complejidad | En qué se basa |
|---|---|---|---|
| HU-2.1 Crear tarea (título, responsable, empieza en pendiente) | Alto | Baja | Sin ella no existe nada más. El patrón de CRUD ya es conocido. |
| HU-2.2 Elegir responsable entre las personas del espacio | Alto | Baja | Una tarea sin responsable no cumple el propósito del producto. Es una lista de personas con cuenta. |
| HU-2.4 Ver la lista con título, responsable, estado y fecha | Alto | Baja | Es la pantalla donde «en curso» se ve sin preguntar. |
| HU-2.5 Cambiar estado en dos clics | Alto | Media | Sostiene el producto (M6), pero exige una interacción ágil sobre la lista. |
| [FS-142](E2-gestion-tareas/us-filtrar-por-estado.md) Filtrar por estado | Medio-alto | Baja | Ayuda a centrarse en lo pendiente. Tres estados fijos y sin configuración. |
| E3: frescura (sync, RF-16) | Alto | Alta | Es el riesgo #1 del PRD: información vieja. Es lo menos conocido y toca altas, estados y responsables. |
| [FS-118](E2-gestion-tareas/us-fechas-vencimiento.md) Fecha de vencimiento y vencidas | Medio | Media-alta | Útil para priorizar, pero ni «en curso» ni el duplicado dependen de ella. Arrastra el supuesto de zona horaria. |
| HU-2.6 Editar el título | Bajo-medio | Baja | Corrige errores. No cambia la decisión de no duplicar trabajo. |
| HU-2.8 Reasignar el responsable | Medio | Baja | Mantiene el estado veraz cuando cambia quién trabaja. |

### Fuera del MVP

| Historia | Impacto | Complejidad | Por qué está fuera |
|---|---|---|---|
| Eliminar o archivar tareas | Medio | Media | Sin decidir en el PRD (§4). |
| Varios responsables por tarea | Bajo | Media | Contradice RF-7. |
| Descripción y comentarios | Bajo | Media | Son conversación, no estado. |
| Estado «bloqueado» y estados configurables | Medio | Media | Es la parte de la daily que se declaró no resuelta, y es el «rollo» de Jira. |
| Importar tareas del gestor actual | Medio | Alta | Es otro producto, con integraciones. |
| Solo el responsable cambia el estado | Medio | Baja | Punto abierto 2 del PRD, sin decidir. |
| Ocultar las «hechas» por defecto | Medio | Baja | Punto abierto 7 del PRD, sin decidir. |

## Matriz

```
              Complejidad →   BAJA                   MEDIA                  ALTA
Impacto ↓
ALTO                          ★ HU-2.1 Crear         HU-2.5 Cambiar         E3 Frescura
                              ★ HU-2.2 Responsable     estado (2 clics)       (sync)
                              ★ HU-2.4 Lista
MEDIO-ALTO                    ★ FS-142 Filtrar
MEDIO                         HU-2.8 Reasignar       FS-118 Fechas /        (fuera) Importar
                              (fuera) Solo resp.       vencidas               tareas
                              (fuera) Ocultar hechas (fuera) Eliminar/
                                                       archivar
                                                     (fuera) Bloqueado /
                                                       estados config.
BAJO-MEDIO                    HU-2.6 Editar título
BAJO                                                 (fuera) Varios
                                                       responsables
                                                     (fuera) Descripción /
                                                       comentarios
```

★ = quick win (impacto alto o medio-alto con complejidad baja).

## Quick wins

1. **HU-2.1 Crear tarea**
2. **HU-2.2 Elegir responsable**
3. **HU-2.4 Ver la lista**
4. **FS-142 Filtrar por estado** (en el límite: impacto medio-alto)

Las tres primeras forman la vertical mínima: con ellas ya hay una lista compartida que se puede abrir y enseñar. HU-2.5 casi lo es (impacto alto, complejidad media) y completa la promesa del producto.

## Orden de backlog propuesto

1. **HU-2.1 + HU-2.2** — base de todo, y desbloquea el resto.
2. **HU-2.4** — la lista donde se ve el estado.
3. **HU-2.5** — cambiar estado en dos clics. Con esto la vertical es usable de punta a punta.
4. **FS-142** — quick win que se apoya en la lista y en el estado.
5. **E3: frescura (sync)** — es el riesgo principal, así que conviene atacarlo pronto y no al final. Es lo más incierto: empezar con un spike para validar los 10 s y qué entra en «condiciones normales de red».
6. **FS-118** — aporta valor, pero con supuesto abierto. Mientras tanto se puede avanzar con la rama de «poner la fecha» y dejar la regla de «vencida» para cuando se decida la zona horaria.
7. **HU-2.8 y HU-2.6** — relleno de bajo coste que puede ir en huecos.

**No planificar todavía:** todo lo marcado «fuera», salvo que se revise el punto abierto del PRD correspondiente (2, 7 y la decisión de eliminar o archivar).

## Observaciones

- **Frescura antes de FS-118:** el PRD pone la información vieja como riesgo #1, y las fechas no cambian la decisión de «no duplicar trabajo». Si el equipo prefiere cerrar primero todo E2, FS-118 sube y la frescura baja, pero el riesgo central se valida más tarde.
- **Sin evaluar:** «ver qué se ha movido desde la última visita» (E3, A1). El PRD lo cuestiona (punto abierto 4); si entra, competiría con la frescura por el puesto 5.
- **Tickets:** [FS-118](E2-gestion-tareas/tickets-fechas-vencimiento.md) y [FS-142](E2-gestion-tareas/tickets-filtrar-por-estado.md).
