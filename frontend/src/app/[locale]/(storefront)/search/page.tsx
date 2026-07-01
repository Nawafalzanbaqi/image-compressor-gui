import { getTranslations, setRequestLocale } from "next-intl/server";
import { SearchBox } from "@/features/search/components/search-box";
import { SearchResults } from "@/features/search/components/search-results";

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  const { q = "" } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("search");

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">{t("title")}</h1>
      <div className="mb-8 max-w-lg">
        <SearchBox defaultValue={q} autoFocus />
      </div>
      <SearchResults query={q} locale={locale} />
    </div>
  );
}
