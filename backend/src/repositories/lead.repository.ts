import type { ResultSetHeader } from "mysql2/promise";

import { getMySqlPool } from "@/database/mysql";
import type { CreateLeadInput } from "@/types/lead";

export const createLead = async (lead: CreateLeadInput): Promise<number> => {
  const pool = getMySqlPool();
  console.log("Before database insert");
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO leads (name, email, budget_range, message)
     VALUES (?, ?, ?, ?)`,
    [lead.name, lead.email, lead.budgetRange, lead.message],
  );
  console.log("After database insert");

  return Number(result.insertId);
};
