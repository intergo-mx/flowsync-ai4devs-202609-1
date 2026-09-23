# CLAUDE.md

Este archivo da contexto a Claude Code (claude.ai/code) para trabajar con el código de este repositorio.

## Resumen del proyecto

FlowSync — proyecto de práctica de un curso (gestión de tareas en equipo). Monorepo con dos proyectos npm independientes:

- `backend/` — API en AdonisJS 7, SQLite (`better-sqlite3`) + Lucid ORM, auth con access tokens.
- `frontend/` — React 19 + Vite (por ahora es solo el scaffold inicial de Vite, sin código de app todavía).

El backend por ahora solo implementa auth (signup/login/logout/profile) — es un punto de partida (rama `s1/start`), no una app terminada.

## Comandos

### Backend (`backend/`)
```bash
npm run dev          # node ace serve --hmr — http://localhost:3333
npm run test         # node ace test (suites unit y functional vía Japa)
npm run lint         # eslint .
npm run format       # prettier --write .
npm run typecheck    # tsc --noEmit
npm run build        # node ace build
node ace migration:run   # aplica migraciones pendientes
```
Para correr un solo archivo de test: `node ace test --files tests/functional/some.spec.ts`.

### Frontend (`frontend/`)
```bash
npm run dev       # vite — http://localhost:5173
npm run lint      # oxlint
npm run build     # tsc -b && vite build
```

Backend y frontend corren en terminales separadas (el backend debe seguir corriendo para que el frontend pueda llamar a la API).

## Arquitectura (backend)

AdonisJS 7 con el patrón de "entidades generadas" — varias cosas se generan por código y no deben editarse a mano:

- **`database/schema.ts`** — schemas de modelos Lucid autogenerados (`UserSchema`, `AuthAccessTokenSchema`) derivados de las migraciones. Nunca editar a mano: crear una migración en `database/migrations/` y correr `node ace migration:run` para regenerarlo. Los ajustes de generación a nivel de columna van en `database/schema_rules.ts`, no en `schema.ts`.
- **`.adonisjs/server/controllers.ts`** (`#generated/controllers`) — mapa autogenerado de nombres de controlador a imports dinámicos, usado en `start/routes.ts` (p. ej. `controllers.Profile`) en lugar de importar las clases de controlador directamente. También se regenera; no editar `.adonisjs/**` a mano.

Flujo de una request: `start/routes.ts` → `#generated/controllers` → controller (en `app/controllers/`) → modelo (`app/models/`, compuesto a partir de la clase base `*Schema` generada) → la respuesta pasa por un `*Transformer` (`app/transformers/`, extiende `BaseTransformer`, implementa `toObject()` usando `this.pick(...)`) mediante el helper `serialize()` inyectado en `HttpContext`. Los controllers nunca serializan el modelo directamente.

La validación son schemas de VineJS en `app/validators/*.ts`, invocados con `request.validateUsing(...)` dentro del controller — nada de validación manual en los controllers.

El auth es con access tokens de `@adonisjs/auth` (`DbAccessTokensProvider`, `User.accessTokens`), no sesiones ni JWT. `auth.getUserOrFail()` / `user.currentAccessToken` son los puntos de entrada. Las rutas que requieren auth usan `.use(middleware.auth())` (ver el grupo `account` en `start/routes.ts`); el endpoint de perfil se sirve a través de `UserTransformer`, nunca el modelo crudo.

Los imports de rutas usan los subpath imports de Node definidos en `backend/package.json` (`imports`) (p. ej. `#models/*`, `#controllers/*`, `#transformers/*`, `#validators/*`, `#database/*`, `#generated/*`) — usarlos en vez de rutas relativas entre distintas capas de la app.

Las fechas usan `DateTime` de Luxon (ver columnas `createdAt`/`updatedAt`), no `Date` nativo.

## Reglas de proceso
-
Antes de tocar código: crear una rama nueva (`git checkout -b feat/<slug>`). Nunca commitear directo en `main`/`s1/start`.
-
Al cerrar la tarea: usar la skill `/commit`, luego `gh pr create` con una descripción completa de los cambios en el cuerpo del PR.
-
Después de abrir el PR: usar el subagente `adversarial-reviewer` sobre él, antes de darlo por terminado.
-
No repitas ese resumen en el chat: la sesión se va a perder, el PR no. Responde solo con la URL del PR.