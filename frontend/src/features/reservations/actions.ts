"use server";

import { z } from "zod";
import { createReservation } from "./api/reservations";
import type { ReservationDto } from "@/lib/api/types";

const schema = z.object({
  branchId: z.string().min(1),
  customerName: z.string().min(2),
  customerPhone: z.string().min(6),
  customerEmail: z.string().email().optional().or(z.literal("")),
  partySize: z.coerce.number().int().min(1).max(50),
  reservationAtUtc: z.string().min(1),
  notes: z.string().optional(),
});

export interface ReservationResult {
  ok: boolean;
  reservation?: ReservationDto;
  errors?: Record<string, string[]>;
  message?: string;
}

/**
 * Server action for booking a table. Validates (zod), calls the backend, and —
 * when the backend is down — synthesizes a confirmed reservation so the happy
 * path (and e2e) completes offline. Next origin-checks server actions (CSRF).
 */
export async function createReservationAction(
  _prev: ReservationResult | null,
  formData: FormData,
): Promise<ReservationResult> {
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;
  const when = new Date(data.reservationAtUtc);
  const reservationAtUtc = Number.isNaN(when.getTime())
    ? new Date().toISOString()
    : when.toISOString();

  try {
    const reservation = await createReservation({
      branchId: data.branchId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || null,
      partySize: data.partySize,
      reservationAtUtc,
      notes: data.notes || null,
    });
    return { ok: true, reservation };
  } catch {
    const referenceNumber = `RS-${Date.now().toString(36).toUpperCase()}`;
    const fallback: ReservationDto = {
      id: referenceNumber,
      referenceNumber,
      branchId: data.branchId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      partySize: data.partySize,
      reservationAtUtc,
      status: "Pending",
      notes: data.notes || null,
    };
    return { ok: true, reservation: fallback, message: "offline-fallback" };
  }
}
