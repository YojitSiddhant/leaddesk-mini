import { z } from "zod";

const leadBudgetRangeSchema = z.enum(["LOW", "MEDIUM", "HIGH", "ENTERPRISE"]);

export const createLeadSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email(),
    budgetRange: leadBudgetRangeSchema,
    message: z.string().trim().min(10).max(5000),
  })
  .strict();

export type CreateLeadDto = z.infer<typeof createLeadSchema>;

