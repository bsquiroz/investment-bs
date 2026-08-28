# DATABASE.md

Reglas y convenciones para el uso de la base de datos en el proyecto.
Este documento es de cumplimiento **obligatorio** para desarrolladores y para
cualquier asistente de IA que trabaje sobre el repositorio.

---

## Stack actual

El backend de datos es **Supabase**. Por ahora solo usamos:

- **PostgreSQL** — base de datos relacional.
- **Auth** — autenticación de usuarios (login).

Cualquier otra capacidad de Supabase (Storage, Edge Functions, Realtime, etc.)
está **fuera de alcance** hasta que se documente aquí.

---

## Reglas de acceso

- **Ningún componente de UI accede directamente a Supabase.**
- Todo acceso a datos pasa por la capa `api/` de cada feature.

Flujo de acceso permitido:

```
ui/  →  data/  →  api/  →  Supabase
```

- `ui/` nunca importa el cliente de Supabase ni ejecuta queries.
- `data/` define modelos, tipos, estado y transformación de datos.
- `api/` es la **única** capa que habla con Supabase.

Esto respeta las responsabilidades definidas en `docs/ARCHITECTURE.md`.

---

## Cliente de Supabase

- Existe **un solo cliente** de Supabase en toda la aplicación.
- Se define y se reutiliza desde: `src/lib/supabase.ts`.
- **Está prohibido** crear instancias adicionales del cliente en otros archivos.

```typescript
// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

Las capas `api/` importan este cliente; nunca lo recrean.

---

## Variables de entorno

En el frontend **solo** se usan estas variables (prefijo `VITE_` para exponerlas
en el cliente de Vite):

| Variable                 | Uso                                            |
| ------------------------ | ---------------------------------------------- |
| `VITE_SUPABASE_URL`      | URL del proyecto Supabase.                     |
| `VITE_SUPABASE_ANON_KEY` | Clave pública (anon). Segura para el frontend. |

- La `anon key` es pública por diseño; su seguridad depende de que **RLS** esté
  correctamente configurado (ver más abajo).
- La `service_role key` **nunca** entra al frontend ni al repositorio.

---

## Migraciones y tipos de la base de datos

- **No hay CLI de Supabase enlazada localmente** (no existe carpeta `supabase/`
  en el repo). Las migraciones se aplican directo al proyecto remoto (vía MCP,
  herramienta `apply_migration`), no con `supabase migration` local.
- Los tipos se mantienen en `src/lib/database.types.ts`, junto al cliente.
  Se **generan** desde el esquema real (MCP `generate_typescript_types`); **no
  se editan a mano** salvo para pegar ese resultado.
- Cada cambio de esquema (tablas, columnas, relaciones, funciones) implica
  regenerar y actualizar este archivo.
- El cliente se tipa con `createClient<Database>(...)` para que las queries en
  `api/` sean type-safe.
- Después de cada migración: correr los advisors (`security` y `performance`)
  y no dejar warnings nuevos sin revisar a propósito.

---

## RLS (Row Level Security)

- **Toda tabla que almacene datos de aplicación debe tener RLS habilitado.**
- Cada tabla debe tener **políticas explícitas**. Una tabla con RLS habilitado y
  sin políticas queda inaccesible: eso es intencional, no un error a "resolver"
  quitando RLS.

Habilitar RLS:

```sql
alter table public.<tabla> enable row level security;
```

Ejemplo de tabla con RLS y políticas por propietario:

```sql
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.notes enable row level security;

create policy "select_own_notes"
  on public.notes for select
  using ((select auth.uid()) = user_id);

create policy "insert_own_notes"
  on public.notes for insert
  with check ((select auth.uid()) = user_id);

create policy "update_own_notes"
  on public.notes for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "delete_own_notes"
  on public.notes for delete
  using ((select auth.uid()) = user_id);
