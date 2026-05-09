import { z } from "zod";

export const eventCreateSchema = z.object({
  title: z.string().min(1, "Titre requis").max(100, "100 caractères max"),
  description: z.string().optional(),
  date: z
    .string()
    .min(1, "Date requise")
    .refine((v) => new Date(v).getTime() > Date.now(), {
      message: "La date doit être future",
    }),
  location: z.string().min(1, "Lieu requis"),
  capacity: z.number().int().min(1, "Capacité minimum : 1"),
});

export type EventCreateFormValues = z.infer<typeof eventCreateSchema>;

export const eventUpdateSchema = eventCreateSchema;

export type EventUpdateFormValues = z.infer<typeof eventUpdateSchema>;
