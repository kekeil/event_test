import { NextResponse } from "next/server";

import { getBackendBaseUrl } from "@/lib/api/config";
import { AUTH_COOKIE } from "@/lib/auth/constants";

export async function POST(req: Request) {
  const body = await req.json();
  const base = getBackendBaseUrl();
  const res = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const ct = res.headers.get("content-type") ?? "";
  const raw = ct.includes("json") ? await res.json() : await res.text();
  if (!res.ok) {
    return NextResponse.json(
      typeof raw === "string" ? { detail: raw, status: res.status } : raw,
      { status: res.status },
    );
  }
  const data = raw as { token: string; role: string; email: string };
  const response = NextResponse.json({
    ok: true,
    role: data.role,
    email: data.email,
  });
  response.cookies.set(AUTH_COOKIE, data.token, {
    path: "/",
    sameSite: "lax",
    maxAge: 86400,
    secure: process.env.NODE_ENV === "production",
    httpOnly: false,
  });
  return response;
}
