import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

import { AdminRegistrationsTable } from "@/components/admin-registrations-table";
import { Badge } from "@/components/ui/badge";
import { serverFetchJson } from "@/lib/api/server";
import { formatDateShort } from "@/lib/format-date";
import type { EventDto, RegistrationDto } from "@/lib/types";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminRegistrationsPage({ params }: PageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  let event: EventDto;
  let registrations: RegistrationDto[];
  try {
    event = await serverFetchJson<EventDto>(`/api/events/${id}`, cookieStore);
    registrations = await serverFetchJson<RegistrationDto[]>(
      `/api/events/${id}/registrations`,
      cookieStore,
    );
  } catch {
    notFound();
  }

  const registered = event.capacity - event.remainingSeats;

  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/admin/events"
        className="text-muted-foreground hover:text-foreground mb-6 inline-block text-sm"
      >
        ← Retour au tableau
      </Link>
      <div className="mb-8 flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{event.title}</h1>
        <div className="text-muted-foreground flex flex-wrap gap-2 text-sm">
          <Badge variant="secondary">{formatDateShort(event.date)}</Badge>
          <Badge variant="outline">{event.location}</Badge>
          <Badge variant="secondary">
            Inscrits : {registered} / {event.capacity}
          </Badge>
        </div>
      </div>
      <AdminRegistrationsTable event={event} initial={registrations} />
    </main>
  );
}
