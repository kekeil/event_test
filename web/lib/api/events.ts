import { apiClient } from "@/lib/api/client";
import type { EventDto, PageResponse } from "@/lib/types";

export type ListEventsParams = {
  search?: string;
  date?: string;
  page: number;
  limit?: number;
};

export async function listEvents(
  params: ListEventsParams,
): Promise<PageResponse<EventDto>> {
  const { search, date, page, limit = 12 } = params;
  const { data } = await apiClient.get<PageResponse<EventDto>>("/api/events", {
    params: {
      search: search || undefined,
      date: date || undefined,
      page,
      limit,
    },
  });
  return data;
}

export async function getEvent(id: string): Promise<EventDto> {
  const { data } = await apiClient.get<EventDto>(`/api/events/${id}`);
  return data;
}

export type EventPayload = {
  title: string;
  description?: string | null;
  date: string;
  location: string;
  capacity: number;
};

export async function createEvent(payload: EventPayload): Promise<EventDto> {
  const { data } = await apiClient.post<EventDto>("/api/events", payload);
  return data;
}

export async function updateEvent(
  id: string,
  payload: EventPayload,
): Promise<EventDto> {
  const { data } = await apiClient.put<EventDto>(
    `/api/events/${id}`,
    payload,
  );
  return data;
}

export async function deleteEvent(id: string): Promise<void> {
  await apiClient.delete(`/api/events/${id}`);
}

export async function registerToEvent(
  eventId: string,
  body: { firstName: string; lastName: string; email: string },
): Promise<void> {
  await apiClient.post(`/api/events/${eventId}/register`, body);
}
