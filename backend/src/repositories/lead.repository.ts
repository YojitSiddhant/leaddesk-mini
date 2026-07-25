import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

import { getMySqlPool } from "@/database/mysql";
import type { CreateLeadInput } from "@/types/lead";

export const createLead = async (lead: CreateLeadInput): Promise<number> => {
  const pool = getMySqlPool();
  const [countRows] = await pool.query<RowDataPacket[]>(
    "SELECT COUNT(*) AS count FROM leads",
  );
  console.log("SELECT COUNT(*) FROM leads:");
  console.log(countRows);

  try {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO leads (name, email, budget_range, message)
       VALUES (?, ?, ?, ?)`,
      [lead.name, lead.email, lead.budgetRange, lead.message],
    );

    return Number(result.insertId);
  } catch (error) {
    console.error("MySQL INSERT failed");
    console.error(error);

    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }

    if (typeof error === "object" && error !== null) {
      const mysqlError = error as {
        code?: unknown;
        errno?: unknown;
        sqlState?: unknown;
        sqlMessage?: unknown;
      };

      console.error({
        code: mysqlError.code,
        errno: mysqlError.errno,
        sqlState: mysqlError.sqlState,
        sqlMessage: mysqlError.sqlMessage,
      });
    }

    throw error;
  }
};
