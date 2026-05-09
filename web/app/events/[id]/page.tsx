import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Info,
  MapPin,
  Users,
} from "lucide-react";

import { EventCapacity } from "@/components/event-capacity";
import { RegistrationForm } from "@/components/registration-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  const registered = event.capacity - event.remainingSeats;

  return (
    <main className="container mx-auto max-w-5xl px-4 py-8">
      <Link
        href="/events"
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" />
        Retour à la liste
      </Link>

      {/* Hero */}
      <section className="animate-fade-up rounded-xl border bg-hero-gradient p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex max-w-3xl flex-col gap-3">
            {event.isFull ? (
              <Badge variant="destructive" className="w-fit">
                Complet
              </Badge>
            ) : (
              <Badge variant="outline" className="w-fit text-muted-foreground">
                Inscriptions ouvertes
              </Badge>
            )}
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {event.title}
            </h1>
          </div>
        </div>
      </section>

      <div className="animate-fade-up-delay-1 mt-6 grid gap-6 lg:grid-cols-[1fr_minmax(300px,380px)]">
        {/* Colonne gauche */}
        <div className="flex flex-col gap-6">
          {/* Stats */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Card>
              <CardContent className="flex flex-col gap-1 p-4">
                <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium uppercase tracking-wide">
                  <CalendarDays className="size-3.5" />
                  Date
                </div>
                <p className="text-sm font-semibold leading-tight">
                  {formatDate(event.date)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col gap-1 p-4">
                <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium uppercase tracking-wide">
                  <MapPin className="size-3.5" />
                  Lieu
                </div>
                <p className="text-sm font-semibold leading-tight">
                  {event.location}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col gap-1 p-4">
                <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium uppercase tracking-wide">
                  <Users className="size-3.5" />
                  Inscrits
                </div>
                <p className="text-sm font-semibold leading-tight">
                  {registered} / {event.capacity}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          {event.description ? (
            <Card className="animate-fade-up-delay-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                  <Info className="size-4" />
                  À propos de cet évènement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/90 text-sm leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="text-muted-foreground p-6 text-center text-sm">
                Aucune description fournie pour cet évènement.
              </CardContent>
            </Card>
          )}
        </div>

        {/* Colonne droite */}
        <aside className="animate-fade-up-delay-3 flex flex-col gap-4 lg:sticky lg:top-20 lg:self-start">
          <EventCapacity event={event} />
          <Card>
            <CardHeader>
              <CardTitle className="text-base">S&apos;inscrire</CardTitle>
            </CardHeader>
            <CardContent>
              {event.isFull ? (
                <Alert variant="destructive">
                  <AlertTitle>Évènement complet</AlertTitle>
                  <AlertDescription>
                    Toutes les places ont été réservées. Inscriptions fermées.
                  </AlertDescription>
                </Alert>
              ) : (
                <RegistrationForm eventId={event.id} />
              )}
            </CardContent>
          </Card>
          <p className="text-muted-foreground text-center text-xs">
            En vous inscrivant, vous acceptez de recevoir un email de
            confirmation.
          </p>
        </aside>
      </div>
    </main>
  );
}
