import { expect, test } from "@playwright/test";
import { mockEmptyData } from "./helpers/mock-supabase";

test.describe("auth", () => {
  test("redirects unauthenticated users to /login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByText("Iniciar sesión")).toBeVisible();
  });

  test("sends a magic link when the email has no password yet", async ({ page }) => {
    await page.route("**/rest/v1/rpc/user_has_password", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: "false" }),
    );
    await page.route("**/auth/v1/otp**", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: "{}" }),
    );

    await page.goto("/login");
    await page.getByLabel("Correo electrónico").fill("nuevo@example.com");
    await page.getByRole("button", { name: "Continuar" }).click();

    await expect(page.getByText("Te enviamos un enlace mágico")).toBeVisible();
  });

  test("asks for a password when the email already has one", async ({ page }) => {
    await mockEmptyData(page);

    await page.goto("/login");
    await page.getByLabel("Correo electrónico").fill("conpassword@example.com");
    await page.getByRole("button", { name: "Continuar" }).click();

    await expect(page.getByLabel("Contraseña")).toBeVisible();
  });
});
