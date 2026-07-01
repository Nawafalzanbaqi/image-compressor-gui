import { getTranslations, setRequestLocale } from "next-intl/server";
import { CartView } from "@/features/cart/components/cart-view";

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("cart");

  return (
    <div className="container py-10">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">{t("title")}</h1>
      <CartView />
    </div>
  );
}
