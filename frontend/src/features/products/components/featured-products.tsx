import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { listProducts } from "../api/products";
import { ProductGrid } from "./product-grid";

interface Props {
  locale: string;
}

export async function FeaturedProducts({ locale }: Props) {
  const t = await getTranslations();
  const page = await listProducts({ page: 1, pageSize: 4 });

  return (
    <section aria-labelledby="featured-heading" className="container py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2
            id="featured-heading"
            className="text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            {t("sections.featuredTitle")}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {t("sections.featuredSubtitle")}
          </p>
        </div>
        <Link
          href="/products"
          className="shrink-0 text-sm font-medium text-accent hover:underline"
        >
          {t("common.viewAll")}
        </Link>
      </div>
      <ProductGrid products={page.items} locale={locale} />
    </section>
  );
}
