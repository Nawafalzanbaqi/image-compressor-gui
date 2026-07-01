import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { isRouteEnabled } from "@/config/nav";
import { listBranches } from "@/features/branches/api/branches";
import { ReservationForm } from "@/features/reservations/components/reservation-form";
import type { Locale } from "@/i18n/routing";

interface RouteParams {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "reservation" });
  return buildMetadata({
    locale: locale as Locale,
    title: t("title"),
    description: t("subtitle"),
    path: "reserve",
  });
}

export default async function ReservePage({ params }: RouteParams) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (!isRouteEnabled("reserve")) notFound();

  const t = await getTranslations("reservation");
  const branches = await listBranches();

  return (
    <div className="container py-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      </header>
      <ReservationForm branches={branches} />
    </div>
  );
}
