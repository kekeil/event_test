"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createEvent, updateEvent } from "@/lib/api/events";
import { extractApiError } from "@/lib/api/client";
import { datetimeLocalToIso, toDatetimeLocalValue } from "@/lib/format-date";
import type { EventDto } from "@/lib/types";
import {
  eventCreateSchema,
  type EventCreateFormValues,
} from "@/lib/schemas/event";

type EventFormProps = {
  mode: "create" | "edit";
  event?: EventDto;
};

export function EventForm({ mode, event }: EventFormProps) {
  const router = useRouter();
  const form = useForm<EventCreateFormValues>({
    resolver: zodResolver(eventCreateSchema),
    defaultValues: event
      ? {
          title: event.title,
          description: event.description ?? "",
          date: toDatetimeLocalValue(event.date),
          location: event.location,
          capacity: event.capacity,
        }
      : {
          title: "",
          description: "",
          date: "",
          location: "",
          capacity: 1,
        },
  });

  async function onSubmit(values: EventCreateFormValues) {
    const payload = {
      title: values.title,
      description: values.description || null,
      date: datetimeLocalToIso(values.date),
      location: values.location,
      capacity: values.capacity,
    };
    try {
      if (mode === "create") {
        await createEvent(payload);
        toast.success("Évènement créé.");
        router.push("/admin/events");
      } else if (event) {
        await updateEvent(event.id, payload);
        toast.success("Évènement mis à jour.");
        router.push("/admin/events");
      }
      router.refresh();
    } catch (err) {
      const { message, fieldErrors } = extractApiError(err);
      if (fieldErrors) {
        for (const [key, msg] of Object.entries(fieldErrors)) {
          if (key in form.getValues()) {
            form.setError(key as keyof EventCreateFormValues, { message: msg });
          }
        }
      }
      toast.error(message);
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mx-auto flex w-full max-w-lg flex-col gap-6"
    >
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="ev-title">Titre</FieldLabel>
              <Input id="ev-title" aria-invalid={fieldState.invalid} {...field} />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="ev-desc">Description (optionnel)</FieldLabel>
              <Textarea
                id="ev-desc"
                rows={4}
                aria-invalid={fieldState.invalid}
                {...field}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        <Controller
          name="date"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="ev-date">Date et heure</FieldLabel>
              <Input
                id="ev-date"
                type="datetime-local"
                aria-invalid={fieldState.invalid}
                {...field}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        <Controller
          name="location"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="ev-loc">Lieu</FieldLabel>
              <Input id="ev-loc" aria-invalid={fieldState.invalid} {...field} />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        <Controller
          name="capacity"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="ev-cap">Capacité</FieldLabel>
              <Input
                id="ev-cap"
                type="number"
                min={1}
                aria-invalid={fieldState.invalid}
                value={Number.isFinite(field.value) ? field.value : ""}
                onChange={(e) => {
                  const v = e.target.valueAsNumber;
                  field.onChange(Number.isNaN(v) ? 0 : v);
                }}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </FieldGroup>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {mode === "create" ? "Créer" : "Enregistrer"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Annuler
        </Button>
      </div>
    </form>
  );
}
