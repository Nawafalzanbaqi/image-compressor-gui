/**
 * Typed fetch wrapper for the backend API.
 *
 * - Base URL: server-side uses API_INTERNAL_URL (container-to-container),
 *   client-side uses NEXT_PUBLIC_API_BASE_URL.
 * - Leverages the Next.js fetch cache with revalidate + tags for hot reads;
 *   the backend also caches in Redis, so this is a second, edge-friendly layer.
 * - Errors are surfaced as a typed ApiError (never leaks raw response bodies).
 */

const isServer = typeof window === "undefined";

export function apiBaseUrl(): string {
  if (isServer) {
    return (
      process.env.API_INTERNAL_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "http://localhost:8080"
    );
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public detail?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  /** JSON body — serialized automatically. */
  json?: unknown;
  /** Query params (undefined values are dropped). */
  query?: Record<string, string | number | boolean | undefined>;
  /** Next.js fetch cache controls. */
  revalidate?: number | false;
  tags?: string[];
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = new URL(
    path.startsWith("http") ? path : `${apiBaseUrl()}${path}`,
  );
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { json, query, revalidate, tags, headers, ...rest } = options;

  const next: { revalidate?: number | false; tags?: string[] } = {};
  if (revalidate !== undefined) next.revalidate = revalidate;
  if (tags) next.tags = tags;

  const res = await fetch(buildUrl(path, query), {
    ...rest,
    headers: {
      Accept: "application/json",
      ...(json !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: json !== undefined ? JSON.stringify(json) : undefined,
    ...(Object.keys(next).length ? { next } : {}),
  });

  if (!res.ok) {
    let detail: unknown;
    try {
      detail = await res.json();
    } catch {
      /* non-json error */
    }
    throw new ApiError(res.status, `API request failed: ${res.status}`, detail);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
