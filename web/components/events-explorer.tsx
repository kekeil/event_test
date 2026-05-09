"use client";

import { CalendarOffIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { EmptyState } from "@/components/empty-state";
import { EventCard } from "@/components/event-card";
import { PaginationBar } from "@/components/pagination-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { listEvents } from "@/lib/api/events";
import type { EventDto, PageResponse } from "@/lib/types";

type EventsExplorerProps = {
  initial: PageResponse<EventDto>;
  urlPage: number;
  basePath?: string;
};

export function EventsExplorer({
  initial,
  urlPage,
  basePath = "/events",
}: EventsExplorerProps) {
  const searchParams = useSearchParams();
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(false);
  const mounted = useRef(false);

  const search = searchParams.get("search") ?? "";
  const date = searchParams.get("date") ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await listEvents({
          search: search || undefined,
          date: date || undefined,
          page: page - 1,
          limit: 12,
        });
        if (!cancelled) setData(res);
      } catch {
        /* erreurs affichées ailleurs si besoin */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [search, date, page]);

  const showSkeleton = loading;
  const items = data.items;
  const empty = !showSkeleton && items.length === 0;

  return (
    <div className="flex flex-col gap-8">
      {showSkeleton ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : empty ? (
        <EmptyState
          icon={CalendarOffIcon}
          title="Aucun évènement"
          description="Modifiez la recherche ou la date pour élargir les résultats."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((ev) => (
            <EventCard key={ev.id} event={ev} />
          ))}
        </div>
      )}
      <PaginationBar
        totalPages={data.totalPages}
        currentPage={urlPage}
        basePath={basePath}
      />
    </div>
  );
}
