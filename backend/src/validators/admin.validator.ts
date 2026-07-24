import { z } from "zod";

export const adminLoginSchema = z
  .object({
    email: z.string().trim().email(),
    password: z.string().min(1, "Password is required."),
  })
  .strict();

export type AdminLoginDto = z.infer<typeof adminLoginSchema>;
