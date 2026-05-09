import Link from "next/link";
import { Suspense } from "react";

import { AdminEventsTable } from "@/components/admin-events-table";
import { EventDateFilter } from "@/components/event-date-filter";
import { EventSearch } from "@/components/event-search";
import { Button } from "@/components/ui/button";
import { listEventsPublic } from "@/lib/api/events-public";

export default async function AdminEventsPage({
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
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Évènements
          </h1>
          <p className="text-muted-foreground text-sm">
            Gérez les évènements et les inscriptions.
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/events/new">Nouvel évènement</Link>
        </Button>
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
        <AdminEventsTable initial={initial} urlPage={urlPage} />
      </Suspense>
    </main>
  );
}
