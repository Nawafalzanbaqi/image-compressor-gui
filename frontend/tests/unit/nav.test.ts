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
