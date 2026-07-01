import { apiFetch, ApiError } from "@/lib/api/client";
import type { ProductDto, ProductPage } from "@/lib/api/types";
import { products as seedProducts } from "@/content/seeds";

const PAGE_TAG = "products";

interface ListParams {
  page?: number;
  pageSize?: number;
  categorySlug?: string;
  search?: string;
}

/**
 * List products. Tries the backend; falls back to seed content so the
 * storefront renders offline. Uses Next fetch caching (revalidate + tag) for
 * hot reads on top of the backend's Redis cache.
 */
export async function listProducts(params: ListParams = {}): Promise<ProductPage> {
  const { page = 1, pageSize = 12, categorySlug, search } = params;
  try {
    return await apiFetch<ProductPage>("/api/products", {
      query: { page, pageSize, categorySlug, search },
      revalidate: 60,
      tags: [PAGE_TAG],
    });
  } catch (err) {
    if (!(err instanceof ApiError) && !(err instanceof TypeError)) throw err;
    return seedPage({ page, pageSize, categorySlug, search });
  }
}

export async function getProduct(slug: string): Promise<ProductDto | null> {
  try {
    return await apiFetch<ProductDto>(
      `/api/products/${encodeURIComponent(slug)}`,
      { revalidate: 60, tags: [PAGE_TAG, `product:${slug}`] },
    );
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    const fallback = seedProducts.find((p) => p.slug === slug);
    return fallback ?? null;
  }
}

export async function getRelatedProducts(
  product: ProductDto,
  limit = 4,
): Promise<ProductDto[]> {
  const page = await listProducts({
    categorySlug: product.categorySlug,
    pageSize: limit + 1,
  });
  return page.items.filter((p) => p.slug !== product.slug).slice(0, limit);
}

function seedPage({ page, pageSize, categorySlug, search }: Required<Pick<ListParams, "page" | "pageSize">> & ListParams): ProductPage {
  let items = seedProducts.filter((p) => p.isActive !== false);
  if (categorySlug) items = items.filter((p) => p.categorySlug === categorySlug);
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q),
    );
  }
  const totalCount = items.length;
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page,
    pageSize,
    totalCount,
  };
}
