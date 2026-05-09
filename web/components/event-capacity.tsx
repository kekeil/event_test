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

  const tone =
    pct >= 100
      ? "text-destructive"
      : pct >= 80
        ? "text-amber-600 dark:text-amber-400"
        : "text-emerald-600 dark:text-emerald-400";

  return (
    <div className="bg-card flex flex-col gap-3 rounded-xl border p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Users className="size-4" />
          Capacité
        </div>
        <span className={cn("text-sm font-semibold", tone)}>{pct}%</span>
      </div>
      <p className="text-2xl leading-none font-bold">
        {event.remainingSeats}
        <span className="ml-1 text-sm font-normal text-muted-foreground">
          places restantes sur {event.capacity}
        </span>
      </p>
      <Progress value={pct} className="h-2.5" />
    </div>
  );
}
