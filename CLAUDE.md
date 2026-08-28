# Proyecto

App personal de finanzas e inversiones. React + Vite + TypeScript + Tailwind CSS + shadcn/ui (sobre Base UI, no Radix — prop `render` en vez de `asChild`) + Supabase.

Qué hace, cómo correrla y pendientes de producción: README.md.

# Arquitectura

Por Features: `ui/` (presentación), `data/` (tipos/mappers/selectors), `api/` (único lugar que importa `@/lib/supabase`). Detalle: docs/ARCHITECTURE.md.

Antes de crear una feature nueva, revisar `src/features/transactions/` e `src/features/investments/` — ahí ya están resueltos los patrones de formularios crear/editar, borrado con confirmación, tablas con scroll, etc.

# Reglas

- Reutilizar antes de crear: `src/lib/format.ts` (moneda/montos), `src/components/common/` (date-picker, confirm-delete-dialog, scrollable-table), `useSession()`.
- No agregar dependencias sin justificación. No duplicar lógica. Componentes pequeños. No modificar la arquitectura sin justificación.
- La UI nunca accede a Supabase directamente ni crea otro cliente — reglas de RLS, migraciones y seguridad: docs/database.md.
- Estilos y componentes: docs/DESIGN_SYSTEM.md.
- Feature nueva o cambio en `data/`: agregar/actualizar tests con `npm test` (Vitest, para selectors/mappers puros) y `npm run e2e` (Playwright, mockeando Supabase con `page.route` — ver `e2e/helpers/mock-supabase.ts`). Antes de terminar una tarea: `npm test`, `npm run e2e`, `tsc -b`, `npm run lint` y `npm run build` sin errores nuevos.

# Documentación

docs/ARCHITECTURE.md · docs/database.md · docs/DESIGN_SYSTEM.md · README.md
