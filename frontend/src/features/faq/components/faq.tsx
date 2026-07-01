import { getTranslations } from "next-intl/server";
import { faqs, pick } from "@/content/seeds";

interface Props {
  locale: string;
}

/** FAQ accordion. Content-driven (Payload Faq collection / seeds). */
export async function Faq({ locale }: Props) {
  const t = await getTranslations("faq");
  const items = faqs.filter((f) => f.visible).sort((a, b) => a.order - b.order);

  return (
    <section className="container max-w-3xl py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">{t("title")}</h1>
      <div className="space-y-3">
        {items.map((item) => (
          <details
            key={item.id}
            className="group rounded-lg border border-border bg-card p-4 open:shadow-soft"
          >
            <summary className="cursor-pointer list-none font-medium marker:content-none">
              <span className="flex items-center justify-between gap-4">
                {pick(item.question, locale)}
                <span
                  className="text-muted-foreground transition-transform group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </span>
            </summary>
            <p className="mt-3 text-muted-foreground">{pick(item.answer, locale)}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
