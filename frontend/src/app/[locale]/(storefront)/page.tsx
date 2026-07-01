import dynamic from "next/dynamic";
import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/features/hero/components/hero";
import { CategoryGrid } from "@/features/categories/components/category-grid";
import { FeaturedProducts } from "@/features/products/components/featured-products";

// Below-the-fold banners are lazy-loaded (perf).
const Banners = dynamic(() =>
  import("@/features/banners/components/banners").then((m) => m.Banners),
);

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero locale={locale} />
      <CategoryGrid />
      <FeaturedProducts locale={locale} />
      <Banners locale={locale} />
    </>
  );
}
