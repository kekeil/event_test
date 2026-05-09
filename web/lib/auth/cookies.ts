import "server-only";

import { AUTH_COOKIE } from "@/lib/auth/constants";

export function getAuthTokenFromCookies(cookieStore: {
  get: (name: string) => { value: string } | undefined;
}): string | undefined {
  return cookieStore.get(AUTH_COOKIE)?.value;
}
