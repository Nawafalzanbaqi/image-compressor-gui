import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { options } from "@/config/options";

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

// Default locale is derived from options.json: rtl default => Arabic-first.
export const defaultLocale: Locale =
  options.defaultDirection === "rtl" ? "ar" : "en";

/** Text direction for a given locale. */
export function directionFor(locale: string): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
