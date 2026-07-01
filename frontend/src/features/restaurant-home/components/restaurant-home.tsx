import dynamic from "next/dynamic";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { RestaurantHero } from "@/features/restaurant-hero/components/restaurant-hero";
import { MenuItemCard } from "@/features/menu/components/menu-item-card";
import { getFeaturedMenuItems } from "@/features/menu/api/menu";
import { restaurantJsonLd, jsonLdScript } from "@/lib/seo";
import { branches, restaurantProfile, pick } from "@/content/seeds";

// Below-the-fold sections are lazy-loaded (perf).
const Promotions = dynamic(() =>
  import("@/features/promotions/components/promotions").then((m) => m.Promotions),
);
const BranchLocator = dynamic(() =>
  import("@/features/branches/components/branch-locator").then((m) => m.BranchLocator),
);

interface Props {
  locale: string;
}

/** Restaurant landing: hero + signature dishes + offers + branches + JSON-LD. */
export async function RestaurantHome({ locale }: Props) {
  const t = await getTranslations("restaurantSections");
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
      <BranchLocator headed={false} />
    </>
  );
}
