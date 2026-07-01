import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { buildMetadata, menuItemJsonLd, jsonLdScript } from "@/lib/seo";
import { isRouteEnabled } from "@/config/nav";
import { getMenuItem, allMenuSlugs } from "@/features/menu/api/menu";
import { MenuItemDetail } from "@/features/menu-detail/components/menu-item-detail";
import type { Locale } from "@/i18n/routing";

interface RouteParams {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return allMenuSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = await getMenuItem(slug);
  if (!item) return {};
  return buildMetadata({
    locale: locale as Locale,
    title: item.name,
    description: item.description ?? item.name,
    path: `menu/${item.slug}`,
    images: item.imageUrls,
  });
}

export default async function MenuItemPage({ params }: RouteParams) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  if (!isRouteEnabled("menu")) notFound();

  const item = await getMenuItem(slug);
  if (!item) notFound();

  return (
    <>
      <script {...jsonLdScript(menuItemJsonLd(item))} />
      <MenuItemDetail item={item} locale={locale} />
    </>
  );
}
