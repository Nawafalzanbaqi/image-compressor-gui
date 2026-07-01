import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { listProducts } from "../api/products";
import { ProductGrid } from "./product-grid";

interface Props {
  locale: string;
  page: number;
  categorySlug?: string;
  pageSize?: number;
}

/** Paged product listing that reads the API (feature: products listing). */
export async function ProductListing({
  locale,
  page,
  categorySlug,
  pageSize = 12,
}: Props) {
  const t = await getTranslations("common");
  const result = await listProducts({ page, pageSize, categorySlug });
  const totalPages = Math.max(1, Math.ceil(result.totalCount / pageSize));

  const hrefFor = (p: number) =>
    `/products?page=${p}${categorySlug ? `&category=${categorySlug}` : ""}`;

  return (
    <div className="space-y-8">
      <ProductGrid products={result.items} locale={locale} />

      {totalPages > 1 ? (
        <nav
          className="flex items-center justify-center gap-2"
          aria-label="Pagination"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={hrefFor(p)}
              aria-current={p === page ? "page" : undefined}
              className={`inline-flex h-10 min-w-10 items-center justify-center rounded-md border px-3 text-sm ${
                p === page
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:bg-secondary"
              }`}
            >
              {p}
            </Link>
          ))}
        </nav>
      ) : null}

      {result.items.length === 0 ? (
        <p className="text-center text-muted-foreground">{t("empty")}</p>
      ) : null}
    </div>
  );
}
