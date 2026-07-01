/**
 * Config-driven navigation. `buildNav` returns nav items EXCLUDING any whose
 * feature flag is disabled in options.json. Route rendering consults the same
 * gate (see `isRouteEnabled`) so disabled features 404 and never appear in nav.
 */
import { isFeatureEnabled, type FeatureKey } from "./options";

export interface NavItem {
  /** i18n key under the `nav` namespace. */
  key: string;
  /** Path relative to the locale segment, e.g. "/products". */
  href: string;
  /** If set, the item only shows when this feature flag is enabled. */
  feature?: FeatureKey;
}

const ALL_NAV_ITEMS: NavItem[] = [
  { key: "home", href: "/" },
  { key: "products", href: "/products" },
  { key: "about", href: "/about" },
  { key: "faq", href: "/faq" },
  { key: "contact", href: "/contact" },
  // Gated features — hidden when their flag is false.
  { key: "wishlist", href: "/wishlist", feature: "loyalty" },
  { key: "reviews", href: "/reviews", feature: "reviews" },
];

/** Nav items visible for the current config (feature-gated). */
export function buildNav(): NavItem[] {
  return ALL_NAV_ITEMS.filter(
    (item) => !item.feature || isFeatureEnabled(item.feature),
  );
}

/**
 * Feature gate for individual routes. Maps a route segment to the flag that
 * must be enabled. Routes not listed are always enabled.
 */
const ROUTE_FEATURE_MAP: Record<string, FeatureKey> = {
  wishlist: "loyalty",
  reviews: "reviews",
  dashboard: "clientDashboard",
};

export function isRouteEnabled(segment: string): boolean {
  const feature = ROUTE_FEATURE_MAP[segment];
  return feature ? isFeatureEnabled(feature) : true;
}
