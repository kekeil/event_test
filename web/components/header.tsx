import Link from "next/link";
import { cookies } from "next/headers";

import { HeaderNav } from "@/components/header-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { decodeJwtPayload } from "@/lib/auth/decode";
import { getAuthTokenFromCookies } from "@/lib/auth/cookies";
import { cn } from "@/lib/utils";

export async function Header() {
  const cookieStore = await cookies();
  const token = getAuthTokenFromCookies(cookieStore);
  const payload = token ? decodeJwtPayload(token) : null;
  const isAdmin = payload?.role === "ADMIN";
  const email = payload?.sub;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-md",
      )}
    >
      <div className="container mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/events"
          className="text-foreground text-base font-semibold tracking-tight transition-opacity hover:opacity-80"
        >
          Events
        </Link>
        <div className="flex items-center gap-2">
          <HeaderNav isAdmin={isAdmin} email={email} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
