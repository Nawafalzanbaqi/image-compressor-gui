import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/utils";
import type { ProductDto } from "@/lib/api/types";
import { AddToCartButton } from "./add-to-cart-button";

interface Props {
  product: ProductDto;
  locale: string;
}

/**
 * Server component. Renders product imagery + price; the add-to-cart action is
 * a client leaf. Uses next/image for AVIF/WebP + responsive sizing.
 */
export async function ProductCard({ product, locale }: Props) {
  const t = await getTranslations("common");
  const image = product.imageUrls?.[0];

  return (
    <Card className="group flex flex-col overflow-hidden transition-shadow hover:shadow-card">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-muted"
        aria-label={product.name}
      >
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            {t("empty")}
          </div>
        )}
        {!product.inStock ? (
          <Badge variant="secondary" className="absolute start-3 top-3">
            {t("outOfStock")}
          </Badge>
        ) : null}
      </Link>
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex-1">
          <Link href={`/products/${product.slug}`}>
            <h3 className="line-clamp-1 font-medium leading-tight hover:text-accent">
              {product.name}
            </h3>
          </Link>
          <p className="mt-1 text-sm font-semibold text-primary">
            {formatMoney(product.price.amount, product.price.currency, locale)}
          </p>
        </div>
        <AddToCartButton
          product={product}
          size="sm"
          variant="outline"
          className="w-full"
        />
      </CardContent>
    </Card>
  );
}
