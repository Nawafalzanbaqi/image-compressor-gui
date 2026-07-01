import { setRequestLocale } from "next-intl/server";
import { Faq } from "@/features/faq/components/faq";

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Faq locale={locale} />;
}
