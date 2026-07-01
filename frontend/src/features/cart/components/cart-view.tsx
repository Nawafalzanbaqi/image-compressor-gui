"use client";

import Image from "next/image";
import { Trash2, Minus, Plus } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/card";
import { formatMoney } from "@/lib/utils";
import { useCart } from "../hooks/use-cart";

/** Cart page body (client — reads the cart store). */
export function CartView() {
  const t = useTranslations();
  const locale = useLocale();
  const { lines, subtotal, currency, setQuantity, remove } = useCart();

  if (lines.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-muted-foreground">{t("cart.empty")}</p>
        <Link
          href="/products"
          className="mt-6 inline-flex h-11 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {t("cart.continueShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <ul className="space-y-4 lg:col-span-2">
        {lines.map((line) => (
          <li key={line.productId}>
            <Card className="flex items-center gap-4 p-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
                {line.imageUrl ? (
                  <Image
                    src={line.imageUrl}
                    alt={line.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/products/${line.slug}`}
                  className="line-clamp-1 font-medium hover:text-accent"
                >
                  {line.name}
                </Link>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatMoney(line.unitPrice, line.currency, locale)}
                </p>
                <div className="mt-2 inline-flex items-center rounded-md border border-border">
                  <button
                    type="button"
                    onClick={() => setQuantity(line.productId, line.quantity - 1)}
                    className="p-2 hover:bg-secondary"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" aria-hidden />
                  </button>
                  <span className="min-w-8 text-center text-sm" aria-live="polite">
                    {line.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(line.productId, line.quantity + 1)}
                    className="p-2 hover:bg-secondary"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </div>
              <div className="text-end">
                <p className="font-semibold">
                  {formatMoney(line.unitPrice * line.quantity, currency, locale)}
                </p>
                <button
                  type="button"
                  onClick={() => remove(line.productId)}
                  className="mt-2 inline-flex items-center gap-1 text-sm text-destructive hover:underline"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                  {t("cart.remove")}
                </button>
              </div>
            </Card>
          </li>
        ))}
      </ul>

      <Card className="h-fit p-6">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">{t("cart.subtotal")}</span>
          <span className="text-lg font-semibold">
            {formatMoney(subtotal, currency, locale)}
          </span>
        </div>
        <Link
          href="/checkout"
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-md bg-primary px-8 text-base font-medium text-primary-foreground shadow-soft transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {t("cart.checkout")}
        </Link>
      </Card>
    </div>
  );
}
