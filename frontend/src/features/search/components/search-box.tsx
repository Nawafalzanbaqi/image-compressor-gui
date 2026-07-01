"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Input } from "@/components/ui/input";

interface Props {
  autoFocus?: boolean;
  defaultValue?: string;
}

/** Search box (client leaf). Navigates to /search?q=... on submit. */
export function SearchBox({ autoFocus, defaultValue = "" }: Props) {
  const t = useTranslations("common");
  const router = useRouter();
  const [value, setValue] = React.useState(defaultValue);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={onSubmit} role="search" className="relative w-full">
      <label htmlFor="site-search" className="sr-only">
        {t("search")}
      </label>
      <Search
        className="pointer-events-none absolute inset-y-0 start-3 my-auto h-4 w-4 text-muted-foreground"
        aria-hidden
      />
      <Input
        id="site-search"
        type="search"
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t("searchPlaceholder")}
        className="ps-9"
      />
    </form>
  );
}
