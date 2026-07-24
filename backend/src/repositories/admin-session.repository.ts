import { type ResultSetHeader, type RowDataPacket } from "mysql2/promise";

import { getMySqlPool } from "@/database/mysql";
import type { AdminSessionWithUser, AdminUserSummary } from "@/types/admin";

type AdminSessionRow = RowDataPacket & {
  id: number | string;
  sessionToken: string;
  adminUserId: number | string;
  expiresAt: Date;
  createdAt: Date;
};

type AdminSessionWithUserRow = RowDataPacket & {
  id: number | string;
  sessionToken: string;
  adminUserId: number | string;
  expiresAt: Date;
  createdAt: Date;
  adminUserName: string;
  adminUserEmail: string;
};

const mapAdminSessionRow = (row: AdminSessionRow) => ({
  id: Number(row.id),
  sessionToken: row.sessionToken,
  adminUserId: Number(row.adminUserId),
  expiresAt: row.expiresAt,
  createdAt: row.createdAt,
});

export const createAdminSession = async (input: {
  sessionTokenHash: string;
  adminUserId: number;
  expiresAt: Date;
}): Promise<void> => {
  const pool = getMySqlPool();
  await pool.execute<ResultSetHeader>(
    `INSERT INTO admin_sessions (session_token, admin_user_id, expires_at)
     VALUES (?, ?, ?)`,
    [input.sessionTokenHash, input.adminUserId, input.expiresAt],
  );
};

export const findAdminSessionByToken = async (
  sessionTokenHash: string,
): Promise<AdminSessionWithUser | null> => {
  const pool = getMySqlPool();
  const [rows] = await pool.execute<AdminSessionWithUserRow[]>(
    `SELECT
       s.id,
       s.session_token AS sessionToken,
       s.admin_user_id AS adminUserId,
       s.expires_at AS expiresAt,
       s.created_at AS createdAt,
       u.name AS adminUserName,
       u.email AS adminUserEmail
     FROM admin_sessions s
     INNER JOIN admin_users u ON u.id = s.admin_user_id
     WHERE s.session_token = ?
       AND s.expires_at > NOW()
     LIMIT 1`,
    [sessionTokenHash],
  );

  const [row] = rows;

  if (!row) {
    return null;
  }

  const session = mapAdminSessionRow(row);

  return {
    ...session,
    adminUser: {
      id: Number(row.adminUserId),
      name: row.adminUserName,
      email: row.adminUserEmail,
    } satisfies AdminUserSummary,
  };
};

export const deleteAdminSessionByToken = async (
  sessionTokenHash: string,
): Promise<void> => {
  const pool = getMySqlPool();
  await pool.execute<ResultSetHeader>(
    `DELETE FROM admin_sessions WHERE session_token = ?`,
    [sessionTokenHash],
  );
};
