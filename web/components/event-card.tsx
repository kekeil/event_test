import Link from "next/link";

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

  return (
    <Link href={`/events/${event.id}`} className="block h-full">
      <Card
        className={cn(
          "h-full transition-shadow hover:shadow-md",
          full && "opacity-75",
        )}
      >
        <CardHeader className="flex flex-col gap-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <CardTitle className="text-lg leading-tight">{event.title}</CardTitle>
            {full ? (
              <Badge variant="destructive">Complet</Badge>
            ) : (
              <Badge variant="secondary">
                {event.remainingSeats} places restantes / {event.capacity}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
          <p>{formatDate(event.date)}</p>
          <p>{event.location}</p>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          Voir le détail
        </CardFooter>
      </Card>
    </Link>
  );
}
