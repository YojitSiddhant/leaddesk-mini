import { getMySqlPool } from "@/database/mysql";
import { AppError } from "@/errors/app-error";
import type { RowDataPacket } from "mysql2/promise";
import type {
  AdminLeadStatus,
  AdminLeadStatusUpdateResult,
} from "@/types/admin-lead";

type LeadExistsRow = RowDataPacket & {
  id: number | string;
};

export const updateAdminLeadStatus = async (
  leadId: number,
  status: AdminLeadStatus,
): Promise<AdminLeadStatusUpdateResult> => {
  const pool = getMySqlPool();

  const [leadRows] = await pool.query<LeadExistsRow[]>(
    `SELECT id
     FROM leads
     WHERE id = ?
     LIMIT 1`,
    [leadId],
  );

  if (leadRows.length === 0) {
    throw new AppError("Lead not found.", 404, true, "NOT_FOUND");
  }

  await pool.query(
    `UPDATE leads
     SET status = ?
     WHERE id = ?`,
    [status, leadId],
  );

  return {
    id: leadId,
    status,
  };
};
