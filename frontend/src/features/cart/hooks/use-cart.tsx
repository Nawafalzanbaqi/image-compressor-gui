"use client";

import * as React from "react";
import type { ProductDto } from "@/lib/api/types";

/**
 * Client-side cart. Persisted in localStorage so it survives reloads. On
 * checkout the backend is the source of truth (POST /api/orders); this store
 * models the pre-checkout selection. A real backend cart (POST
 * /api/cart/{id}/items) can be synced here in phase-2.
 *
 * TODO(phase-2): sync with server cart (/api/cart/{cartId}) + Redis-backed
 * session cart id from a cookie.
 */
export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  unitPrice: number;
  currency: string;
  quantity: number;
  imageUrl?: string;
}

interface CartContextValue {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  currency: string;
  add: (product: ProductDto, quantity?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = React.createContext<CartContextValue | null>(null);
const STORAGE_KEY = "sf.cart.v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = React.useState<CartLine[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, hydrated]);

  const add = React.useCallback((product: ProductDto, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === product.id);
      if (existing) {
        return prev.map((l) =>
          l.productId === product.id
            ? { ...l, quantity: l.quantity + quantity }
            : l,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          unitPrice: product.price.amount,
          currency: product.price.currency,
          quantity,
          imageUrl: product.imageUrls?.[0],
        },
      ];
    });
  }, []);

  const remove = React.useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const setQuantity = React.useCallback((productId: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.productId !== productId)
        : prev.map((l) =>
            l.productId === productId ? { ...l, quantity } : l,
          ),
    );
  }, []);

  const clear = React.useCallback(() => setLines([]), []);

  const value = React.useMemo<CartContextValue>(() => {
    const itemCount = lines.reduce((n, l) => n + l.quantity, 0);
    const subtotal = lines.reduce((n, l) => n + l.unitPrice * l.quantity, 0);
    return {
      lines,
      itemCount,
      subtotal,
      currency: lines[0]?.currency ?? "SAR",
      add,
      remove,
      setQuantity,
      clear,
    };
  }, [lines, add, remove, setQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
