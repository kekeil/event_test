import "server-only";

import { getBackendBaseUrl } from "@/lib/api/config";
import type { EventDto, PageResponse } from "@/lib/types";

export async function listEventsPublic(params: {
  search?: string;
  date?: string;
  page: number;
  limit?: number;
}): Promise<PageResponse<EventDto>> {
  const base = getBackendBaseUrl();
  const qs = new URLSearchParams();
  qs.set("page", String(params.page));
  qs.set("limit", String(params.limit ?? 12));
  if (params.search) qs.set("search", params.search);
  if (params.date) qs.set("date", params.date);
  const res = await fetch(`${base}/api/events?${qs.toString()}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error("Impossible de charger les évènements.");
  }
  return res.json() as Promise<PageResponse<EventDto>>;
}

export async function getEventPublic(id: string): Promise<EventDto> {
  const base = getBackendBaseUrl();
  const res = await fetch(`${base}/api/events/${id}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error("Évènement introuvable.");
  }
  return res.json() as Promise<EventDto>;
}
