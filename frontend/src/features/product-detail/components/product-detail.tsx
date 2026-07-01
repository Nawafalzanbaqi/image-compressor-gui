import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/utils";
import { AddToCartButton } from "@/features/products/components/add-to-cart-button";
import { ProductGrid } from "@/features/products/components/product-grid";
import { getRelatedProducts } from "@/features/products/api/products";
import type { ProductDto } from "@/lib/api/types";

interface Props {
  product: ProductDto;
  locale: string;
}

export async function ProductDetail({ product, locale }: Props) {
  const t = await getTranslations();
  const related = await getRelatedProducts(product);
  const image = product.imageUrls?.[0];

  return (
    <article className="container py-10">
      <Link
        href="/products"
        className="mb-6 inline-block text-sm text-accent hover:underline"
      >
        ← {t("product.backToProducts")}
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : null}
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
          <p className="mt-4 text-2xl font-semibold text-primary">
            {formatMoney(product.price.amount, product.price.currency, locale)}
          </p>
          <div className="mt-3">
            <Badge variant={product.inStock ? "accent" : "secondary"}>
              {product.inStock ? t("common.inStock") : t("common.outOfStock")}
            </Badge>
          </div>

          {product.description ? (
            <div className="mt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {t("product.description")}
              </h2>
              <p className="mt-2 leading-relaxed text-foreground/90">
                {product.description}
              </p>
            </div>
          ) : null}

          <div className="mt-8">
            <AddToCartButton product={product} size="lg" className="w-full sm:w-auto" />
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section aria-labelledby="related-heading" className="mt-16">
          <h2 id="related-heading" className="mb-6 text-2xl font-semibold">
            {t("product.relatedTitle")}
          </h2>
          <ProductGrid products={related} locale={locale} />
        </section>
      ) : null}
    </article>
  );
}
