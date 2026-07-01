import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import type { ReservationDto } from "@/lib/api/types";

interface Props {
  reservation: ReservationDto;
  locale: string;
}

/** Server component. Reservation lookup / confirmation view. */
export async function ReservationConfirmation({ reservation, locale }: Props) {
  const t = await getTranslations("reservation");
  const when = new Date(reservation.reservationAtUtc ?? "");
  const formatted = Number.isNaN(when.getTime())
    ? ""
    : new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(when);

  return (
    <div className="container py-10">
      <Card className="mx-auto max-w-lg p-8">
        <h1 className="text-2xl font-bold tracking-tight">{t("lookupTitle")}</h1>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">{t("reference")}</dt>
            <dd className="font-mono font-semibold">{reservation.referenceNumber}</dd>
          </div>
          {reservation.customerName ? (
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">{t("name")}</dt>
              <dd>{reservation.customerName}</dd>
            </div>
          ) : null}
          {reservation.partySize ? (
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">{t("partySize")}</dt>
              <dd>{reservation.partySize}</dd>
            </div>
          ) : null}
          {formatted ? (
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">{t("dateTime")}</dt>
              <dd>{formatted}</dd>
            </div>
          ) : null}
        </dl>
      </Card>
    </div>
  );
}
