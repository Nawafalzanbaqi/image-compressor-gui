import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { isRouteEnabled } from "@/config/nav";
import { Reviews } from "@/features/reviews/components/reviews";

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Config-driven gate: reviews flag is false in options.json -> this 404s.
  if (!isRouteEnabled("reviews")) notFound();

  return (
    <div className="container py-10">
      <Reviews />
    </div>
  );
}
