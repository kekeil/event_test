import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/format-date";
import type { EventDto } from "@/lib/types";
import { cn } from "@/lib/utils";

type EventCardProps = {
  event: EventDto;
  index?: number;
};

const ACCENT_GRADIENTS = [
  "from-violet-500/20 via-fuchsia-500/12 to-transparent",
  "from-blue-500/20 via-cyan-500/12 to-transparent",
  "from-emerald-500/20 via-teal-500/12 to-transparent",
  "from-amber-500/20 via-orange-500/12 to-transparent",
  "from-rose-500/20 via-pink-500/12 to-transparent",
  "from-indigo-500/20 via-blue-500/12 to-transparent",
];

export function EventCard({ event, index = 0 }: EventCardProps) {
  const full = event.isFull;
  const ratio = event.capacity > 0 ? event.remainingSeats / event.capacity : 0;
  const accent = ACCENT_GRADIENTS[index % ACCENT_GRADIENTS.length];

  const seatsTone = full ? "destructive" : ratio < 0.2 ? "amber" : "emerald";

  const delayClass =
    [
      "animate-fade-up",
      "animate-fade-up-delay-1",
      "animate-fade-up-delay-2",
      "animate-fade-up-delay-3",
      "animate-fade-up-delay-4",
      "animate-fade-up-delay-5",
    ][Math.min(index, 5)] ?? "animate-fade-up";

  return (
    <Link
      href={`/events/${event.id}`}
      className={cn("block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xl", delayClass)}
    >
      <Card
        className={cn(
          "hover-glow group relative h-full overflow-hidden rounded-xl",
          "border-border/60 bg-card/80 backdrop-blur-sm",
          full && "opacity-75",
        )}
      >
        {/* Halo de couleur en haut de la carte */}
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 -top-px h-32 bg-gradient-to-b opacity-90",
            accent,
          )}
          aria-hidden
        />

        {/* Bandeau supérieur */}
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-1 z-[1]",
            full ? "bg-destructive/70" : "bg-gradient-to-r from-primary via-fuchsia-500 to-orange-400",
          )}
          aria-hidden
        />

        <CardHeader className="relative z-[1] flex flex-col gap-3 pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg leading-tight transition-colors group-hover:text-primary">
              {event.title}
            </CardTitle>
            {full ? (
              <Badge variant="destructive" className="shrink-0 animate-soft-pulse">
                Complet
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className={cn(
                  "shrink-0 gap-1 font-medium",
                  seatsTone === "amber" &&
                    "border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300",
                  seatsTone === "emerald" &&
                    "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                )}
              >
                <Users className="size-3" />
                {event.remainingSeats}/{event.capacity}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="relative z-[1] flex flex-col gap-3 text-sm">
          {event.description ? (
            <p className="text-muted-foreground line-clamp-3 leading-relaxed">
              {event.description}
            </p>
          ) : null}
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground flex items-center gap-2">
              <CalendarDays className="size-4 shrink-0 text-primary/80" />
              <span>{formatDate(event.date)}</span>
            </p>
            <p className="text-muted-foreground flex items-center gap-2">
              <MapPin className="size-4 shrink-0 text-primary/80" />
              <span>{event.location}</span>
            </p>
          </div>
        </CardContent>

        <CardFooter className="relative z-[1] pt-0">
          <span className="text-muted-foreground group-hover:text-primary inline-flex items-center gap-1 text-xs font-medium transition-colors">
            Voir le détail
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
