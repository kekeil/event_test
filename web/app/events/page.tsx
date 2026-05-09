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
      <div className="animate-fade-up relative mb-8 overflow-hidden rounded-3xl border bg-hero-gradient p-6 sm:p-10">
        <div
          className="pointer-events-none absolute -right-16 top-0 size-48 rounded-full bg-primary/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 left-1/4 size-56 rounded-full bg-chart-4/25 blur-3xl"
          aria-hidden
        />
        <div className="relative">
          <p className="text-primary text-sm font-semibold tracking-wide">
            Plateforme d&apos;évènements
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            <span className="from-primary via-fuchsia-500 to-orange-400 bg-gradient-to-r bg-clip-text text-transparent">
              Évènements à venir
            </span>
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl text-sm sm:text-base">
            Parcourez les rencontres, ateliers et conférences proches de chez vous.
            Inscrivez-vous en quelques secondes, suivez les places restantes en temps réel.
          </p>
        </div>
      </div>
      <div className="animate-fade-up-delay-1 mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
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
