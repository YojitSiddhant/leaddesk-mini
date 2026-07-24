import type { AdminLeadQuery } from "@/types/admin-lead";

import { getAdminLeadsDashboardData } from "@/repositories/admin-leads.repository";

export const listAdminLeads = async (query: AdminLeadQuery) => {
  return getAdminLeadsDashboardData(query);
};
