import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { isRouteEnabled } from "@/config/nav";
import { Dashboard } from "@/features/dashboard/components/dashboard";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Gated by features.clientDashboard.
  if (!isRouteEnabled("dashboard")) notFound();

  return (
    <div className="container py-16">
      <Dashboard />
    </div>
  );
}
