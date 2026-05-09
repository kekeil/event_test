"use client";

import { TrendingUp, Users } from "lucide-react";

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
    pct >= 100 ? "destructive" : pct >= 80 ? "amber" : "emerald";

  const toneClass = {
    destructive: "text-destructive",
    amber: "text-amber-600 dark:text-amber-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
  }[tone];

  return (
    <div className="bg-card relative flex flex-col gap-4 overflow-hidden rounded-xl border p-5 shadow-sm">
      <div
        className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-primary/20 blur-2xl"
        aria-hidden
      />
      <div
        className="bg-chart-4/20 pointer-events-none absolute -bottom-12 -left-8 size-32 rounded-full blur-2xl"
        aria-hidden
      />

      <div className="relative flex items-center justify-between gap-2">
        <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
          <Users className="size-4" />
          Capacité
        </div>
        <div className={cn("flex items-center gap-1 text-sm font-semibold", toneClass)}>
          <TrendingUp className="size-4" />
          {pct}%
        </div>
      </div>

      <div className="relative">
        <p className="text-2xl leading-none font-bold">
          {event.remainingSeats}
          <span className="text-muted-foreground ml-1 text-sm font-normal">
            places restantes sur {event.capacity}
          </span>
        </p>
        <Progress value={pct} className="mt-3 h-2.5" />
      </div>
    </div>
  );
}
