import { apiFetch } from "@/lib/api/client";
import type { OrderDto, PlaceOrderRequest } from "@/lib/api/types";

/**
 * Place an order (checkout). POSTs to the backend. This runs from a Next.js
 * server action / route so the API base resolves to the internal URL.
 *
 * TODO(phase-2): real payment provider handoff (tamara/tabi) happens after the
 * order is created; here we only place the order with the chosen method.
 */
export async function placeOrder(
  body: PlaceOrderRequest,
): Promise<OrderDto> {
  return apiFetch<OrderDto>("/api/orders", {
    method: "POST",
    json: body,
    cache: "no-store",
  });
}
