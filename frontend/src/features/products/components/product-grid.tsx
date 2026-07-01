import { getTranslations } from "next-intl/server";
import type { ProductDto } from "@/lib/api/types";
import { ProductCard } from "./product-card";

interface Props {
  products: ProductDto[];
  locale: string;
}

export async function ProductGrid({ products, locale }: Props) {
  const t = await getTranslations("common");

  if (products.length === 0) {
    return <p className="py-12 text-center text-muted-foreground">{t("empty")}</p>;
  }

  return (
    <ul className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} locale={locale} />
        </li>
      ))}
    </ul>
  );
}
