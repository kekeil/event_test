"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
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
import { registerToEvent } from "@/lib/api/events";
import { extractApiError } from "@/lib/api/client";
import {
  registrationCreateSchema,
  type RegistrationCreateFormValues,
} from "@/lib/schemas/registration";

type RegistrationFormProps = {
  eventId: string;
};

export function RegistrationForm({ eventId }: RegistrationFormProps) {
  const router = useRouter();
  const form = useForm<RegistrationCreateFormValues>({
    resolver: zodResolver(registrationCreateSchema),
    defaultValues: { firstName: "", lastName: "", email: "" },
  });

  async function onSubmit(values: RegistrationCreateFormValues) {
    try {
      await registerToEvent(eventId, values);
      toast.success(
        "Inscription confirmée. Un mail de confirmation vous a été envoyé.",
      );
      form.reset();
      router.refresh();
    } catch (e) {
      if (!axios.isAxiosError(e)) {
        toast.error("Une erreur s'est produite.");
        return;
      }
      const status = e.response?.status;
      const { code, message, fieldErrors } = extractApiError(e);
      if (code === "DUPLICATE_EMAIL" || status === 409) {
        toast.error(
          "Cette adresse email est déjà enregistrée pour cet évènement.",
        );
        return;
      }
      if (code === "CAPACITY_REACHED" || status === 422) {
        toast.error("Cet évènement vient de se remplir.");
        router.refresh();
        return;
      }
      if (code === "VALIDATION_ERROR" && fieldErrors) {
        for (const [field, msg] of Object.entries(fieldErrors)) {
          if (field === "firstName" || field === "lastName" || field === "email") {
            form.setError(field, { message: msg });
          }
        }
        return;
      }
      toast.error(message);
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <FieldGroup>
        <Controller
          name="firstName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="reg-firstName">Prénom</FieldLabel>
              <Input
                id="reg-firstName"
                autoComplete="given-name"
                aria-invalid={fieldState.invalid}
                {...field}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        <Controller
          name="lastName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="reg-lastName">Nom</FieldLabel>
              <Input
                id="reg-lastName"
                autoComplete="family-name"
                aria-invalid={fieldState.invalid}
                {...field}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="reg-email">Email</FieldLabel>
              <Input
                id="reg-email"
                type="email"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
                {...field}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </FieldGroup>
      <Button
        type="submit"
        className="w-full sm:w-auto"
        disabled={form.formState.isSubmitting}
      >
        S&apos;inscrire
      </Button>
    </form>
  );
}
