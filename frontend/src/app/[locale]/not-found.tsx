import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

export default async function NotFound() {
  const t = await getTranslations("common");
  return (
    <div className="container flex flex-col items-center justify-center gap-4 py-24 text-center">
      <p className="text-6xl font-bold text-muted-foreground">404</p>
      <p className="text-lg text-muted-foreground">{t("empty")}</p>
      <Link
        href="/"
        className="inline-flex h-11 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        {t("brand")}
      </Link>
    </div>
  );
}
