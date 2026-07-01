import type { Metadata } from "next";
import type { ProductDto } from "@/lib/api/types";
import { locales, type Locale } from "@/i18n/routing";

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

/** Build hreflang alternate map + canonical for a path (without locale prefix). */
export function alternates(locale: Locale, pathWithoutLocale = "") {
  const base = siteUrl();
  const clean = pathWithoutLocale.replace(/^\//, "");
  const suffix = clean ? `/${clean}` : "";
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = `${base}/${l}${suffix}`;
  }
  return {
    canonical: `${base}/${locale}${suffix}`,
    languages,
  } satisfies Metadata["alternates"];
}

interface PageMetaInput {
  locale: Locale;
  title: string;
  description: string;
  path?: string;
  images?: string[];
}

export function buildMetadata({
  locale,
  title,
  description,
  path = "",
  images,
}: PageMetaInput): Metadata {
  return {
    title,
    description,
    metadataBase: new URL(siteUrl()),
    alternates: alternates(locale, path),
    openGraph: {
      title,
      description,
      url: `${siteUrl()}/${locale}${path ? `/${path.replace(/^\//, "")}` : ""}`,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      type: "website",
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images ? { images } : {}),
    },
  };
}

/** JSON-LD: Organization. Rendered once in the root layout. */
export function organizationJsonLd(brand: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand,
    url: siteUrl(),
    logo: `${siteUrl()}/icon.png`,
  };
}

/** JSON-LD: Product. Rendered on product detail pages. */
export function productJsonLd(product: ProductDto, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? "",
    image: product.imageUrls ?? [],
    sku: product.id,
    offers: {
      "@type": "Offer",
      price: product.price.amount,
      priceCurrency: product.price.currency,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${siteUrl()}/${locale}/products/${product.slug}`,
    },
  };
}

/** Safe JSON-LD script tag props. Data is app-controlled (no user HTML). */
export function jsonLdScript(data: unknown) {
  return {
    type: "application/ld+json" as const,
    // JSON.stringify output is not HTML; escape </ to be safe.
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(data).replace(/</g, "\\u003c"),
    },
  };
}
