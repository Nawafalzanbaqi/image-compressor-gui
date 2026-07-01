import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { buildMetadata, productJsonLd, jsonLdScript } from "@/lib/seo";
import { isRouteEnabled } from "@/config/nav";
import { getProduct } from "@/features/products/api/products";
import { ProductDetail } from "@/features/product-detail/components/product-detail";
import type { Locale } from "@/i18n/routing";

interface RouteParams {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return buildMetadata({
    locale: locale as Locale,
    title: product.name,
    description: product.description ?? product.name,
    path: `products/${product.slug}`,
    images: product.imageUrls,
  });
}

export default async function ProductPage({ params }: RouteParams) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  // Ecommerce-only route: 404 under other verticals (e.g. restaurant).
  if (!isRouteEnabled("products")) notFound();

  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <>
      <script {...jsonLdScript(productJsonLd(product, locale as Locale))} />
      <ProductDetail product={product} locale={locale} />
    </>
  );
}
