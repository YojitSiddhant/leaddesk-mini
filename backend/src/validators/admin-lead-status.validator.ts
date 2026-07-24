import { z } from "zod";

export const adminLeadStatusParamsSchema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .strict();

export const adminLeadStatusBodySchema = z
  .object({
    status: z.enum(["NEW", "CONTACTED", "CLOSED"]),
  })
  .strict();

export type AdminLeadStatusParamsDto = z.infer<
  typeof adminLeadStatusParamsSchema
>;

export type AdminLeadStatusBodyDto = z.infer<typeof adminLeadStatusBodySchema>;
