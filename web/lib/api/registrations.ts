import { apiClient } from "@/lib/api/client";
import type { RegistrationDto } from "@/lib/types";

export async function listRegistrations(
  eventId: string,
): Promise<RegistrationDto[]> {
  const { data } = await apiClient.get<RegistrationDto[]>(
    `/api/events/${eventId}/registrations`,
  );
  return data;
}

export async function deleteRegistration(id: string): Promise<void> {
  await apiClient.delete(`/api/registrations/${id}`);
}
