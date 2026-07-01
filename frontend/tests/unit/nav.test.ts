import { describe, it, expect } from "vitest";
import { buildNav, isRouteEnabled } from "@/config/nav";
import { options } from "@/config/options";

/**
 * Config-driven gating. With options.json shipping reviews:false and
 * loyalty:false, neither should appear in the nav, and their routes must be
 * disabled — while enabled features remain.
 */
describe("config-driven navigation", () => {
  it("loads feature flags from options.json", () => {
    expect(options.features.reviews).toBe(false);
    expect(options.features.loyalty).toBe(false);
    expect(options.features.clientDashboard).toBe(true);
  });

  it("excludes disabled features from the nav", () => {
    const keys = buildNav().map((i) => i.key);
    expect(keys).not.toContain("reviews");
    expect(keys).not.toContain("wishlist");
    expect(keys).toContain("products");
    expect(keys).toContain("about");
  });

  it("disables routes for disabled features but keeps enabled ones", () => {
    expect(isRouteEnabled("reviews")).toBe(false);
    expect(isRouteEnabled("wishlist")).toBe(false);
    expect(isRouteEnabled("dashboard")).toBe(true);
    expect(isRouteEnabled("products")).toBe(true);
  });
});

/**
 * Generalization proof (frontend half). The SAME nav/route config produces a
 * different, correct site per siteType — proving the config-driven pattern holds
 * across verticals, mirroring the backend VerticalRoutingTests.
 */
describe("siteType-driven navigation", () => {
  it("shows restaurant nav for the restaurant vertical and hides ecommerce items", () => {
    const keys = buildNav("restaurant").map((i) => i.key);
    expect(keys).toContain("menu");
    expect(keys).toContain("reserve");
    expect(keys).toContain("branches");
    expect(keys).not.toContain("products");
    expect(keys).not.toContain("wishlist");
  });

  it("shows ecommerce nav for the ecommerce vertical and hides restaurant items", () => {
    const keys = buildNav("ecommerce").map((i) => i.key);
    expect(keys).toContain("products");
    expect(keys).not.toContain("menu");
    expect(keys).not.toContain("reserve");
    expect(keys).not.toContain("branches");
  });

  it("shared items appear in every vertical", () => {
    for (const siteType of ["ecommerce", "restaurant"] as const) {
      const keys = buildNav(siteType).map((i) => i.key);
      expect(keys).toContain("home");
      expect(keys).toContain("about");
      expect(keys).toContain("contact");
    }
  });

  it("gates routes by siteType in both directions", () => {
    // Restaurant routes only under restaurant.
    expect(isRouteEnabled("menu", "restaurant")).toBe(true);
    expect(isRouteEnabled("menu", "ecommerce")).toBe(false);
    expect(isRouteEnabled("branches", "restaurant")).toBe(true);
    expect(isRouteEnabled("branches", "ecommerce")).toBe(false);
    // Ecommerce routes only under ecommerce.
    expect(isRouteEnabled("products", "ecommerce")).toBe(true);
    expect(isRouteEnabled("products", "restaurant")).toBe(false);
  });
});
