import fs from "node:fs";
import path from "node:path";
import type { Page } from "@playwright/test";

function readEnvValue(key: string): string {
  const envPath = path.resolve(process.cwd(), ".env");
  const content = fs.readFileSync(envPath, "utf-8");
  const match = content.match(new RegExp(`^${key}=(.*)$`, "m"));
  if (!match) throw new Error(`${key} no está definido en .env`);
  return match[1].trim();
}

function getSupabaseProjectRef(): string {
  const url = readEnvValue("VITE_SUPABASE_URL");
  const match = url.match(/https:\/\/([a-z0-9]+)\.supabase\.co/);
  if (!match) throw new Error(`No se pudo extraer el project ref de VITE_SUPABASE_URL: ${url}`);
  return match[1];
}

function base64UrlEncode(value: string): string {
  return Buffer.from(value).toString("base64");
}

export function fakeUser(id: string, email: string, hasPassword = true) {
  return {
    id,
    email,
    app_metadata: {},
    user_metadata: { has_password: hasPassword },
    aud: "authenticated",
    created_at: new Date().toISOString(),
  };
}

export function fakeSession(userId: string, email: string, hasPassword = true) {
  const now = Math.floor(Date.now() / 1000);
  const payload = base64UrlEncode(
    JSON.stringify({ sub: userId, email, exp: now + 3600, role: "authenticated" }),
  );
  const jwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${payload}.sig`;

  return {
    access_token: jwt,
    token_type: "bearer",
    expires_in: 3600,
    expires_at: now + 3600,
    refresh_token: "fake-refresh-token",
    user: fakeUser(userId, email, hasPassword),
  };
}

/** Escribe una sesión falsa en localStorage, como si el usuario ya hubiera iniciado sesión. */
export async function signInAs(page: Page, userId: string, email: string, hasPassword = true) {
  const projectRef = getSupabaseProjectRef();
  const session = fakeSession(userId, email, hasPassword);

  await page.addInitScript(
    ({ storageKey, session }) => {
      window.localStorage.setItem(storageKey, JSON.stringify(session));
    },
    { storageKey: `sb-${projectRef}-auth-token`, session },
  );
}

/**
 * Mockea las tablas de la app para que respondan vacío por defecto.
 * Los tests pueden sobreescribir rutas específicas después de llamar esto.
 */
export async function mockEmptyData(page: Page) {
  await page.route("**/rest/v1/rpc/user_has_password", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: "true" }),
  );

  for (const table of ["transactions", "investment_platforms", "investment_movements"]) {
    await page.route(`**/rest/v1/${table}**`, (route) => {
      if (route.request().method() === "GET") {
        return route.fulfill({ status: 200, contentType: "application/json", body: "[]" });
      }
      return route.fallback();
    });
  }
}

/** Mockea un POST/insert devolviendo el body enviado más los campos generados por la DB. */
export async function mockInsert(
  page: Page,
  urlGlob: string,
  makeRow: (body: Record<string, unknown>) => Record<string, unknown>,
) {
  await page.route(urlGlob, (route) => {
    if (route.request().method() !== "POST") return route.fallback();
    const body = JSON.parse(route.request().postData() || "{}");
    return route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify(makeRow(body)),
    });
  });
}
