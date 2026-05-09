import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Info,
  MapPin,
  Sparkles,
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
        className="text-muted-foreground hover:text-primary mb-6 inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" />
        Retour à la liste
      </Link>

      {/* Hero */}
      <section className="bg-hero-gradient rounded-2xl border p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {event.isFull ? (
                <Badge variant="destructive">Complet</Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                >
                  <Sparkles className="mr-1 size-3" />
                  Inscriptions ouvertes
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {event.title}
            </h1>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_minmax(320px,400px)]">
        {/* Colonne gauche : infos + description */}
        <div className="flex flex-col gap-6">
          {/* Stats cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Card
              className="border-l-4"
              style={{ borderLeftColor: "var(--chart-1)" }}
            >
              <CardContent className="flex flex-col gap-1 p-4">
                <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium uppercase">
                  <CalendarDays className="size-3.5" />
                  Date
                </div>
                <p className="text-sm leading-tight font-semibold">
                  {formatDate(event.date)}
                </p>
              </CardContent>
            </Card>
            <Card
              className="border-l-4"
              style={{ borderLeftColor: "var(--chart-2)" }}
            >
              <CardContent className="flex flex-col gap-1 p-4">
                <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium uppercase">
                  <MapPin className="size-3.5" />
                  Lieu
                </div>
                <p className="text-sm leading-tight font-semibold">
                  {event.location}
                </p>
              </CardContent>
            </Card>
            <Card
              className="border-l-4"
              style={{ borderLeftColor: "var(--chart-3)" }}
            >
              <CardContent className="flex flex-col gap-1 p-4">
                <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium uppercase">
                  <Users className="size-3.5" />
                  Inscrits
                </div>
                <p className="text-sm leading-tight font-semibold">
                  {registered} / {event.capacity}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Description mise en valeur */}
          {event.description ? (
            <Card className="border-accent-foreground/20 bg-accent/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-accent-foreground flex items-center gap-2 text-base">
                  <Info className="size-4" />
                  À propos de cet évènement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/90 text-base leading-relaxed whitespace-pre-wrap">
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

        {/* Colonne droite : capacité + formulaire */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-20 lg:self-start">
          <EventCapacity event={event} />
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">S&apos;inscrire</CardTitle>
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
