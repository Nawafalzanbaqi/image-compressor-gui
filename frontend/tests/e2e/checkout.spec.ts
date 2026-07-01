import { test, expect } from "@playwright/test";

/**
 * Happy-path e2e: home -> product -> add to cart -> checkout -> place order.
 * Runs against the dev/prod server (see playwright.config.ts webServer). The
 * checkout server action falls back to a synthetic order when the backend is
 * offline, so this passes without the .NET API running.
 */
test("customer can complete checkout", async ({ page }) => {
  // Home (English locale).
  await page.goto("/en");
  await expect(page).toHaveTitle(/./);

  // Go to the shop and open the first product.
  await page.goto("/en/products");
  const firstProduct = page.getByRole("heading", { level: 3 }).first();
  await expect(firstProduct).toBeVisible();

  // Open a known in-stock product detail directly.
  await page.goto("/en/products/merino-wool-sweater");
  await expect(
    page.getByRole("heading", { name: /merino wool sweater/i }),
  ).toBeVisible();

  // Add to cart.
  await page.getByRole("button", { name: /add to cart/i }).first().click();

  // Go to checkout.
  await page.goto("/en/checkout");
  await expect(page.getByRole("heading", { name: /checkout/i })).toBeVisible();

  // Fill the form.
  await page.getByLabel(/full name/i).fill("Test Customer");
  await page.getByLabel(/email address/i).fill("test@example.com");
  await page.getByLabel(/shipping address/i).fill("123 King Fahd Rd, Riyadh");

  // Place the order.
  await page.getByRole("button", { name: /place order/i }).click();

  // Confirmation with an order number appears.
  await expect(page.getByText(/order number/i)).toBeVisible({ timeout: 15_000 });
});
