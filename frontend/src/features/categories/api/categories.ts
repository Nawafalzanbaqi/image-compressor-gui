import { apiFetch, ApiError } from "@/lib/api/client";
import type { CategoryDto } from "@/lib/api/types";
import { categories as seedCategories } from "@/content/seeds";

export async function listCategories(): Promise<CategoryDto[]> {
  try {
    const result = await apiFetch<CategoryDto[]>("/api/categories", {
      revalidate: 300,
      tags: ["categories"],
    });
    return [...result].sort(
      (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0),
    );
  } catch (err) {
    if (!(err instanceof ApiError) && !(err instanceof TypeError)) throw err;
    return [...seedCategories].sort(
      (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0),
    );
  }
}
