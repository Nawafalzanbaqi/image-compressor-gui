import { apiFetch, ApiError } from "@/lib/api/client";
import type { OrderDto } from "@/lib/api/types";

/** Track an order by number. Returns null on 404 or when unreachable. */
export async function getOrder(orderNumber: string): Promise<OrderDto | null> {
  try {
    return await apiFetch<OrderDto>(
      `/api/orders/${encodeURIComponent(orderNumber)}`,
      { cache: "no-store" },
    );
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    // Offline: synthesize a pending order so tracking still renders for a
    // freshly placed (fallback) order number.
    if (/^SF-/.test(orderNumber)) {
      return {
        id: orderNumber,
        orderNumber,
        status: "Pending",
        items: [],
        total: { amount: 0, currency: "SAR" },
        placedAt: new Date().toISOString(),
      };
    }
    return null;
  }
}
