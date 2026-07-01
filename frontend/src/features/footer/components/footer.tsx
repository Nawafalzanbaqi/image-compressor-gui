import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { footerColumns, pick } from "@/content/seeds";

interface Props {
  locale: string;
}

/** Site footer. Columns/links are content-driven (Payload Footer / seeds). */
export async function Footer({ locale }: Props) {
  const t = await getTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-bold">{t("common.brand")}</p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            {t("footer.tagline")}
          </p>
        </div>
        {footerColumns.map((col, i) => (
          <nav key={i} aria-label={pick(col.heading, locale)}>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {pick(col.heading, locale)}
            </h2>
            <ul className="space-y-2">
              {col.links.map((link, j) => (
                <li key={j}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/80 hover:text-foreground hover:underline"
                  >
                    {pick(link.label, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="container flex h-14 items-center text-xs text-muted-foreground">
          © {year} {t("common.brand")}. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
