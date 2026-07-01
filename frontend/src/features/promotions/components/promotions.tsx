import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Card, CardContent } from "@/components/ui/card";
import { promotions, pick } from "@/content/seeds";

interface Props {
  locale: string;
  headed?: boolean;
}

/** Server component. Promotional offers (content-driven from Payload/seeds). */
export async function Promotions({ locale, headed = true }: Props) {
  const t = await getTranslations("promotions");
  const items = promotions
    .filter((p) => p.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <section aria-labelledby="promotions-heading" className="container py-12">
      {headed ? (
        <header className="mb-8">
          <h1 id="promotions-heading" className="text-3xl font-bold tracking-tight">
            {t("title")}
          </h1>
          <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        </header>
      ) : (
        <h2 id="promotions-heading" className="sr-only">
          {t("title")}
        </h2>
      )}
      <div className="grid gap-6 sm:grid-cols-2">
        {items.map((promo) => (
          <Card key={promo.id} className="overflow-hidden">
            <div className="relative aspect-[16/9] bg-muted">
              <Image
                src={promo.imageUrl}
                alt={pick(promo.title, locale)}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <CardContent className="p-5">
              <h3 className="text-lg font-semibold">{pick(promo.title, locale)}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {pick(promo.description, locale)}
              </p>
              <Link
                href={promo.href}
                className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
              >
                {t("viewMenu")}
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
