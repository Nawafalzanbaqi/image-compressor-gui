import { getTranslations } from "next-intl/server";
import { Phone, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { listBranches } from "../api/branches";
import { BranchMap } from "./branch-map";

interface Props {
  headed?: boolean;
}

/** Server component. Lists branches with contact details + an embedded map each. */
export async function BranchLocator({ headed = true }: Props) {
  const t = await getTranslations("branches");
  const branches = await listBranches();

  return (
    <div className="container py-10">
      {headed ? (
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        </header>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        {branches.map((branch) => (
          <Card key={branch.id} className="overflow-hidden">
            <BranchMap
              latitude={branch.latitude}
              longitude={branch.longitude}
              title={t("mapTitle", { name: branch.name })}
            />
            <CardContent className="space-y-2 p-5">
              <h2 className="text-lg font-semibold">{branch.name}</h2>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                {branch.address}, {branch.city}
              </p>
              {branch.openingHours ? (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 shrink-0" aria-hidden />
                  <span className="sr-only">{t("openingHours")}: </span>
                  {branch.openingHours}
                </p>
              ) : null}
              {branch.phone ? (
                <a
                  href={`tel:${branch.phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-2 text-sm font-medium text-accent hover:underline"
                >
                  <Phone className="h-4 w-4 shrink-0" aria-hidden />
                  {t("call")}: {branch.phone}
                </a>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
