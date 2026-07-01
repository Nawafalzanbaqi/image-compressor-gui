import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata, restaurantJsonLd, jsonLdScript } from "@/lib/seo";
import { isRouteEnabled } from "@/config/nav";
import { BranchLocator } from "@/features/branches/components/branch-locator";
import { listBranches } from "@/features/branches/api/branches";
import { restaurantProfile, pick } from "@/content/seeds";
import type { Locale } from "@/i18n/routing";

interface RouteParams {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "branches" });
  return buildMetadata({
    locale: locale as Locale,
    title: t("title"),
    description: t("subtitle"),
    path: "branches",
  });
}

export default async function BranchesPage({ params }: RouteParams) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (!isRouteEnabled("branches")) notFound();

  const branches = await listBranches();
  const jsonLd = restaurantJsonLd({
    name: pick(restaurantProfile.name, locale),
    servesCuisine: restaurantProfile.cuisine,
    priceRange: restaurantProfile.priceRange,
    branches,
  });

  return (
    <>
      <script {...jsonLdScript(jsonLd)} />
      <BranchLocator />
    </>
  );
}
