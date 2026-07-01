import { getTranslations } from "next-intl/server";
import { pages, pick } from "@/content/seeds";
import { ContactForm } from "./contact-form";

interface Props {
  locale: string;
}

/** Contact page. Intro copy is content-driven; the form is a client leaf. */
export async function Contact({ locale }: Props) {
  const t = await getTranslations("contact");
  const page = pages.find((p) => p.slug === "contact");

  return (
    <section className="container max-w-2xl py-16">
      <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
      {page ? (
        <p className="mt-4 text-muted-foreground">{pick(page.body, locale)}</p>
      ) : null}
      <div className="mt-8">
        <ContactForm />
      </div>
    </section>
  );
}
