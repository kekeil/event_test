import { notFound } from "next/navigation";
import { cookies } from "next/headers";

import { EventForm } from "@/components/event-form";
import { serverFetchJson } from "@/lib/api/server";
import type { EventDto } from "@/lib/types";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminEditEventPage({ params }: PageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  let event: EventDto;
  try {
    event = await serverFetchJson<EventDto>(`/api/events/${id}`, cookieStore);
  } catch {
    notFound();
  }

  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">
        Modifier l&apos;évènement
      </h1>
      <EventForm mode="edit" event={event} />
    </main>
  );
}
