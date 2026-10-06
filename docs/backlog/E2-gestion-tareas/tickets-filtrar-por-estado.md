# Tickets de FS-142 — Filtrar la lista por estado

**Historia:** [FS-142](us-filtrar-por-estado.md)
**Épica:** E2 Gestión de tareas

Cada ticket hereda los criterios de la historia (los números remiten a `us-filtrar-por-estado.md`). Su Definition of Done es una checklist de cómo se entrega: no añade criterios nuevos. Los tickets nombran la capa que tocan y no diseñan; esas decisiones son de la implementación.

**Dependencias externas** (sin ID todavía): la lista de tareas, el cambio de estado y la actualización en vivo (E3, RF-16).

**Sin ticket de Migración/DB:** el estado de la tarea ya lo aporta la tarea base y el filtro no exige guardar nada nuevo en el servidor. Si la decisión del criterio 14 lo requiriera, sería un ticket nuevo.

## Tickets

### FS-142.1 — Selección de tareas por estado, con validación de que el estado exista

- **Tipo:** Modelo/Dominio
- **Criterios heredados:** 1–5, 7, 8
- **Dependencias:** lista de tareas
- **Definition of Done:**
  - [ ] Reglas cubiertas con tests unitarios (suite `unit`), incluidos el estado inexistente y la ausencia de tareas.
  - [ ] La lógica vive en el modelo o dominio, no en el controlador ni en la UI.
  - [ ] Imports por subpath.
  - [ ] No se edita el esquema generado.

### FS-142.2 — La lista admite un filtro de estado opcional y avisa si el estado no existe

- **Tipo:** Endpoint/API
- **Criterios heredados:** 1–10
- **Dependencias:** FS-142.1
- **Definition of Done:**
  - [ ] La entrada se valida con un validador del repo.
  - [ ] El estado inexistente produce un aviso en castellano con los estados válidos, nunca una lista vacía.
  - [ ] La respuesta usa un transformer y pasa por `serialize()`.
  - [ ] Exige sesión iniciada.
  - [ ] Tests funcionales (suite `functional`) con la BD aislada con los hooks de `testUtils.db()`.
  - [ ] Tipos generados de `.adonisjs/` regenerados y commiteados.
  - [ ] Cada criterio heredado queda cubierto por al menos un test.

### FS-142.3 — Control de filtro en la lista: elegir estado y quitarlo

- **Tipo:** Frontend
- **Criterios heredados:** 1–6
- **Dependencias:** FS-142.2; FS-118.7 (solo para la marca de vencida del criterio 6)
- **Definition of Done:**
  - [ ] Toda llamada nueva a la API se añade en `lib/api.ts`.
  - [ ] Los errores (`ApiError`) se muestran en castellano.
  - [ ] Componentes de shadcn traídos por la CLI, sin editarlos a mano.
  - [ ] `npm run build` y `npm run lint` pasan limpios, y el formato Prettier está aplicado.
  - [ ] Revisado a mano en el navegador contra los criterios heredados, porque no hay runner de tests en el frontend.

### FS-142.4 — Mensajes de «sin tareas en ese estado», «aún no hay tareas» y de estado inexistente

- **Tipo:** Frontend
- **Criterios heredados:** 7–10
- **Dependencias:** FS-142.3
- **Definition of Done:**
  - [ ] Toda llamada nueva a la API se añade en `lib/api.ts`.
  - [ ] Los errores (`ApiError`) se muestran en castellano.
  - [ ] Componentes de shadcn traídos por la CLI, sin editarlos a mano.
  - [ ] `npm run build` y `npm run lint` pasan limpios, y el formato Prettier está aplicado.
  - [ ] Revisado a mano en el navegador contra los criterios heredados, porque no hay runner de tests en el frontend.

### FS-142.5 — Tarea que cambia de estado mientras se filtra: sale de la vista con aviso

- **Tipo:** Frontend
- **Criterios heredados:** 11
- **Dependencias:** FS-142.3; cambio de estado
- **Definition of Done:**
  - [ ] Toda llamada nueva a la API se añade en `lib/api.ts`.
  - [ ] Los errores (`ApiError`) se muestran en castellano.
  - [ ] Componentes de shadcn traídos por la CLI, sin editarlos a mano.
  - [ ] `npm run build` y `npm run lint` pasan limpios, y el formato Prettier está aplicado.
  - [ ] Revisado a mano en el navegador contra los criterios heredados, porque no hay runner de tests en el frontend.

### FS-142.6 — Filtro propio de cada persona y recordado al recargar o volver

- **Tipo:** Frontend
- **Criterios heredados:** 13, 14
- **Dependencias:** FS-142.3
- **Definition of Done:**
  - [ ] Toda llamada nueva a la API se añade en `lib/api.ts`.
  - [ ] Los errores (`ApiError`) se muestran en castellano.
  - [ ] Componentes de shadcn traídos por la CLI, sin editarlos a mano.
  - [ ] `npm run build` y `npm run lint` pasan limpios, y el formato Prettier está aplicado.
  - [ ] Revisado a mano en el navegador contra los criterios heredados, porque no hay runner de tests en el frontend.

### FS-142.7 — Los cambios de otras personas respetan el filtro activo

- **Tipo:** Frontend
- **Criterios heredados:** 12
- **Dependencias:** FS-142.3; actualización en vivo
- **Definition of Done:**
  - [ ] Toda llamada nueva a la API se añade en `lib/api.ts`.
  - [ ] Los errores (`ApiError`) se muestran en castellano.
  - [ ] Componentes de shadcn traídos por la CLI, sin editarlos a mano.
  - [ ] `npm run build` y `npm run lint` pasan limpios, y el formato Prettier está aplicado.
  - [ ] Revisado a mano en el navegador contra los criterios heredados, porque no hay runner de tests en el frontend.

### FS-142.8 — Pruebas de los criterios de filtrado

- **Tipo:** Test
- **Criterios heredados:** 1–10, 13
- **Dependencias:** FS-142.2
- **Definition of Done:**
  - [ ] Un test por criterio heredado, con nombres que citen el criterio.
  - [ ] Deterministas, sin depender de datos previos ni de la hora real.
  - [ ] Pasan en una BD limpia y sin filtrarse estado entre runs.

## Orden

.1 y .2 son la base. Después, .3 abre el resto, y .4, .5, .6 y .7 pueden avanzar en paralelo. El test (.8) puede empezar en cuanto esté .2.

## Notas

- **Criterios con decisión pendiente:** FS-142.5 (criterio 11) y FS-142.6 (criterio 14) dependen de preguntas sin responder: qué pasa con la fila al cambiar de estado, y si el filtro se recuerda. El criterio 7 de FS-142.4 presupone que el filtro puede llegar editado a mano. Conviene resolverlos antes de empezar esos tickets.
- **Solape con otra épica:** FS-142.7 y el criterio 12 son en el fondo comportamiento de E3 (RF-16). Si se prefiere sacarlos de E2, se separan.
