import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { CartProvider } from "@/features/cart/hooks/use-cart";
import { AddToCartButton } from "@/features/products/components/add-to-cart-button";
import { formatMoney } from "@/lib/utils";
import messages from "@/i18n/messages/en.json";
import type { ProductDto } from "@/lib/api/types";

const product: ProductDto = {
  id: "p1",
  slug: "merino-wool-sweater",
  name: "Merino Wool Sweater",
  price: { amount: 349, currency: "SAR" },
  inStock: true,
};

function renderWithProviders(ui: React.ReactNode) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <CartProvider>{ui}</CartProvider>
    </NextIntlClientProvider>,
  );
}

describe("product presentation", () => {
  it("formats money with the currency", () => {
    const formatted = formatMoney(349, "SAR", "en");
    expect(formatted).toMatch(/349/);
    expect(formatted).toMatch(/SAR|ر\.س|SR/);
  });

  it("renders an enabled add-to-cart action for an in-stock product", () => {
    renderWithProviders(<AddToCartButton product={product} />);
    const button = screen.getByRole("button", { name: /add to cart/i });
    expect(button).toBeEnabled();
  });

  it("disables add-to-cart for an out-of-stock product", () => {
    renderWithProviders(
      <AddToCartButton product={{ ...product, inStock: false }} />,
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
