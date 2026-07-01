import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { isRouteEnabled } from "@/config/nav";
import { MenuListing } from "@/features/menu/components/menu-listing";
import type { Locale } from "@/i18n/routing";

interface RouteParams {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "menu" });
  return buildMetadata({
    locale: locale as Locale,
    title: t("title"),
    description: t("subtitle"),
    path: "menu",
  });
}

export default async function MenuPage({ params }: RouteParams) {
  const { locale } = await params;
  setRequestLocale(locale);
  // Config-driven vertical gate: menu exists only for the restaurant siteType.
  if (!isRouteEnabled("menu")) notFound();

  return <MenuListing locale={locale} />;
}