```

Reglas para las políticas:

- Definir políticas por operación (`select`, `insert`, `update`, `delete`) según
  lo que la tabla realmente necesite.
- **Usar siempre `(select auth.uid())`, nunca `auth.uid()` a secas.** La forma
  sin `select` se re-evalúa por fila y Supabase la marca como warning de
  rendimiento (`auth_rls_initplan`). Ya pasó una vez en este proyecto y tocó
  corregirlo en una migración aparte — hacerlo bien desde el inicio.
- Si la tabla tiene una FK hacia **otra tabla propia del usuario** (no
  `auth.users`), la política de `insert`/`update` debe validar también que la
  fila referenciada pertenezca al mismo usuario — RLS por sí sola solo valida
  el `user_id` de la fila propia, no el dueño de la fila referenciada:

  ```sql
  create policy "insert_own_child_rows"
    on public.child_table for insert
    with check (
      (select auth.uid()) = user_id
      and exists (
        select 1 from public.parent_table p
        where p.id = parent_id and p.user_id = (select auth.uid())
      )
    );
  ```

### Consultar datos sensibles sin exponer la tabla

Para lógica que necesite leer datos sensibles sin exponer la tabla completa
(ej. "¿este email ya tiene contraseña?"), usar una función `security definer`
que devuelva solo lo estrictamente necesario (un booleano, no las columnas):

```sql
create or replace function public.check_something(input text)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (select 1 from auth.users where email = input and ...);
$$;

revoke all on function public.check_something(text) from public;
grant execute on function public.check_something(text) to anon, authenticated;
```

`set search_path = ''` evita el warning de "function search path mutable". Los
warnings de "SECURITY DEFINER function is public/executable" en los advisors
son esperados si la función necesita llamarse sin sesión (ver `anon` arriba) —
no hay que "arreglarlos" quitando el `grant`.

---

## Seguridad

Las siguientes acciones están **prohibidas** en todo el proyecto. Aplican por
igual a desarrolladores y a cualquier asistente de IA:

- ❌ Exponer la `service_role` (en frontend, repositorio, logs o cualquier lugar).
- ❌ Colocar claves privadas en el frontend.
- ❌ Utilizar credenciales de Supabase directamente en componentes.
- ❌ Desactivar RLS para "solucionar" un problema.

Si algo no funciona por RLS, la solución **siempre** es corregir la política,
nunca desactivar RLS.

---

## Relaciones

- Toda relación entre tablas se define con **Foreign Keys reales** en PostgreSQL.
- No se simulan relaciones desde el código de la aplicación.

```sql
alter table public.<tabla_hija>
  add constraint fk_<tabla_hija>_<tabla_padre>
  foreign key (<columna>) references public.<tabla_padre> (id)
  on delete <accion>;
```

- Toda FK debe declarar explícitamente su comportamiento `on delete`
  (`cascade`, `restrict` o `set null`), en coherencia con la política de
  eliminación descrita abajo.

---

## Eliminación de datos

- La eliminación es **física** (hard delete): usamos `DELETE`.
- No se usa borrado lógico (no hay columnas tipo `deleted_at` ni banderas de
  estado para ocultar registros).
- Como los borrados son reales, el comportamiento `on delete` de cada FK debe
  estar pensado para no dejar registros huérfanos ni romper la integridad
  referencial:
  - `on delete cascade` — elimina también los registros dependientes.
  - `on delete restrict` — impide borrar si existen dependientes.
  - `on delete set null` — deja la referencia en `null` (la columna debe permitirlo).

---

## Checklist para nuevas tablas

Antes de dar por terminada una tabla nueva de datos de aplicación:

- [ ] RLS habilitado.
- [ ] Políticas explícitas para las operaciones necesarias, usando `(select auth.uid())`.
- [ ] Si hay FK hacia otra tabla propia del usuario, la política de `insert`/`update` valida también su dueño.
- [ ] Relaciones definidas con Foreign Keys reales.
- [ ] Comportamiento `on delete` definido en cada FK.
- [ ] `database.types.ts` regenerado.
- [ ] Advisors (`security`/`performance`) revisados, sin warnings nuevos sin explicar.
- [ ] Acceso implementado **solo** desde la capa `api/`.
