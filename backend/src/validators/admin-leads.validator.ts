import { z } from "zod";

import type { AdminLeadQuery } from "@/types/admin-lead";

export const adminLeadsQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(10),
    search: z.string().trim().min(1).max(255).optional(),
    status: z.enum(["NEW", "CONTACTED", "CLOSED"]).optional(),
    sort: z.enum(["newest", "oldest"]).default("newest"),
  })
  .strict();

export type AdminLeadsQueryDto = z.infer<typeof adminLeadsQuerySchema>;

export const toAdminLeadsQuery = (
  query: AdminLeadsQueryDto,
): AdminLeadQuery => ({
  page: query.page,
  limit: query.limit,
  search: query.search,
  status: query.status,
  sort: query.sort,
});
