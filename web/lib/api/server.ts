import "server-only";

import { getBackendBaseUrl } from "@/lib/api/config";
import { getAuthTokenFromCookies } from "@/lib/auth/cookies";

export { getBackendBaseUrl } from "@/lib/api/config";

export async function serverFetchJson<T>(
  path: string,
  cookieStore: { get: (name: string) => { value: string } | undefined },
  init?: RequestInit,
): Promise<T> {
  const base = getBackendBaseUrl();
  const token = getAuthTokenFromCookies(cookieStore);
  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json() as Promise<T>;
}
