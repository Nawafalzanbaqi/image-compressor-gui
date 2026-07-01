import type { MenuItemDto, ProductDto } from "@/lib/api/types";

export type { MenuDto, MenuCategoryDto, MenuItemDto } from "@/lib/api/types";

/**
 * Adapter: shape a MenuItemDto like a ProductDto so it can flow through the
 * SHARED client cart (`useCart().add`) and checkout with zero changes — the
 * frontend mirror of the backend's ICatalogService seam.
 */
export function menuItemToProduct(item: MenuItemDto): ProductDto {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    description: item.description,
    price: item.price,
    categorySlug: item.menuCategorySlug,
    imageUrls: item.imageUrls,
    inStock: item.isAvailable,
    isActive: true,
  };
}
