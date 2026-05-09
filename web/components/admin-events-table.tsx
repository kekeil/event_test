"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { PaginationBar } from "@/components/pagination-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteEvent, listEvents } from "@/lib/api/events";
import { extractApiError } from "@/lib/api/client";
import { formatDateShort } from "@/lib/format-date";
import type { EventDto, PageResponse } from "@/lib/types";

type AdminEventsTableProps = {
  initial: PageResponse<EventDto>;
  urlPage: number;
};

export function AdminEventsTable({ initial, urlPage }: AdminEventsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const mounted = useRef(false);

  const search = searchParams.get("search") ?? "";
  const date = searchParams.get("date") ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listEvents({
        search: search || undefined,
        date: date || undefined,
        page: page - 1,
        limit: 12,
      });
      setData(res);
    } catch (e) {
      toast.error(extractApiError(e).message);
    } finally {
      setLoading(false);
    }
  }, [search, date, page]);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    void refetch();
  }, [refetch]);

  async function handleDelete(id: string) {
    try {
      await deleteEvent(id);
      toast.success("Évènement supprimé.");
      setDeleteId(null);
      await refetch();
      router.refresh();
    } catch (e) {
      toast.error(extractApiError(e).message);
    }
  }

  const rows = data.items;
  const showSkeleton = loading;

  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Lieu</TableHead>
              <TableHead className="text-right">Capacité</TableHead>
              <TableHead className="text-right">Inscrits</TableHead>
              <TableHead className="w-12 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {showSkeleton
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={6}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              : rows.map((ev) => {
                  const registered = ev.capacity - ev.remainingSeats;
                  return (
                    <TableRow key={ev.id}>
                      <TableCell className="font-medium">{ev.title}</TableCell>
                      <TableCell>{formatDateShort(ev.date)}</TableCell>
                      <TableCell>{ev.location}</TableCell>
                      <TableCell className="text-right">{ev.capacity}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">
                          {registered} / {ev.capacity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/events/${ev.id}/edit`}>
                                Modifier
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/admin/events/${ev.id}/registrations`}
                              >
                                Voir les inscrits
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => setDeleteId(ev.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </div>
      <PaginationBar
        totalPages={data.totalPages}
        currentPage={urlPage}
        basePath="/admin/events"
      />
      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Supprimer cet évènement ?"
        description="Cette action est irréversible. Les inscriptions associées seront supprimées côté serveur si la cascade est configurée."
        confirmLabel="Supprimer"
        variant="destructive"
        onConfirm={async () => {
          if (deleteId) await handleDelete(deleteId);
        }}
      />
    </div>
  );
}
