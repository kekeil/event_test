"use client";

import { Progress } from "@/components/ui/progress";
import type { EventDto } from "@/lib/types";

type EventCapacityProps = {
  event: EventDto;
};

export function EventCapacity({ event }: EventCapacityProps) {
  const taken = event.capacity - event.remainingSeats;
  const pct =
    event.capacity > 0
      ? Math.min(100, Math.round((taken / event.capacity) * 100))
      : 0;

  return (
    <div className="bg-card flex flex-col gap-3 rounded-xl border p-4 shadow-sm">
      <p className="text-lg font-semibold">
        {event.remainingSeats} places restantes sur {event.capacity}
      </p>
      <Progress value={pct} className="h-2" />
    </div>
  );
}
