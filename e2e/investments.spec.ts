import { expect, test } from "@playwright/test";
import { mockEmptyData, mockInsert, signInAs } from "./helpers/mock-supabase";

test.describe("inversiones", () => {
  test.beforeEach(async ({ page }) => {
    await signInAs(page, "e2e-inv-user", "inv@example.com");
    await mockEmptyData(page);

    let platformSeq = 0;
    await mockInsert(page, "**/rest/v1/investment_platforms**", (body) => {
      platformSeq += 1;
      return { id: `plat-e2e-${platformSeq}`, created_at: new Date().toISOString(), ...body };
    });

    let movementSeq = 0;
    await mockInsert(page, "**/rest/v1/investment_movements**", (body) => {
      movementSeq += 1;
      return { id: `mov-e2e-${movementSeq}`, created_at: new Date().toISOString(), ...body };
    });
  });

  test("crea una plataforma y un aporte, actualizando el % y los totales", async ({ page }) => {
    await page.goto("/investments");

    await page.getByRole("button", { name: "Nueva plataforma" }).click();
    await page.getByLabel("Nombre").fill("Interactive Broker");
    await page.getByRole("button", { name: "Crear plataforma" }).click();
    await expect(page.getByText("Interactive Broker")).toBeVisible();

    await page.getByRole("button", { name: "Movimiento", exact: true }).click();
    await page.locator("#create-amount-cop").fill("8000000");
    await page.locator("#create-amount-usd").fill("2000");
    await page.getByRole("button", { name: "Registrar movimiento" }).click();

    await expect(page.getByText("100%")).toBeVisible();
    await expect(page.getByText("$ 8.000.000").first()).toBeVisible();
  });

  test("un retiro resta de los totales de la plataforma", async ({ page }) => {
    await page.goto("/investments");

    await page.getByRole("button", { name: "Nueva plataforma" }).click();
    await page.getByLabel("Nombre").fill("Binance");
    await page.getByRole("button", { name: "Crear plataforma" }).click();

    await page.getByRole("button", { name: "Movimiento", exact: true }).click();
    await page.locator("#create-amount-cop").fill("1000000");
    await page.locator("#create-amount-usd").fill("250");
    await page.getByRole("button", { name: "Registrar movimiento" }).click();
    await expect(page.getByText("$ 1.000.000").first()).toBeVisible();

    await page.getByRole("button", { name: "Movimiento", exact: true }).click();
    await page.locator('[data-slot="select-trigger"]').click();
    await page.locator('[data-slot="select-item"]', { hasText: "Retiro" }).click();
    await page.locator("#create-amount-cop").fill("400000");
    await page.locator("#create-amount-usd").fill("100");
    await page.getByRole("button", { name: "Registrar movimiento" }).click();

    await expect(page.getByText("$ 600.000").first()).toBeVisible();
  });
});
