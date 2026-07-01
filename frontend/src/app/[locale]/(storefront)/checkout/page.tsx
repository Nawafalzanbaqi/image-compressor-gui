import { getTranslations, setRequestLocale } from "next-intl/server";
import { CheckoutForm } from "@/features/checkout/components/checkout-form";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("checkout");

  return (
    <div className="container py-10">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">{t("title")}</h1>
      <CheckoutForm />
    </div>
  );
}
