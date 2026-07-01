import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { galleryImages, pick } from "@/content/seeds";

interface Props {
  locale: string;
  headed?: boolean;
}

/** Server component. Image gallery (content-driven, next/image, lazy). */
export async function GalleryGrid({ locale, headed = true }: Props) {
  const t = await getTranslations("gallery");
  const images = [...galleryImages].sort((a, b) => a.order - b.order);

  return (
    <section aria-labelledby="gallery-heading" className="container py-12">
      {headed ? (
        <header className="mb-8">
          <h1 id="gallery-heading" className="text-3xl font-bold tracking-tight">
            {t("title")}
          </h1>
          <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        </header>
      ) : (
        <h2 id="gallery-heading" className="sr-only">
          {t("title")}
        </h2>
      )}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {images.map((img) => (
          <div key={img.id} className="relative aspect-square overflow-hidden rounded-md bg-muted">
            <Image
              src={img.imageUrl}
              alt={pick(img.alt, locale)}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
