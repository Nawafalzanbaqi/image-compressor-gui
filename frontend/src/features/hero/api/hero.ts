import { apiFetch, ApiError } from "@/lib/api/client";
import type { ContentSectionDto } from "@/lib/api/types";
import { heroSlides, type HeroSlide } from "@/content/seeds";

/**
 * Hero content. Authored in Payload CMS (Hero collection). Attempts the
 * backend content API (/api/content/hero); falls back to seeds that mirror the
 * Payload schema. Only visible slides are returned, ordered.
 */
export async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    const section = await apiFetch<ContentSectionDto>("/api/content/hero", {
      revalidate: 120,
      tags: ["content:hero"],
    });
    const blocks = section.blocks ?? [];
    if (blocks.length > 0) {
      return blocks
        .filter((b) => b.visible !== false)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((b) => b.data as unknown as HeroSlide);
    }
  } catch (err) {
    if (!(err instanceof ApiError) && !(err instanceof TypeError)) throw err;
  }
  return heroSlides
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);
}
