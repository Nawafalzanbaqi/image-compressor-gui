import type { ReactNode } from "react";

/**
 * Minimal root layout. The real <html>/<body> with lang+dir live in the
 * [locale] layout so they can be locale-aware. This root just passes children
 * through (required by Next's app router).
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
