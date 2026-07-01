"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * Contact form (client leaf). Client-side validation + success message.
 * TODO(phase-2): wire to a backend contact endpoint / WhatsApp integration.
 */
export function ContactForm() {
  const t = useTranslations("contact");
  const [sent, setSent] = React.useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <p className="rounded-md border border-border bg-secondary/50 p-4 text-sm">
        {t("sent")}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="contact-name">{t("name")}</Label>
        <Input id="contact-name" name="name" required autoComplete="name" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="contact-email">{t("email")}</Label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="contact-message">{t("message")}</Label>
        <Textarea id="contact-message" name="message" required />
      </div>
      <Button type="submit">{t("send")}</Button>
    </form>
  );
}
