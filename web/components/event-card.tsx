import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";

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
};

export function EventCard({ event }: EventCardProps) {
  const full = event.isFull;
  const ratio = event.capacity > 0 ? event.remainingSeats / event.capacity : 0;

  // Couleur du badge places restantes selon la jauge
  const seatsBadgeClass = full
    ? ""
    : ratio < 0.2
      ? "border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300"
      : "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";

  return (
    <Link href={`/events/${event.id}`} className="block h-full">
      <Card
        className={cn(
          "group relative h-full overflow-hidden border-l-4 transition-all",
          "hover:-translate-y-0.5 hover:shadow-lg",
          full
            ? "border-l-destructive/60 opacity-80"
            : "border-l-primary/70 hover:border-l-primary",
        )}
      >
        <CardHeader className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg leading-tight group-hover:text-primary">
              {event.title}
            </CardTitle>
            {full ? (
              <Badge variant="destructive" className="shrink-0">
                Complet
              </Badge>
            ) : (
              <Badge variant="outline" className={cn("shrink-0", seatsBadgeClass)}>
                <Users className="mr-1 size-3" />
                {event.remainingSeats}/{event.capacity}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          <p className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="size-4 text-primary/70" />
            <span>{formatDate(event.date)}</span>
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="size-4 text-primary/70" />
            <span>{event.location}</span>
          </p>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          <span className="transition-colors group-hover:text-primary">
            Voir le détail →
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
