import { z } from "zod";

export const registrationCreateSchema = z.object({
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
});

export type RegistrationCreateFormValues = z.infer<
  typeof registrationCreateSchema
>;
