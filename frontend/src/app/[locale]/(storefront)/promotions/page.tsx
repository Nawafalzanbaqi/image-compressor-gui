import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { isRouteEnabled } from "@/config/nav";
import { Promotions } from "@/features/promotions/components/promotions";
import type { Locale } from "@/i18n/routing";

interface RouteParams {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "promotions" });
  return buildMetadata({
    locale: locale as Locale,
    title: t("title"),
    description: t("subtitle"),
    path: "promotions",
  });
}

export default async function PromotionsPage({ params }: RouteParams) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (!isRouteEnabled("promotions")) notFound();

  return <Promotions locale={locale} />;
}
