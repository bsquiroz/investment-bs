import { expect, test } from "@playwright/test";
import { mockEmptyData, mockInsert, signInAs } from "./helpers/mock-supabase";

test.describe("transacciones", () => {
  test.beforeEach(async ({ page }) => {
    await signInAs(page, "e2e-tx-user", "tx@example.com");
    await mockEmptyData(page);
  });

  test("crea una transacción y actualiza el resumen", async ({ page }) => {
    await mockInsert(page, "**/rest/v1/transactions**", (body) => ({
      id: "tx-e2e-1",
      created_at: new Date().toISOString(),
      ...body,
    }));

    await page.goto("/dashboard");
    await expect(page.getByText("Nueva transacción")).toBeVisible();

    await page.locator("#create-amount").fill("50000");
    await page.getByRole("button", { name: "Registrar transacción" }).click();

    await expect(page.getByText("Transacción registrada")).toBeVisible();
    await expect(page.getByText("$ 50.000").first()).toBeVisible();
  });

  test("un ingreso y un gasto calculan el balance correcto", async ({ page }) => {
    let seq = 0;
    await mockInsert(page, "**/rest/v1/transactions**", (body) => {
      seq += 1;
      return { id: `tx-e2e-${seq}`, created_at: new Date().toISOString(), ...body };
    });

    await page.goto("/dashboard");

    await page.locator("#create-amount").fill("100000");
    await page.getByRole("button", { name: "Registrar transacción" }).click();
    await expect(page.getByText("Transacción registrada")).toBeVisible();

    await page.locator('[data-slot="select-trigger"]').click();
    await page.locator('[data-slot="select-item"]', { hasText: "Ingreso" }).click();
    await page.locator("#create-amount").fill("30000");
    await page.getByRole("button", { name: "Registrar transacción" }).click();

    await expect(page.getByText("Balance")).toBeVisible();
    await expect(page.getByText("-$ 70.000")).toBeVisible();
  });
});
