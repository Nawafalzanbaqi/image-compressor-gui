import Image from "next/image";
import { Link } from "@/i18n/routing";
import { pick } from "@/content/seeds";
import { getHeroSlides } from "../api/hero";

interface Props {
  locale: string;
}

/** Home hero. Content-driven (Payload/CMS or seed fallback), not hardcoded. */
export async function Hero({ locale }: Props) {
  const slides = await getHeroSlides();
  const slide = slides[0];
  if (!slide) return null;

  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[70vh] w-full">
        <Image
          src={slide.imageUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="container relative z-10 flex min-h-[70vh] flex-col justify-end pb-16 pt-24">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-white/80">
            {pick(slide.eyebrow, locale)}
          </p>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight text-white sm:text-5xl">
            {pick(slide.title, locale)}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/90">
            {pick(slide.subtitle, locale)}
          </p>
          <div className="mt-8">
            <Link
              href={slide.ctaHref}
              className="inline-flex h-12 items-center justify-center rounded-md bg-accent px-8 text-base font-medium text-accent-foreground shadow-soft transition-colors hover:bg-accent/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {pick(slide.ctaLabel, locale)}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
