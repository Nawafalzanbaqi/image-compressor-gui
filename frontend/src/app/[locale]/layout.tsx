import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Inter } from "next/font/google";
import { routing, locales, directionFor, type Locale } from "@/i18n/routing";
import { alternates, organizationJsonLd, jsonLdScript } from "@/lib/seo";
import { Providers } from "@/components/providers";
import { Header } from "@/features/header/components/header";
import { Footer } from "@/features/footer/components/footer";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  return {
    title: {
      default: t("brand"),
      template: `%s · ${t("brand")}`,
    },
    description: "Premium goods, delivered with care.",
    alternates: alternates(locale as Locale),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(locales as readonly string[]).includes(locale)) notFound();
  setRequestLocale(locale);

  const dir = directionFor(locale);
  const t = await getTranslations({ locale, namespace: "common" });
  const messages = await getMessages();

  return (
    <html lang={locale} dir={dir} className={inter.variable} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <script {...jsonLdScript(organizationJsonLd(t("brand")))} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          {t("skipToContent")}
        </a>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer locale={locale} />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
