import { getRequestConfig } from "next-intl/server";
import { routing, locales } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale =
    requested && (locales as readonly string[]).includes(requested)
      ? requested
      : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
