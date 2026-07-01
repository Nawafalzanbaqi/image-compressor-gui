import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { buildNav } from "@/config/nav";
import { CartIndicator } from "@/features/cart/components/cart-indicator";
import { SearchBox } from "@/features/search/components/search-box";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileNav } from "./mobile-nav";

/**
 * Site header (server component). Nav items are config-driven via buildNav —
 * feature-gated items (wishlist/reviews) are excluded when their flag is off.
 * Interactive pieces (search, cart count, locale switch, mobile menu) are
 * client leaves. Translations come from the active request locale.
 */
export async function Header() {
  const t = await getTranslations();
  const navItems = buildNav();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="container flex h-16 items-center gap-4">
        <div className="flex items-center gap-2 lg:hidden">
          <MobileNav items={navItems} />
        </div>

        <Link href="/" className="text-lg font-bold tracking-tight">
          {t("common.brand")}
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ms-auto hidden max-w-xs flex-1 md:block">
          <SearchBox />
        </div>

        <div className="ms-auto flex items-center gap-2 md:ms-0">
          <LocaleSwitcher />
          <CartIndicator />
        </div>
      </div>
    </header>
  );
}
