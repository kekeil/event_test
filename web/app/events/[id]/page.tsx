import Link from "next/link";
import { notFound } from "next/navigation";

import { EventCapacity } from "@/components/event-capacity";
import { RegistrationForm } from "@/components/registration-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { getEventPublic } from "@/lib/api/events-public";
import { formatDate } from "@/lib/format-date";

type PageProps = { params: Promise<{ id: string }> };

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;
  let event;
  try {
    event = await getEventPublic(id);
  } catch {
    notFound();
  }

  return (
    <main className="container mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/events"
        className="text-muted-foreground hover:text-foreground mb-6 inline-block text-sm"
      >
        ← Retour à la liste
      </Link>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">{event.title}</h1>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{formatDate(event.date)}</Badge>
          <Badge variant="outline">{event.location}</Badge>
          {event.isFull ? (
            <Badge variant="destructive">Complet</Badge>
          ) : null}
        </div>
        {event.description ? (
          <p className="text-muted-foreground whitespace-pre-wrap">
            {event.description}
          </p>
        ) : null}
        <EventCapacity event={event} />
        <section className="mt-4 flex flex-col gap-4">
          <h2 className="text-xl font-medium">Inscription</h2>
          {event.isFull ? (
            <Alert variant="destructive">
              <AlertTitle>Complet</AlertTitle>
              <AlertDescription>
                Cet évènement est complet. Inscriptions fermées.
              </AlertDescription>
            </Alert>
          ) : (
            <RegistrationForm eventId={event.id} />
          )}
        </section>
      </div>
    </main>
  );
}
