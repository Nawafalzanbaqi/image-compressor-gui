import Image from "next/image";
import { Link } from "@/i18n/routing";
import { banners, pick } from "@/content/seeds";

interface Props {
  locale: string;
}

/** Promotional banners. Content-driven (Payload Banners collection / seeds). */
export function Banners({ locale }: Props) {
  const visible = banners
    .filter((b) => b.visible)
    .sort((a, b) => a.order - b.order);
  if (visible.length === 0) return null;

  return (
    <section className="container py-16">
      <div className="grid gap-6 md:grid-cols-2">
        {visible.map((banner) => (
          <Link
            key={banner.id}
            href={banner.href}
            className="group relative flex min-h-48 items-center overflow-hidden rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Image
              src={banner.imageUrl}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/10 rtl:bg-gradient-to-l" />
            <div className="relative z-10 p-8 text-white">
              <h3 className="text-2xl font-semibold">
                {pick(banner.title, locale)}
              </h3>
              <p className="mt-2 text-white/90">{pick(banner.subtitle, locale)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
