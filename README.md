# investment-bs

Aplicación personal de finanzas e inversiones: registro de ingresos/gastos y seguimiento de inversiones multi-plataforma (COP/USD), con autenticación por magic link + contraseña.

## Stack

- [React 19](https://react.dev/) + [Vite](https://vite.dev/) + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (sobre [Base UI](https://base-ui.com/))
- [Supabase](https://supabase.com/) — Postgres, Auth, y funciones RPC
- [React Router](https://reactrouter.com/), [date-fns](https://date-fns.org/), [Sonner](https://sonner.emilkowal.ski/) (toasts)

## Funcionalidades

- **Autenticación**: primer ingreso por magic link (verifica que el correo es real) → crear contraseña → logins siguientes solo piden la contraseña. Manejo de enlaces expirados/usados.
- **Finanzas personales**: registro de transacciones (ingreso/gasto) con categoría, descripción y fecha; resumen de balance; editar y eliminar.
- **Inversiones**: plataformas dinámicas (ej. Interactive Broker, Binance) con color asignado automáticamente; movimientos (aporte/retiro) con monto en COP y USD registrados de forma independiente (sin conversión automática); % de participación por plataforma, años invertido, total global; editar y eliminar movimientos y plataformas (eliminar una plataforma borra en cascada sus movimientos).
- **Tema**: modo claro/oscuro + selector de color primario (naranja/rojo/azul), persistidos en `localStorage`.

## Arquitectura

El proyecto sigue una arquitectura por Features (`ui/ · data/ · api/`), documentada en detalle en [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md). Reglas de acceso a datos y RLS en [`docs/database.md`](docs/database.md). Sistema de diseño en [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md).

```text
src/
├── features/
│   ├── auth/            # login (magic link + password), sesión, guardas de ruta
│   ├── transactions/     # finanzas personales
│   └── investments/      # plataformas y movimientos de inversión
├── components/
│   ├── ui/                # componentes shadcn/ui (no editar a mano, se regeneran con el CLI)
│   └── common/             # componentes propios reutilizables entre features
└── lib/                     # cliente de Supabase, tipos generados, utilidades
```

## Requisitos previos

- Node.js 20+
- Un proyecto de [Supabase](https://supabase.com/dashboard) (plan Free es suficiente, ver más abajo)

## Configuración

1. Clonar el repo e instalar dependencias:

   ```bash
   npm install
   ```

2. Copiar `.env.example` a `.env` y completar con los datos de tu proyecto de Supabase (**Project Settings → API**):

   ```bash
   cp .env.example .env
   ```

   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-clave-publica-anon
   ```

   > La `anon key` es pública por diseño — su seguridad depende de que RLS esté bien configurado (ya lo está en el esquema de este proyecto). La `service_role key` nunca debe entrar aquí.

3. Levantar el esquema de base de datos: el esquema (tablas `transactions`, `investment_platforms`, `investment_movements`, RLS y la función `user_has_password`) vive en el proyecto de Supabase, no como migraciones locales en este repo todavía. Para un proyecto nuevo, aplica el esquema descrito en [`docs/database.md`](docs/database.md) desde el SQL Editor del dashboard, o pide que se genere la migración correspondiente.

4. Configurar Supabase Auth (**Authentication** del dashboard):
   - **URL Configuration**: agrega la URL de tu app (ej. `http://localhost:5173/dashboard` en desarrollo) a *Redirect URLs*.
   - **Emails → SMTP Settings**: el servicio de correo incorporado de Supabase es solo para pruebas (límite muy bajo de envíos por hora). Configura un proveedor SMTP propio (ej. [Resend](https://resend.com), tiene plan gratuito) antes de que varias personas usen la app — sin esto, el magic link deja de funcionar rápido por rate limiting.

5. Correr en desarrollo:

   ```bash
   npm run dev
   ```

## Scripts

| Comando            | Descripción                                          |
| ------------------- | ------------------------------------------------------ |
| `npm run dev`      | Servidor de desarrollo (Vite)                        |
| `npm run build`    | Type-check (`tsc -b`) + build de producción          |
| `npm run lint`     | Lint con oxlint                                       |
| `npm run preview`  | Sirve el build de producción localmente               |
| `npm test`         | Tests unitarios (Vitest) — `data/` de cada feature   |
| `npm run test:watch` | Tests unitarios en modo watch                       |
| `npm run e2e`      | Tests end-to-end (Playwright) — arranca `npm run dev` solo si no hay uno corriendo ya |

## Tests

- **Unitarios (Vitest)**: cubren las capas `data/` puras — selectors (cálculos: balance, totales, % de inversión, años) y mappers (row de Supabase ↔ modelo de dominio). Viven junto al código que prueban (`*.test.ts`).
- **End-to-end (Playwright)**: en `e2e/`, cubren los flujos completos por la UI (login con/sin contraseña, CRUD de transacciones e inversiones). No tocan Supabase real — mockean la API con `page.route()` (helpers en `e2e/helpers/mock-supabase.ts`), así que corren rápido y no dependen de datos ni de correo real.

## Git hooks (Husky)

Se instalan solos al correr `npm install` (script `prepare`).

- **pre-commit**: `npm run lint && tsc -b && npm test` — rápido, corre en cada commit local.
- **pre-push**: `npm run e2e` — más lento (levanta la app), corre solo al hacer push.

Si alguno falla, el commit/push se cancela y no queda nada a medias.

## Pendiente antes de producción

- [x] Desplegar — en Netlify (`https://investment-bs.netlify.app`), con `public/_redirects` para que las rutas de React Router no den 404 al recargar.
- [ ] Actualizar Site URL / Redirect URLs de Supabase Auth con el dominio real (el Redirect URL ya se agregó; falta el Site URL, no bloqueante — ver por qué en el historial del proyecto).
- [ ] Flujo de "¿Olvidaste tu contraseña?" (hoy no existe: si alguien pierde su contraseña, queda sin acceso).
- [ ] Code-splitting por ruta (el bundle actual es un solo chunk de ~800KB).
- [ ] Error Boundary a nivel de app.

## Notas de seguridad

- Row Level Security habilitado en todas las tablas; cada usuario solo ve y modifica sus propios datos.
- El cliente de Supabase es único (`src/lib/supabase.ts`) — la UI nunca importa Supabase directamente, siempre pasa por la capa `api/` de cada feature.
- La función `user_has_password` es intencionalmente pública (sin sesión) para poder decidir si el login pide contraseña o envía magic link; nunca revela si un correo existe, solo si tiene contraseña asociada.
