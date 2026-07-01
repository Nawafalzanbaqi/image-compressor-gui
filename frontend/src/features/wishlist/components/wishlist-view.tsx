import { getTranslations } from "next-intl/server";

/**
 * Wishlist view. Gated by the `loyalty` feature flag; only rendered when the
 * route is enabled. Kept minimal — full product hydration is phase-2.
 */
export async function WishlistView() {
  const t = await getTranslations("wishlist");
  return (
    <div className="py-16 text-center">
      <p className="text-lg text-muted-foreground">{t("empty")}</p>
    </div>
  );
}
