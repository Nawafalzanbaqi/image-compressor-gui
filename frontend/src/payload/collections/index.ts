/**
 * Payload CMS collection definitions. Each editable storefront section maps to
 * a collection so content, images, order, and visibility are all editable in
 * /admin. These schemas MIRROR src/content/seeds.ts exactly, so the storefront
 * renders identically whether reading from Payload or the seed fallback.
 *
 * These are plain typed objects (not importing `payload` types) so the file
 * compiles even when the Payload packages are not installed. When Payload is
 * wired (see payload.config.ts + README note), pass `collections` straight into
 * buildConfig — the shapes are Payload's CollectionConfig.
 */

type Field = Record<string, unknown>;
interface Collection {
  slug: string;
  admin?: Record<string, unknown>;
  auth?: boolean;
  upload?: boolean | Record<string, unknown>;
  access?: Record<string, unknown>;
  fields: Field[];
}

const localizedText = (name: string, required = false): Field => ({
  name,
  type: "text",
  localized: true,
  required,
});

const localizedRich = (name: string): Field => ({
  name,
  type: "textarea",
  localized: true,
});

const orderVisible: Field[] = [
  { name: "order", type: "number", defaultValue: 0 },
  { name: "visible", type: "checkbox", defaultValue: true },
];

export const Users: Collection = {
  slug: "users",
  auth: true,
  admin: { useAsTitle: "email" },
  fields: [{ name: "name", type: "text" }],
};

export const Media: Collection = {
  slug: "media",
  upload: true,
  fields: [{ name: "alt", type: "text", localized: true }],
};

export const Hero: Collection = {
  slug: "hero",
  admin: { useAsTitle: "internalName" },
  fields: [
    { name: "internalName", type: "text", required: true },
    ...orderVisible,
    localizedText("eyebrow"),
    localizedText("title", true),
    localizedRich("subtitle"),
    localizedText("ctaLabel"),
    { name: "ctaHref", type: "text", defaultValue: "/products" },
    { name: "image", type: "upload", relationTo: "media" },
  ],
};

export const Categories: Collection = {
  slug: "categories",
  admin: { useAsTitle: "name" },
  fields: [
    localizedText("name", true),
    { name: "slug", type: "text", required: true, unique: true },
    { name: "displayOrder", type: "number", defaultValue: 0 },
    { name: "image", type: "upload", relationTo: "media" },
  ],
};

export const Products: Collection = {
  slug: "products",
  admin: { useAsTitle: "name" },
  fields: [
    localizedText("name", true),
    { name: "slug", type: "text", required: true, unique: true },
    localizedRich("description"),
    { name: "priceAmount", type: "number", required: true },
    { name: "currency", type: "text", defaultValue: "SAR" },
    { name: "categorySlug", type: "text" },
    { name: "images", type: "array", fields: [{ name: "image", type: "upload", relationTo: "media" }] },
    { name: "inStock", type: "checkbox", defaultValue: true },
    { name: "isActive", type: "checkbox", defaultValue: true },
  ],
};

export const Banners: Collection = {
  slug: "banners",
  admin: { useAsTitle: "internalName" },
  fields: [
    { name: "internalName", type: "text", required: true },
    ...orderVisible,
    localizedText("title", true),
    localizedText("subtitle"),
    { name: "href", type: "text", defaultValue: "/products" },
    { name: "image", type: "upload", relationTo: "media" },
  ],
};

export const Faq: Collection = {
  slug: "faq",
  admin: { useAsTitle: "internalName" },
  fields: [
    { name: "internalName", type: "text", required: true },
    ...orderVisible,
    localizedText("question", true),
    localizedRich("answer"),
  ],
};

export const Pages: Collection = {
  slug: "pages",
  admin: { useAsTitle: "slug" },
  fields: [
    { name: "slug", type: "select", options: ["about", "contact"], required: true },
    localizedText("title", true),
    localizedRich("body"),
  ],
};

export const Footer: Collection = {
  slug: "footer",
  admin: { useAsTitle: "heading" },
  fields: [
    localizedText("heading", true),
    {
      name: "links",
      type: "array",
      fields: [localizedText("label", true), { name: "href", type: "text" }],
    },
  ],
};

export const Reviews: Collection = {
  slug: "reviews",
  admin: {
    useAsTitle: "author",
    // Reviews collection is authored but only surfaced when the `reviews`
    // feature flag is enabled (options.json). Kept for parity.
  },
  fields: [
    { name: "productSlug", type: "text", required: true },
    { name: "author", type: "text", required: true },
    { name: "rating", type: "number", min: 1, max: 5, required: true },
    localizedRich("body"),
    { name: "approved", type: "checkbox", defaultValue: false },
  ],
};

export const collections: Collection[] = [
  Users,
  Media,
  Hero,
  Categories,
  Products,
  Banners,
  Faq,
  Pages,
  Footer,
  Reviews,
];
