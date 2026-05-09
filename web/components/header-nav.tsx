"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutViaNext } from "@/lib/api/auth";

type HeaderNavProps = {
  isAdmin: boolean;
  email?: string;
};

export function HeaderNav({ isAdmin, email }: HeaderNavProps) {
  const router = useRouter();

  async function handleLogout() {
    try {
      await logoutViaNext();
      toast.success("Déconnexion effectuée.");
      router.push("/events");
      router.refresh();
    } catch {
      toast.error("Impossible de se déconnecter.");
    }
  }

  if (isAdmin) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            Admin
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-48">
          <div className="text-muted-foreground px-2 py-1.5 text-xs">
            {email ?? ""}
          </div>
          <DropdownMenuItem asChild>
            <Link href="/admin/events">Tableau de bord</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => void handleLogout()}>
            Déconnexion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button variant="ghost" size="sm" asChild>
      <Link href="/login">Connexion</Link>
    </Button>
  );
}
