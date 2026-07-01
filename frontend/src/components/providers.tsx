"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/features/cart/hooks/use-cart";

/** Client providers mounted once in the locale layout. */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>{children}</CartProvider>
    </SessionProvider>
  );
}
