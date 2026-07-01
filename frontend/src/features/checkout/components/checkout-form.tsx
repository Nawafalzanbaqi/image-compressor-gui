"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatMoney } from "@/lib/utils";
import { useCart } from "@/features/cart/hooks/use-cart";
import { options } from "@/config/options";
import { checkoutAction, type CheckoutResult } from "../actions";

function SubmitButton() {
  const t = useTranslations("checkout");
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? t("placing") : t("placeOrder")}
    </Button>
  );
}

/** Checkout form (client leaf). Posts to a server action; clears cart on success. */
export function CheckoutForm() {
  const t = useTranslations();
  const locale = useLocale();
  const { lines, subtotal, currency, clear } = useCart();
  const [state, formAction] = useActionState<CheckoutResult | null, FormData>(
    checkoutAction,
    null,
  );

  React.useEffect(() => {
    if (state?.ok) clear();
  }, [state?.ok, clear]);

  const err = (field: string) => state?.errors?.[field]?.[0];

  if (state?.ok && state.order) {
    return (
      <Card className="mx-auto max-w-lg p-8 text-center">
        <h2 className="text-xl font-semibold">{t("checkout.success")}</h2>
        <p className="mt-4 text-muted-foreground">
          {t("checkout.orderNumber")}:{" "}
          <span className="font-mono font-semibold text-foreground">
            {state.order.orderNumber}
          </span>
        </p>
        <Link
          href={`/orders/${state.order.orderNumber}`}
          className="mt-6 inline-flex h-11 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {t("order.trackingTitle")}
        </Link>
      </Card>
    );
  }

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <h2 className="text-lg font-semibold">{t("checkout.customerDetails")}</h2>

        <input type="hidden" name="total" value={subtotal} />
        <input type="hidden" name="currency" value={currency} />

        <div className="space-y-1.5">
          <Label htmlFor="customerName">{t("checkout.name")}</Label>
          <Input id="customerName" name="customerName" required autoComplete="name" />
          {err("customerName") ? (
            <p className="text-sm text-destructive">{err("customerName")}</p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="customerEmail">{t("checkout.email")}</Label>
            <Input
              id="customerEmail"
              name="customerEmail"
              type="email"
              required
              autoComplete="email"
            />
            {err("customerEmail") ? (
              <p className="text-sm text-destructive">{err("customerEmail")}</p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="customerPhone">{t("checkout.phone")}</Label>
            <Input
              id="customerPhone"
              name="customerPhone"
              type="tel"
              autoComplete="tel"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="shippingAddress">{t("checkout.address")}</Label>
          <Textarea id="shippingAddress" name="shippingAddress" required />
          {err("shippingAddress") ? (
            <p className="text-sm text-destructive">{err("shippingAddress")}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="paymentMethod">{t("checkout.paymentMethod")}</Label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            required
            defaultValue={options.payments[0] ?? "tamara"}
            className="flex h-11 w-full rounded-md border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {options.payments.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Card className="h-fit p-6">
        <h2 className="mb-4 text-lg font-semibold">{t("checkout.orderSummary")}</h2>
        <ul className="space-y-2 text-sm">
          {lines.map((line) => (
            <li key={line.productId} className="flex justify-between gap-2">
              <span className="line-clamp-1 text-muted-foreground">
                {line.name} × {line.quantity}
              </span>
              <span>
                {formatMoney(line.unitPrice * line.quantity, currency, locale)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-border pt-4 font-semibold">
          <span>{t("checkout.total")}</span>
          <span>{formatMoney(subtotal, currency, locale)}</span>
        </div>
        <div className="mt-6">
          <SubmitButton />
        </div>
      </Card>
    </form>
  );
}
