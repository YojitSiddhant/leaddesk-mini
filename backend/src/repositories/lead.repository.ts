import type { ResultSetHeader } from "mysql2/promise";

import { getMySqlPool } from "@/database/mysql";
import type { CreateLeadInput } from "@/types/lead";

export const createLead = async (lead: CreateLeadInput): Promise<number> => {
  const pool = getMySqlPool();
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO leads (name, email, budget_range, message)
     VALUES (?, ?, ?, ?)`,
    [lead.name, lead.email, lead.budgetRange, lead.message],
  );

  return Number(result.insertId);
};
