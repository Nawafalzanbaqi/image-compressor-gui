import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { ProductListing } from "@/features/products/components/product-listing";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return buildMetadata({
    locale: locale as Locale,
    title: t("products"),
    description: "Browse the full collection.",
    path: "products",
  });
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const { locale } = await params;
  const { page: pageParam, category } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "nav" });
  const page = Math.max(1, Number(pageParam) || 1);

  return (
    <div className="container py-10">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">{t("products")}</h1>
      <ProductListing locale={locale} page={page} categorySlug={category} />
    </div>
  );
}
