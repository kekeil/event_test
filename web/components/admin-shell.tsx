import Link from "next/link";

import { cn } from "@/lib/utils";

type AdminShellProps = {
  userEmail: string;
  children: React.ReactNode;
};

export function AdminShell({ userEmail, children }: AdminShellProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col gap-6">
      <div className="bg-muted/40 border-b">
        <div className="container mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Administration
            </p>
            <p className="text-sm">{userEmail}</p>
          </div>
          <nav className="flex flex-wrap gap-2">
            <Link
              href="/admin/events"
              className={cn(
                "text-muted-foreground hover:text-foreground rounded-md px-3 py-1.5 text-sm transition-colors",
              )}
            >
              Évènements
            </Link>
            <Link
              href="/events"
              className={cn(
                "text-muted-foreground hover:text-foreground rounded-md px-3 py-1.5 text-sm transition-colors",
              )}
            >
              Voir le site public
            </Link>
          </nav>
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
