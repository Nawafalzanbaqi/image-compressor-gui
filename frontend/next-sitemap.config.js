/**
 * next-sitemap config. Generates sitemap.xml + robots.txt at build time
 * (postbuild). Emits hreflang alternateRefs for en/ar. siteUrl comes from
 * NEXT_PUBLIC_SITE_URL.
 * @type {import('next-sitemap').IConfig}
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  alternateRefs: [
    { href: `${siteUrl}/en`, hreflang: "en" },
    { href: `${siteUrl}/ar`, hreflang: "ar" },
  ],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/admin", "/api", "/dashboard"] },
    ],
  },
  exclude: ["/admin*", "/*/dashboard*"],
};
