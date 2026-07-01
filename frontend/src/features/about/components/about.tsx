import { pages, pick } from "@/content/seeds";

interface Props {
  locale: string;
}

/** About page. Content-driven (Payload Pages collection / seeds). */
export function About({ locale }: Props) {
  const page = pages.find((p) => p.slug === "about");
  if (!page) return null;
  return (
    <section className="container max-w-3xl py-16">
      <h1 className="text-3xl font-bold tracking-tight">
        {pick(page.title, locale)}
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-foreground/90">
        {pick(page.body, locale)}
      </p>
    </section>
  );
}
