"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { BranchDto } from "@/lib/api/types";
import { createReservationAction, type ReservationResult } from "../actions";

function SubmitButton() {
  const t = useTranslations("reservation");
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? t("submitting") : t("submit")}
    </Button>
  );
}

interface Props {
  branches: BranchDto[];
}

/** Accessible reservation form (client leaf). Posts to a server action. */
export function ReservationForm({ branches }: Props) {
  const t = useTranslations("reservation");
  const [state, formAction] = useActionState<ReservationResult | null, FormData>(
    createReservationAction,
    null,
  );

  const err = (field: string) => state?.errors?.[field]?.[0];

  if (state?.ok && state.reservation) {
    return (
      <Card className="mx-auto max-w-lg p-8 text-center">
        <h2 className="text-xl font-semibold">{t("success")}</h2>
        <p className="mt-4 text-muted-foreground">
          {t("reference")}:{" "}
          <span className="font-mono font-semibold text-foreground">
            {state.reservation.referenceNumber}
          </span>
        </p>
        <Link
          href={`/reservations/${state.reservation.referenceNumber}`}
          className="mt-6 inline-flex h-11 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {t("lookupTitle")}
        </Link>
      </Card>
    );
  }

  return (
    <form action={formAction} className="mx-auto max-w-lg space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="branchId">{t("branch")}</Label>
        <select
          id="branchId"
          name="branchId"
          required
          defaultValue={branches[0]?.id ?? ""}
          className="flex h-11 w-full rounded-md border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        {err("branchId") ? (
          <p className="text-sm text-destructive">{err("branchId")}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="customerName">{t("name")}</Label>
        <Input id="customerName" name="customerName" required autoComplete="name" />
        {err("customerName") ? (
          <p className="text-sm text-destructive">{err("customerName")}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="customerPhone">{t("phone")}</Label>
          <Input id="customerPhone" name="customerPhone" type="tel" required autoComplete="tel" />
          {err("customerPhone") ? (
            <p className="text-sm text-destructive">{err("customerPhone")}</p>
          ) : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="customerEmail">{t("email")}</Label>
          <Input id="customerEmail" name="customerEmail" type="email" autoComplete="email" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="partySize">{t("partySize")}</Label>
          <Input
            id="partySize"
            name="partySize"
            type="number"
            min={1}
            max={50}
            defaultValue={2}
            required
          />
          {err("partySize") ? (
            <p className="text-sm text-destructive">{err("partySize")}</p>
          ) : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="reservationAtUtc">{t("dateTime")}</Label>
          <Input
            id="reservationAtUtc"
            name="reservationAtUtc"
            type="datetime-local"
            required
          />
          {err("reservationAtUtc") ? (
            <p className="text-sm text-destructive">{err("reservationAtUtc")}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">{t("notes")}</Label>
        <Textarea id="notes" name="notes" />
      </div>

      <SubmitButton />
    </form>
  );
}
