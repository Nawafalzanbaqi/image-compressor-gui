import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { isRouteEnabled } from "@/config/nav";
import { WishlistView } from "@/features/wishlist/components/wishlist-view";

export default async function WishlistPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Config-driven gate: wishlist rides on the `loyalty` flag (false) -> 404.
  if (!isRouteEnabled("wishlist")) notFound();

  const t = await getTranslations("wishlist");
  return (
    <div className="container py-10">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">{t("title")}</h1>
      <WishlistView />
    </div>
  );
}
