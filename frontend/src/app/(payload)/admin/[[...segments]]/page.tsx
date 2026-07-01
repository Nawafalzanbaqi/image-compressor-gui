/**
 * Payload CMS admin mount point.
 *
 * When Payload 3 packages are installed, replace this file's body with the
 * standard Payload/Next integration:
 *
 *   import config from "@payload-config";
 *   import { RootPage, generatePageMetadata } from "@payloadcms/next/views";
 *   import { importMap } from "../importMap";
 *
 *   export const generateMetadata = ({ params, searchParams }) =>
 *     generatePageMetadata({ config, params, searchParams });
 *
 *   export default function Page({ params, searchParams }) {
 *     return RootPage({ config, params, searchParams, importMap });
 *   }
 *
 * Until then this placeholder keeps the route buildable offline and documents
 * the wiring. See payload.config.ts for the full note.
 */
export const dynamic = "force-static";

export default function AdminPlaceholder() {
  return (
    <main style={{ padding: "3rem", fontFamily: "system-ui", maxWidth: 640 }}>
      <h1>Payload CMS admin</h1>
      <p>
        The Payload admin is not mounted in this offline build. Install the
        Payload 3 packages and follow the integration note in{" "}
        <code>payload.config.ts</code> to enable content authoring here.
      </p>
      <p>
        Storefront content is currently served from{" "}
        <code>src/content/seeds.ts</code>, which mirrors the Payload collection
        schemas in <code>src/payload/collections</code>.
      </p>
    </main>
  );
}
