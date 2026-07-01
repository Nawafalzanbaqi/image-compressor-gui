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

/** JSON-LD: Restaurant / LocalBusiness. Rendered on the restaurant home + branch pages. */
export function restaurantJsonLd(input: {
  name: string;
  servesCuisine?: string;
  priceRange?: string;
  branches: {
    name: string;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
    phone?: string | null;
    openingHours?: string | null;
  }[];
}) {
  const primary = input.branches[0];
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: input.name,
    url: siteUrl(),
    ...(input.servesCuisine ? { servesCuisine: input.servesCuisine } : {}),
    ...(input.priceRange ? { priceRange: input.priceRange } : {}),
    menu: `${siteUrl()}/menu`,
    ...(primary
      ? {
          telephone: primary.phone,
          openingHours: primary.openingHours,
          address: {
            "@type": "PostalAddress",
            streetAddress: primary.address,
            addressLocality: primary.city,
            addressCountry: "SA",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: primary.latitude,
            longitude: primary.longitude,
          },
        }
      : {}),
  };
}

/** JSON-LD: a single menu item (schema.org MenuItem). */
export function menuItemJsonLd(item: {
  name: string;
  description?: string;
  price: { amount: number; currency: string };
  imageUrls?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: item.name,
    description: item.description ?? "",
    image: item.imageUrls ?? [],
    offers: {
      "@type": "Offer",
      price: item.price.amount,
      priceCurrency: item.price.currency,
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
