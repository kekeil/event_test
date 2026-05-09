"use client";

import { Users } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import type { EventDto } from "@/lib/types";
import { cn } from "@/lib/utils";

type EventCapacityProps = {
  event: EventDto;
};

export function EventCapacity({ event }: EventCapacityProps) {
  const taken = event.capacity - event.remainingSeats;
  const pct =
    event.capacity > 0
      ? Math.min(100, Math.round((taken / event.capacity) * 100))
      : 0;

  const full = pct >= 100;
  const tight = pct >= 80;

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Users className="size-4" />
          Capacité
        </div>
        <span
          className={cn(
            "text-sm font-semibold",
            full ? "text-destructive" : tight ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {pct}%
        </span>
      </div>
      <p className="text-2xl font-bold leading-none">
        {event.remainingSeats}
        <span className="text-muted-foreground ml-1.5 text-sm font-normal">
          places restantes sur {event.capacity}
        </span>
      </p>
      <Progress value={pct} className="h-2" />
    </div>
  );
}
