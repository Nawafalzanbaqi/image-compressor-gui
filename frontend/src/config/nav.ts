/**
 * Config-driven navigation — by siteType AND feature flag. `buildNav` returns
 * the nav for the active vertical, EXCLUDING any item whose feature flag is
 * disabled or whose siteType doesn't match. Route rendering consults the same
 * gate (`isRouteEnabled`) so the wrong vertical's routes 404 and never appear
 * in nav. Both functions take an optional siteType (defaults to the active
 * options) so both verticals are unit-testable without env swaps.
 */
import { isFeatureEnabled, options, type FeatureKey, type SiteType } from "./options";

export interface NavItem {
  /** i18n key under the `nav` namespace. */
  key: string;
  /** Path relative to the locale segment, e.g. "/products". */
  href: string;
  /** If set, the item only shows when this feature flag is enabled. */
  feature?: FeatureKey;
  /** If set, the item only shows for this siteType (vertical-specific). */
  siteType?: SiteType;
}

const ALL_NAV_ITEMS: NavItem[] = [
  { key: "home", href: "/" },
  // ── Ecommerce vertical ──
  { key: "products", href: "/products", siteType: "ecommerce" },
  // ── Restaurant vertical ──
  { key: "menu", href: "/menu", siteType: "restaurant" },
  { key: "reserve", href: "/reserve", siteType: "restaurant" },
  { key: "branches", href: "/branches", siteType: "restaurant" },
  { key: "gallery", href: "/gallery", siteType: "restaurant" },
  { key: "promotions", href: "/promotions", siteType: "restaurant" },
  // ── Shared ──
  { key: "about", href: "/about" },
  { key: "faq", href: "/faq" },
  { key: "contact", href: "/contact" },
  // ── Gated features — hidden when their flag is false ──
  { key: "wishlist", href: "/wishlist", feature: "loyalty", siteType: "ecommerce" },
  { key: "reviews", href: "/reviews", feature: "reviews" },
];

/** Nav items visible for the given (or active) siteType + feature config. */
export function buildNav(siteType: SiteType = options.siteType): NavItem[] {
  return ALL_NAV_ITEMS.filter(
    (item) =>
      (!item.siteType || item.siteType === siteType) &&
      (!item.feature || isFeatureEnabled(item.feature)),
  );
}

/**
 * Feature/siteType gate for individual routes. Vertical-specific segments gate
 * on siteType; feature segments gate on their flag. Unlisted routes are shared.
 */
const ROUTE_FEATURE_MAP: Record<string, FeatureKey> = {
  wishlist: "loyalty",
  reviews: "reviews",
  dashboard: "clientDashboard",
};

const ROUTE_SITETYPE_MAP: Record<string, SiteType> = {
  // Ecommerce-only
  products: "ecommerce",
  search: "ecommerce",
  wishlist: "ecommerce",
  // Restaurant-only
  menu: "restaurant",
  reserve: "restaurant",
  reservations: "restaurant",
  branches: "restaurant",
  gallery: "restaurant",
  promotions: "restaurant",
};

export function isRouteEnabled(
  segment: string,
  siteType: SiteType = options.siteType,
): boolean {
  const requiredSiteType = ROUTE_SITETYPE_MAP[segment];
  if (requiredSiteType && requiredSiteType !== siteType) return false;

  const feature = ROUTE_FEATURE_MAP[segment];
  return feature ? isFeatureEnabled(feature) : true;
}
