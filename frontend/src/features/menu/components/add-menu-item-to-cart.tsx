"use client";

import * as React from "react";
import { Plus, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useCart } from "@/features/cart/hooks/use-cart";
import type { MenuItemDto } from "@/lib/api/types";
import { menuItemToProduct } from "../types";

interface Props extends Pick<ButtonProps, "variant" | "size" | "className"> {
  item: MenuItemDto;
  quantity?: number;
}

/** Interactive leaf: adds a menu item to the SHARED client cart via the adapter. */
export function AddMenuItemToCart({ item, quantity = 1, ...rest }: Props) {
  const t = useTranslations("menu");
  const { add } = useCart();
  const [added, setAdded] = React.useState(false);

  function onClick() {
    add(menuItemToProduct(item), quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <Button
      onClick={onClick}
      disabled={!item.isAvailable}
      aria-live="polite"
      {...rest}
    >
      {added ? (
        <>
          <Check className="h-4 w-4" aria-hidden />
          {t("addedToCart")}
        </>
      ) : (
        <>
          <Plus className="h-4 w-4" aria-hidden />
          {t("addToCart")}
        </>
      )}
    </Button>
  );
}
