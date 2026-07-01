import { setRequestLocale } from "next-intl/server";
import { Contact } from "@/features/contact/components/contact";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Contact locale={locale} />;
}
