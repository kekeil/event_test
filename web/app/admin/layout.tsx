import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin-shell";
import { decodeJwtPayload } from "@/lib/auth/decode";
import { getAuthTokenFromCookies } from "@/lib/auth/cookies";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = getAuthTokenFromCookies(cookieStore);
  if (!token) {
    redirect("/login?next=/admin/events");
  }
  const payload = decodeJwtPayload(token);
  if (!payload || payload.role !== "ADMIN") {
    redirect("/login?next=/admin/events");
  }
  const email = payload.sub ?? "";

  return <AdminShell userEmail={email}>{children}</AdminShell>;
}
