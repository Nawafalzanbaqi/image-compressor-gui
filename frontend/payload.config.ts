/**
 * Payload CMS 3 configuration (embedded in Next.js).
 *
 * INTEGRATION NOTE (Phase 1):
 * Payload 3 packages are intentionally NOT in package.json for the offline
 * build, so this config is written against a lazy import and is inert until the
 * packages are installed. The storefront reads content from src/content/seeds.ts
 * (which mirrors these collection schemas) so the app renders without a running
 * Payload/DB. To fully enable Payload:
 *
 *   1. pnpm add payload @payloadcms/next @payloadcms/db-postgres \
 *        @payloadcms/richtext-lexical graphql
 *   2. Ensure DATABASE_URI + PAYLOAD_SECRET are set (see .env.example).
 *   3. Uncomment the buildConfig body below and re-export it as default.
 *   4. The /admin route already exists at src/app/(payload)/admin/...
 *   5. Point the feature `api/` functions at Payload's Local API or the REST
 *      endpoints instead of the seed fallback.
 *
 * The collection SHAPES live in src/payload/collections and already match
 * Payload's CollectionConfig, so wiring is mechanical.
 */
import { collections } from "./src/payload/collections";

export const payloadIntegration = {
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  secretEnv: "PAYLOAD_SECRET",
  databaseEnv: "DATABASE_URI",
  adapter: "@payloadcms/db-postgres",
  adminRoute: "/admin",
  collections: collections.map((c) => c.slug),
};

/*
 * // Uncomment once Payload packages are installed:
 * import { buildConfig } from "payload";
 * import { postgresAdapter } from "@payloadcms/db-postgres";
 * import { lexicalEditor } from "@payloadcms/richtext-lexical";
 * import { collections as payloadCollections } from "./src/payload/collections";
 *
 * export default buildConfig({
 *   serverURL: process.env.NEXT_PUBLIC_SITE_URL,
 *   secret: process.env.PAYLOAD_SECRET || "",
 *   admin: { user: "users" },
 *   editor: lexicalEditor(),
 *   collections: payloadCollections as never,
 *   localization: {
 *     locales: ["en", "ar"],
 *     defaultLocale: "ar",
 *   },
 *   db: postgresAdapter({
 *     pool: { connectionString: process.env.DATABASE_URI },
 *   }),
 *   typescript: { outputFile: "./src/payload/payload-types.ts" },
 * });
 */

export default payloadIntegration;
