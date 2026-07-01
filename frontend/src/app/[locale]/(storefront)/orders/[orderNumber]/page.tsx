import { getTranslations, setRequestLocale } from "next-intl/server";
import { getOrder } from "@/features/order-tracking/api/order";
import { OrderTracking } from "@/features/order-tracking/components/order-tracking";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ locale: string; orderNumber: string }>;
}) {
  const { locale, orderNumber } = await params;
  setRequestLocale(locale);

  const order = await getOrder(orderNumber);
  if (!order) {
    const t = await getTranslations("order");
    return (
      <div className="container py-16 text-center text-muted-foreground">
        {t("notFound")}
      </div>
    );
  }

  return (
    <div className="container py-10">
      <OrderTracking order={order} locale={locale} />
    </div>
  );
}
