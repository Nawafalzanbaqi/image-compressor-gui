import dynamic from "next/dynamic";
import { getTranslations } from "next-intl/server";
import { MapPin } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Card, CardContent } from "@/components/ui/card";
import { RestaurantHero } from "@/features/restaurant-hero/components/restaurant-hero";
import { MenuItemCard } from "@/features/menu/components/menu-item-card";
import { getFeaturedMenuItems } from "@/features/menu/api/menu";
import { restaurantJsonLd, jsonLdScript } from "@/lib/seo";
import { branches, restaurantProfile, pick } from "@/content/seeds";

// Below-the-fold offers are lazy-loaded (perf). The branch MAP (heavy OSM
// iframes) lives on /branches; the home only shows a lightweight teaser so the
// landing page stays fast (Lighthouse performance gate).
const Promotions = dynamic(() =>
  import("@/features/promotions/components/promotions").then((m) => m.Promotions),
);

interface Props {
  locale: string;
}

/** Restaurant landing: hero + signature dishes + offers + branch teaser + JSON-LD. */
export async function RestaurantHome({ locale }: Props) {
  const t = await getTranslations("restaurantSections");
  const tb = await getTranslations("branches");
  const featured = await getFeaturedMenuItems(4);

  const jsonLd = restaurantJsonLd({
    name: pick(restaurantProfile.name, locale),
    servesCuisine: restaurantProfile.cuisine,
    priceRange: restaurantProfile.priceRange,
    branches,
  });

  return (
    <>
      <script {...jsonLdScript(jsonLd)} />
      <RestaurantHero locale={locale} />

      <section aria-labelledby="signature-heading" className="container py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2
              id="signature-heading"
              className="text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              {t("featuredTitle")}
            </h2>
            <p className="mt-2 text-muted-foreground">{t("featuredSubtitle")}</p>
          </div>
          <Link href="/menu" className="shrink-0 text-sm font-medium text-accent hover:underline">
            {pick({ en: "Full menu", ar: "القائمة كاملة" }, locale)}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {featured.map((item) => (
            <MenuItemCard key={item.id} item={item} locale={locale} />
          ))}
        </div>
      </section>

      <Promotions locale={locale} headed={false} />

      {/* Lightweight branch teaser (no maps here — full locator on /branches). */}
      <section aria-labelledby="branches-heading" className="container py-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 id="branches-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("branchesTitle")}
          </h2>
          <Link href="/branches" className="shrink-0 text-sm font-medium text-accent hover:underline">
            {tb("title")}
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {branches.map((branch) => (
            <Card key={branch.id}>
              <CardContent className="flex items-start gap-3 p-5">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                <div>
                  <h3 className="font-semibold">{branch.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {branch.address}, {branch.city}
                  </p>
                  {branch.openingHours ? (
                    <p className="mt-1 text-sm text-muted-foreground">{branch.openingHours}</p>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
