import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { isRouteEnabled } from "@/config/nav";
import { getReservation } from "@/features/reservations/api/reservations";
import { ReservationConfirmation } from "@/features/reservations/components/reservation-confirmation";

interface RouteParams {
  params: Promise<{ locale: string; reference: string }>;
}

export default async function ReservationLookupPage({ params }: RouteParams) {
  const { locale, reference } = await params;
  setRequestLocale(locale);
  if (!isRouteEnabled("reservations")) notFound();

  const reservation = await getReservation(reference);
  if (!reservation) notFound();

  return <ReservationConfirmation reservation={reservation} locale={locale} />;
}
