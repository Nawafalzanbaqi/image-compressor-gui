import { getTranslations } from "next-intl/server";
import { listProducts } from "@/features/products/api/products";
import { ProductGrid } from "@/features/products/components/product-grid";

interface Props {
  query: string;
  locale: string;
}

export async function SearchResults({ query, locale }: Props) {
  const t = await getTranslations("search");
  const result = query
    ? await listProducts({ search: query, pageSize: 24 })
    : { items: [], page: 1, pageSize: 24, totalCount: 0 };

  return (
    <div className="space-y-6">
      {query ? (
        <p className="text-muted-foreground">
          {t("resultsFor")} “{query}” ({result.totalCount})
        </p>
      ) : null}
      {result.items.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          {t("noResults")}
        </p>
      ) : (
        <ProductGrid products={result.items} locale={locale} />
      )}
    </div>
  );
}
