import { Suspense } from "react";

import { EventDateFilter } from "@/components/event-date-filter";
import { EventSearch } from "@/components/event-search";
import { EventsExplorer } from "@/components/events-explorer";
import { listEventsPublic } from "@/lib/api/events-public";

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const urlPage = Math.max(
    1,
    parseInt(typeof sp.page === "string" ? sp.page : "1", 10) || 1,
  );
  const page = urlPage - 1;
  const search = typeof sp.search === "string" ? sp.search : undefined;
  const date = typeof sp.date === "string" ? sp.date : undefined;
  const initial = await listEventsPublic({
    search,
    date,
    page,
    limit: 12,
  });

  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Évènements à venir
        </h1>
        <p className="text-muted-foreground text-sm">
          Parcourez les évènements publics et inscrivez-vous en ligne.
        </p>
      </div>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <Suspense fallback={null}>
          <EventSearch />
        </Suspense>
        <Suspense fallback={null}>
          <EventDateFilter />
        </Suspense>
      </div>
      <Suspense fallback={null}>
        <EventsExplorer initial={initial} urlPage={urlPage} />
      </Suspense>
    </main>
  );
}
