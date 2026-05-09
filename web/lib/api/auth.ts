export type LoginSuccess = { ok: true; role: string; email: string };

export async function loginViaNext(
  email: string,
  password: string,
): Promise<LoginSuccess> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = new Error("Login failed") as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  return (await res.json()) as LoginSuccess;
}

export async function logoutViaNext(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}
