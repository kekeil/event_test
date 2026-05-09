import { NextResponse } from "next/server";

import { AUTH_COOKIE } from "@/lib/auth/constants";

export async function POST() {
  const response = new NextResponse(null, { status: 204 });
  response.cookies.set(AUTH_COOKIE, "", {
    path: "/",
    maxAge: 0,
    sameSite: "lax",
  });
  return response;
}
