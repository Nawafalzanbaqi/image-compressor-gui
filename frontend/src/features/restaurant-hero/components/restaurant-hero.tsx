import Image from "next/image";
import { Link } from "@/i18n/routing";
import { restaurantHeroSlides, pick } from "@/content/seeds";

interface Props {
  locale: string;
}

/** Server component. Restaurant landing hero (content-driven from Payload/seeds). */
export function RestaurantHero({ locale }: Props) {
  const slide = restaurantHeroSlides.filter((s) => s.visible).sort((a, b) => a.order - b.order)[0];
  if (!slide) return null;

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src={slide.imageUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
      </div>
      <div className="container flex min-h-[70vh] flex-col items-start justify-center py-24 text-white">
        <p className="text-sm font-medium uppercase tracking-widest text-white/80">
          {pick(slide.eyebrow, locale)}
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
          {pick(slide.title, locale)}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-white/90">{pick(slide.subtitle, locale)}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={slide.ctaHref}
            className="inline-flex h-12 items-center rounded-md bg-white px-8 text-sm font-semibold text-black hover:bg-white/90"
          >
            {pick(slide.ctaLabel, locale)}
          </Link>
          <Link
            href="/reserve"
            className="inline-flex h-12 items-center rounded-md border border-white/60 px-8 text-sm font-semibold text-white hover:bg-white/10"
          >
            {pick({ en: "Reserve a table", ar: "احجز طاولة" }, locale)}
          </Link>
        </div>
      </div>
    </section>
  );
}
