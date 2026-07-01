"use client";

import { ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useCart } from "../hooks/use-cart";

/** Header cart button with live item count (client leaf). */
export function CartIndicator() {
  const t = useTranslations("nav");
  const { itemCount } = useCart();

  return (
    <Link
      href="/cart"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={t("cart")}
    >
      <ShoppingBag className="h-5 w-5" aria-hidden />
      {itemCount > 0 ? (
        <span
          className="absolute -end-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground"
          aria-hidden
        >
          {itemCount}
        </span>
      ) : null}
      <span className="sr-only">{itemCount}</span>
    </Link>
  );
}
