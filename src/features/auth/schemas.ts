import { z } from "zod";

export const emailSchema = z.string().trim().toLowerCase().max(254).email("Enter a valid email address.");

export const passwordSchema = z
  .string()
  .min(8, "Use at least 8 characters.")
  .max(72, "Use 72 characters or fewer.")
  .regex(/[A-Za-z]/, "Include at least one letter.")
  .regex(/\d/, "Include at least one number.");

export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(60, "Use 60 characters or fewer."),
  email: emailSchema,
  password: passwordSchema,
});

export const signInSchema = z.object({ email: emailSchema, password: z.string().min(1, "Enter your password.").max(200) });

export type FormState = { error?: string; fieldErrors?: Partial<Record<"name" | "email" | "password", string>>; values?: { name?: string; email?: string } };
