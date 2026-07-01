import { getTranslations } from "next-intl/server";
import { getMenu } from "../api/menu";
import { MenuItemCard } from "./menu-item-card";

interface Props {
  locale: string;
}

/** Server component. Renders the full menu grouped by ordered categories. */
export async function MenuListing({ locale }: Props) {
  const t = await getTranslations("menu");
  const menu = await getMenu();
  const categories = [...menu.categories].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0),
  );

  return (
    <div className="container py-10">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      </header>

      <div className="space-y-14">
        {categories.map((category) => (
          <section key={category.id} aria-labelledby={`cat-${category.slug}`}>
            <h2
              id={`cat-${category.slug}`}
              className="mb-6 text-2xl font-semibold tracking-tight"
            >
              {category.name}
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {category.items.map((item) => (
                <MenuItemCard key={item.id} item={item} locale={locale} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
