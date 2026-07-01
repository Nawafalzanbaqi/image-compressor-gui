"use client";

/**
 * Wishlist store. NOTE: the wishlist feature is gated by the `loyalty` flag in
 * options.json (currently false), so its route/nav are hidden. The code module
 * still exists so the feature can be switched on without new development.
 */
import * as React from "react";

const STORAGE_KEY = "sf.wishlist.v1";

export function useWishlist() {
  const [ids, setIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setIds(JSON.parse(raw) as string[]);
    } catch {
      /* ignore */
    }
  }, []);

  const persist = React.useCallback((next: string[]) => {
    setIds(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = React.useCallback(
    (id: string) =>
      persist(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]),
    [ids, persist],
  );

  return { ids, toggle, has: (id: string) => ids.includes(id) };
}
