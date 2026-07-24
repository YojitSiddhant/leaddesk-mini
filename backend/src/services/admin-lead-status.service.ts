import type { AdminLeadStatusUpdateInput } from "@/types/admin-lead";

import { updateAdminLeadStatus } from "@/repositories/admin-lead-status.repository";

export const changeAdminLeadStatus = async (
  input: AdminLeadStatusUpdateInput,
) => {
  return updateAdminLeadStatus(input.id, input.status);
};
