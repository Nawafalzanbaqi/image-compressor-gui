import { apiFetch, ApiError } from "@/lib/api/client";
import type { MenuDto, MenuItemDto } from "@/lib/api/types";
import { menuCategories } from "@/content/seeds";

const MENU_TAG = "menu";

/** Full menu grouped by category. Backend → seeds fallback (offline-safe). */
export async function getMenu(): Promise<MenuDto> {
  try {
    return await apiFetch<MenuDto>("/api/menu", {
      revalidate: 60,
      tags: [MENU_TAG],
    });
  } catch (err) {
    if (!(err instanceof ApiError) && !(err instanceof TypeError)) throw err;
    return { categories: menuCategories };
  }
}

export async function getMenuItem(slug: string): Promise<MenuItemDto | null> {
  try {
    return await apiFetch<MenuItemDto>(`/api/menu/${encodeURIComponent(slug)}`, {
      revalidate: 60,
      tags: [MENU_TAG, `menu-item:${slug}`],
    });
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    return seedItem(slug);
  }
}

export async function getFeaturedMenuItems(limit = 4): Promise<MenuItemDto[]> {
  const menu = await getMenu();
  return menu.categories.flatMap((c) => c.items).slice(0, limit);
}

export async function getRelatedMenuItems(
  item: MenuItemDto,
  limit = 3,
): Promise<MenuItemDto[]> {
  const menu = await getMenu();
  return menu.categories
    .flatMap((c) => c.items)
    .filter((i) => i.menuCategorySlug === item.menuCategorySlug && i.slug !== item.slug)
    .slice(0, limit);
}

export function allMenuSlugs(): string[] {
  return menuCategories.flatMap((c) => c.items).map((i) => i.slug);
}

function seedItem(slug: string): MenuItemDto | null {
  for (const category of menuCategories) {
    const found = category.items.find((i) => i.slug === slug);
    if (found) return found;
  }
  return null;
}
