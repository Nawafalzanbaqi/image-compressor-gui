"use client";

import * as React from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useCart } from "@/features/cart/hooks/use-cart";
import type { ProductDto } from "@/lib/api/types";

interface Props extends Pick<ButtonProps, "variant" | "size" | "className"> {
  product: ProductDto;
  quantity?: number;
}

/** Interactive leaf: adds a product to the client cart with feedback. */
export function AddToCartButton({ product, quantity = 1, ...rest }: Props) {
  const t = useTranslations("product");
  const { add } = useCart();
  const [added, setAdded] = React.useState(false);

  const disabled = !product.inStock;

  function onClick() {
    add(product, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <Button onClick={onClick} disabled={disabled} aria-live="polite" {...rest}>
      {added ? (
        <>
          <Check className="h-4 w-4" aria-hidden />
          {t("addedToCart")}
        </>
      ) : (
        <>
          <ShoppingBag className="h-4 w-4" aria-hidden />
          {t("addToCart")}
        </>
      )}
    </Button>
  );
}
