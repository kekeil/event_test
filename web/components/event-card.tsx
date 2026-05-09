import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Users } from "lucide-react";

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

export function EventCard({ event, index = 0 }: EventCardProps) {
  const full = event.isFull;
  const ratio = event.capacity > 0 ? event.remainingSeats / event.capacity : 0;

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
      className={cn(
        "block h-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        delayClass,
      )}
    >
      <Card
        className={cn(
          "hover-lift group h-full border transition-colors",
          full && "opacity-70",
        )}
      >
        {/* Barre primaire en haut — plus fine et discrète */}
        <div
          className={cn(
            "h-px w-full",
            full ? "bg-destructive/50" : "bg-primary/40",
          )}
          aria-hidden
        />

        <CardHeader className="flex flex-col gap-2 pb-2 pt-4">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base leading-snug transition-colors group-hover:text-primary">
              {event.title}
            </CardTitle>
            {full ? (
              <Badge variant="destructive" className="shrink-0">
                Complet
              </Badge>
            ) : (
              <Badge variant="outline" className={cn(
                "shrink-0 gap-1 text-xs",
                ratio < 0.2
                  ? "border-destructive/40 text-destructive"
                  : "text-muted-foreground",
              )}>
                <Users className="size-3" />
                {event.remainingSeats}/{event.capacity}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-3 text-sm">
          {event.description ? (
            <p className="text-muted-foreground line-clamp-2 leading-relaxed">
              {event.description}
            </p>
          ) : null}
          <div className="flex flex-col gap-1.5">
            <p className="text-muted-foreground flex items-center gap-2">
              <CalendarDays className="size-3.5 shrink-0" />
              {formatDate(event.date)}
            </p>
            <p className="text-muted-foreground flex items-center gap-2">
              <MapPin className="size-3.5 shrink-0" />
              {event.location}
            </p>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <span className="text-muted-foreground group-hover:text-primary inline-flex items-center gap-1 text-xs transition-colors">
            Voir le détail
            <ArrowRight className="size-3" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
