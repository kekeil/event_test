"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteRegistration, listRegistrations } from "@/lib/api/registrations";
import { extractApiError } from "@/lib/api/client";
import { formatDateShort } from "@/lib/format-date";
import type { EventDto, RegistrationDto } from "@/lib/types";

type AdminRegistrationsTableProps = {
  event: EventDto;
  initial: RegistrationDto[];
};

export function AdminRegistrationsTable({
  event,
  initial,
}: AdminRegistrationsTableProps) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [cancelId, setCancelId] = useState<string | null>(null);

  async function refetch() {
    try {
      const next = await listRegistrations(event.id);
      setRows(next);
      router.refresh();
    } catch (e) {
      toast.error(extractApiError(e).message);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteRegistration(id);
      toast.success("Inscription annulée.");
      setCancelId(null);
      await refetch();
    } catch (e) {
      toast.error(extractApiError(e).message);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prénom</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Inscrit le</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-muted-foreground py-8 text-center"
                >
                  Aucune inscription pour le moment.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.firstName}</TableCell>
                  <TableCell>{r.lastName}</TableCell>
                  <TableCell>{r.email}</TableCell>
                  <TableCell>{formatDateShort(r.registeredAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setCancelId(r.id)}
                    >
                      Annuler
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <ConfirmDialog
        open={cancelId !== null}
        onOpenChange={(open) => !open && setCancelId(null)}
        title="Annuler cette inscription ?"
        description="La place sera de nouveau disponible pour d'autres participants."
        confirmLabel={"Annuler l'inscription"}
        variant="destructive"
        onConfirm={async () => {
          if (cancelId) await handleDelete(cancelId);
        }}
      />
    </div>
  );
}
