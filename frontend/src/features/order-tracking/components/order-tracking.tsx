import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/utils";
import type { OrderDto } from "@/lib/api/types";

interface Props {
  order: OrderDto;
  locale: string;
}

const STEP_ORDER = ["Pending", "Paid", "Shipped", "Delivered"] as const;

export async function OrderTracking({ order, locale }: Props) {
  const t = await getTranslations("order");
  const currentIndex = STEP_ORDER.indexOf(
    order.status as (typeof STEP_ORDER)[number],
  );

  return (
    <Card className="mx-auto max-w-2xl p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("trackingTitle")}</h1>
          <p className="mt-1 font-mono text-sm text-muted-foreground">
            {order.orderNumber}
          </p>
        </div>
        <Badge variant={order.status === "Cancelled" ? "destructive" : "accent"}>
          {t(`statuses.${order.status}`)}
        </Badge>
      </div>

      {order.status !== "Cancelled" ? (
        <ol className="mt-8 flex items-center justify-between">
          {STEP_ORDER.map((step, i) => (
            <li key={step} className="flex flex-1 flex-col items-center gap-2">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                  i <= currentIndex
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
                aria-hidden
              >
                {i + 1}
              </span>
              <span className="text-center text-xs text-muted-foreground">
                {t(`statuses.${step}`)}
              </span>
            </li>
          ))}
        </ol>
      ) : null}

      <dl className="mt-8 space-y-3 border-t border-border pt-6 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">{t("status")}</dt>
          <dd>{t(`statuses.${order.status}`)}</dd>
        </div>
        {order.placedAt ? (
          <div className="flex justify-between">
            <dt className="text-muted-foreground">{t("placedAt")}</dt>
            <dd>
              {new Intl.DateTimeFormat(
                locale === "ar" ? "ar-SA" : "en-US",
                { dateStyle: "medium" },
              ).format(new Date(order.placedAt))}
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between font-semibold">
          <dt>{order.total.currency}</dt>
          <dd>{formatMoney(order.total.amount, order.total.currency, locale)}</dd>
        </div>
      </dl>
    </Card>
  );
}
