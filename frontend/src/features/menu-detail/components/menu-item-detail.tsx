import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/utils";
import { getRelatedMenuItems } from "@/features/menu/api/menu";
import { MenuItemCard } from "@/features/menu/components/menu-item-card";
import { AddMenuItemToCart } from "@/features/menu/components/add-menu-item-to-cart";
import type { MenuItemDto } from "@/lib/api/types";

interface Props {
  item: MenuItemDto;
  locale: string;
}

/** Server component. Menu item detail with imagery, price, and add-to-order. */
export async function MenuItemDetail({ item, locale }: Props) {
  const t = await getTranslations("menu");
  const image = item.imageUrls?.[0];
  const related = await getRelatedMenuItems(item);

  return (
    <div className="container py-10">
      <Link href="/menu" className="text-sm text-accent hover:underline">
        ← {t("backToMenu")}
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
          {image ? (
            <Image
              src={image}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : null}
        </div>

        <div>
          <div className="flex flex-wrap gap-2">
            {item.isVegetarian ? <Badge variant="secondary">{t("vegetarian")}</Badge> : null}
            {item.isSpicy ? <Badge variant="secondary">{t("spicy")}</Badge> : null}
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">{item.name}</h1>
          <p className="mt-3 text-xl font-semibold text-primary">
            {formatMoney(item.price.amount, item.price.currency, locale)}
          </p>
          {item.description ? (
            <p className="mt-4 leading-relaxed text-muted-foreground">{item.description}</p>
          ) : null}
          <div className="mt-8">
            <AddMenuItemToCart item={item} size="lg" />
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section aria-labelledby="related-heading" className="mt-16">
          <h2 id="related-heading" className="mb-6 text-2xl font-semibold tracking-tight">
            {t("relatedTitle")}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((r) => (
              <MenuItemCard key={r.id} item={r} locale={locale} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
