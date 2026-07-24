import { type RowDataPacket } from "mysql2/promise";

import { getMySqlPool } from "@/database/mysql";
import type { AdminUserRecord, AdminUserSummary } from "@/types/admin";

type AdminUserRow = RowDataPacket & {
  id: number | string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

const mapAdminUserRow = (row: AdminUserRow): AdminUserRecord => ({
  id: Number(row.id),
  name: row.name,
  email: row.email,
  passwordHash: row.passwordHash,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

export const findAdminUserByEmail = async (
  email: string,
): Promise<AdminUserRecord | null> => {
  const pool = getMySqlPool();
  const [rows] = await pool.execute<AdminUserRow[]>(
    `SELECT
       id,
       name,
       email,
       password_hash AS passwordHash,
       created_at AS createdAt,
       updated_at AS updatedAt
     FROM admin_users
     WHERE email = ?
     LIMIT 1`,
    [email],
  );

  const [row] = rows;

  return row ? mapAdminUserRow(row) : null;
};

export const mapAdminUserSummary = (
  adminUser: AdminUserRecord,
): AdminUserSummary => ({
  id: adminUser.id,
  name: adminUser.name,
  email: adminUser.email,
});
