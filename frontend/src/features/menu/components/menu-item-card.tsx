import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/utils";
import type { MenuItemDto } from "@/lib/api/types";
import { AddMenuItemToCart } from "./add-menu-item-to-cart";

interface Props {
  item: MenuItemDto;
  locale: string;
}

/** Server component. Menu dish card with dietary badges + client add-to-order. */
export async function MenuItemCard({ item, locale }: Props) {
  const t = await getTranslations("menu");
  const image = item.imageUrls?.[0];

  return (
    <Card className="group flex flex-col overflow-hidden transition-shadow hover:shadow-card">
      <Link
        href={`/menu/${item.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-muted"
        aria-label={item.name}
      >
        {image ? (
          <Image
            src={image}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
        <div className="absolute start-3 top-3 flex gap-2">
          {item.isVegetarian ? <Badge variant="secondary">{t("vegetarian")}</Badge> : null}
          {item.isSpicy ? <Badge variant="secondary">{t("spicy")}</Badge> : null}
          {!item.isAvailable ? <Badge variant="secondary">{t("unavailable")}</Badge> : null}
        </div>
      </Link>
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex-1">
          <Link href={`/menu/${item.slug}`}>
            <h3 className="line-clamp-1 font-medium leading-tight hover:text-accent">
              {item.name}
            </h3>
          </Link>
          {item.description ? (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {item.description}
            </p>
          ) : null}
          <p className="mt-2 text-sm font-semibold text-primary">
            {formatMoney(item.price.amount, item.price.currency, locale)}
          </p>
        </div>
        <AddMenuItemToCart item={item} size="sm" variant="outline" className="w-full" />
      </CardContent>
    </Card>
  );
}
