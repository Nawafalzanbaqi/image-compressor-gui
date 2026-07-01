import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for static assets, API routes, the Payload
  // admin, and Next internals.
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
