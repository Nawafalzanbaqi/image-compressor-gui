import { test, expect } from "@playwright/test";

/**
 * Happy-path e2e for the RESTAURANT vertical: home -> menu -> add item to cart
 * -> reserve a table -> confirmation. Runs against a restaurant-built app
 * (options.json siteType=restaurant). The reservation server action falls back
 * to a synthetic confirmation when the backend is offline, so this passes
 * without the .NET API running.
 *
 * NOTE: assumes the app was built/started with the restaurant vertical active
 * (the CI Lighthouse matrix builds each vertical). Under an ecommerce build the
 * restaurant routes 404 by design.
 */
test("guest can browse the menu, add to cart, and reserve a table", async ({ page }) => {
  // Home (English locale).
  await page.goto("/en");
  await expect(page).toHaveTitle(/./);

  // Open the menu and a known dish.
  await page.goto("/en/menu");
  await expect(page.getByRole("heading", { name: /menu/i }).first()).toBeVisible();

  await page.goto("/en/menu/grilled-kofta");
  await expect(page.getByRole("heading", { name: /grilled kofta/i })).toBeVisible();

  // Add the dish to the order.
  await page.getByRole("button", { name: /add to order/i }).first().click();

  // Reserve a table.
  await page.goto("/en/reserve");
  await expect(page.getByRole("heading", { name: /reserve a table/i })).toBeVisible();

  await page.getByLabel(/full name/i).fill("Test Guest");
  await page.getByLabel(/phone number/i).fill("0500000000");
  await page.getByLabel(/party size/i).fill("4");
  // datetime-local: a near-future value.
  await page.getByLabel(/date & time/i).fill("2030-01-01T20:00");

  await page.getByRole("button", { name: /request reservation/i }).click();

  // Confirmation with a reference appears.
  await expect(page.getByText(/reference/i)).toBeVisible({ timeout: 15_000 });
});
