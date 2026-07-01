"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Sheet } from "@/components/ui/sheet";
import type { NavItem } from "@/config/nav";

interface Props {
  items: NavItem[];
}

/** Mobile hamburger navigation (client leaf). */
export function MobileNav({ items }: Props) {
  const t = useTranslations();
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
        aria-label={t("common.menu")}
        aria-expanded={open}
      >
        <Menu className="h-5 w-5" aria-hidden />
      </button>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title={t("common.menu")}
        side="start"
      >
        <nav aria-label="Mobile">
          <ul className="flex flex-col gap-1">
            {items.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-3 text-base font-medium hover:bg-secondary"
                >
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Sheet>
    </>
  );
}
