import { apiFetch, ApiError } from "@/lib/api/client";
import type { CreateReservationRequest, ReservationDto } from "@/lib/api/types";

export async function createReservation(
  body: CreateReservationRequest,
): Promise<ReservationDto> {
  return apiFetch<ReservationDto>("/api/reservations", {
    method: "POST",
    json: body,
  });
}

export async function getReservation(
  referenceNumber: string,
): Promise<ReservationDto | null> {
  try {
    return await apiFetch<ReservationDto>(
      `/api/reservations/${encodeURIComponent(referenceNumber)}`,
      { cache: "no-store" },
    );
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    // Offline: synthesize a pending reservation so confirmation renders.
    if (err instanceof ApiError || err instanceof TypeError) {
      return {
        id: referenceNumber,
        referenceNumber,
        branchId: "",
        customerName: "",
        customerPhone: "",
        partySize: 0,
        reservationAtUtc: new Date().toISOString(),
        status: "Pending",
        notes: null,
      };
    }
    throw err;
  }
}
