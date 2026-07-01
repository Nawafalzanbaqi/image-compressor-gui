/**
 * Config-driven build. The single source of truth is the shared root
 * `options.json`. It is imported directly (JSON module) so this file is
 * ISOMORPHIC — safe in Server Components, Client Components, the Edge
 * middleware, and tests alike (no `node:fs`, which cannot be bundled for the
 * browser/edge).
 *
 * Docker runtime override: when the file is mounted at a different path
 * (Factory__OptionsPath=/app/options.json), use the server-only resolver in
 * `options.server.ts` from Server Components that need the mounted copy. For
 * feature flags — which are baked at build time — this import is authoritative.
 */
import optionsJson from "../../../options.json";

export type SiteType = "ecommerce" | "restaurant" | "corporate" | "blog";
export type Direction = "rtl" | "ltr";

export interface Options {
  siteType: SiteType;
  language: string; // e.g. "ar-en"
  defaultDirection: Direction;
  payments: string[];
  integrations: string[];
  features: {
    clientDashboard: boolean;
    cms: boolean;
    reviews: boolean;
    loyalty: boolean;
    analytics: boolean;
  };
  designDirection: string;
}

export const options: Options = optionsJson as Options;

export type FeatureKey = keyof Options["features"];

export function isFeatureEnabled(feature: FeatureKey): boolean {
  return options.features[feature] === true;
}

/** True when the site should default to RTL (Arabic-first). */
export const isRtlDefault = options.defaultDirection === "rtl";
