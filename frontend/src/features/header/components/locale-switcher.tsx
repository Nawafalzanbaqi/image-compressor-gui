"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { Languages } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/routing";
import { locales } from "@/i18n/routing";

/**
 * Locale switcher (client leaf). Preserves the current path when switching
 * between en/ar; next-intl handles the prefix + RTL/LTR flips on the html tag.
 */
export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  function switchTo(next: string) {
    if (next === locale) return;
    // @ts-expect-error -- params are passed through for dynamic segments
    router.replace({ pathname, params }, { locale: next });
  }

  return (
    <div
      className="inline-flex items-center gap-1 rounded-md border border-border p-0.5"
      role="group"
      aria-label="Language"
    >
      <Languages className="mx-1 h-4 w-4 text-muted-foreground" aria-hidden />
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          aria-current={l === locale ? "true" : undefined}
          className={`rounded px-2 py-1 text-xs font-medium uppercase transition-colors ${
            l === locale
              ? "bg-primary text-primary-foreground"
              : "hover:bg-secondary"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
