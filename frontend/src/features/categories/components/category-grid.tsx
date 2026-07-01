import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { categoryImages } from "@/content/seeds";
import { listCategories } from "../api/categories";

export async function CategoryGrid() {
  const t = await getTranslations("sections");
  const categories = await listCategories();

  return (
    <section aria-labelledby="categories-heading" className="container py-16">
      <h2
        id="categories-heading"
        className="mb-8 text-2xl font-semibold tracking-tight sm:text-3xl"
      >
        {t("categoriesTitle")}
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className="group relative flex aspect-square items-end overflow-hidden rounded-lg bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {categoryImages[cat.slug] ? (
              <Image
                src={categoryImages[cat.slug] as string}
                alt=""
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="relative z-10 p-4 text-lg font-semibold text-white">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
