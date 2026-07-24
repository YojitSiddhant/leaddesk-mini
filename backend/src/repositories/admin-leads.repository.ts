import type { RowDataPacket } from "mysql2/promise";

import { getMySqlPool } from "@/database/mysql";
import type {
  AdminLeadListData,
  AdminLeadQuery,
  AdminLeadRecord,
  AdminLeadStatistics,
  AdminLeadStatus,
  AdminLeadSort,
} from "@/types/admin-lead";

type LeadRow = RowDataPacket & {
  id: number | string;
  name: string;
  email: string;
  budgetRange: string;
  message: string;
  status: AdminLeadStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
};

type CountRow = RowDataPacket & {
  totalItems: number | string;
};

type StatsRow = RowDataPacket & {
  total: number | string;
  newCount: number | string;
  contactedCount: number | string;
  closedCount: number | string;
};

const mapLeadRow = (row: LeadRow): AdminLeadRecord => ({
  id: Number(row.id),
  name: row.name,
  email: row.email,
  budgetRange: row.budgetRange as AdminLeadRecord["budgetRange"],
  message: row.message,
  status: row.status,
  createdAt: new Date(row.createdAt).toISOString(),
  updatedAt: new Date(row.updatedAt).toISOString(),
});

const escapeLikeValue = (value: string) =>
  value.replace(/[\\%_]/g, (character) => `\\${character}`);

const buildWhereClause = (
  query: Pick<AdminLeadQuery, "search" | "status">,
) => {
  const conditions: string[] = [];
  const params: Array<string | number> = [];

  if (query.search) {
    const escapedSearch = escapeLikeValue(query.search);
    conditions.push("(name LIKE ? ESCAPE '\\\\' OR email LIKE ? ESCAPE '\\\\')");
    params.push(`%${escapedSearch}%`, `%${escapedSearch}%`);
  }

  if (query.status) {
    conditions.push("status = ?");
    params.push(query.status);
  }

  return {
    whereClause: conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "",
    params,
  };
};

const getSortDirection = (sort: AdminLeadSort) =>
  sort === "oldest" ? "ASC" : "DESC";

const toNumber = (value: number | string) => Number(value);

export const getAdminLeadsDashboardData = async (
  query: AdminLeadQuery,
): Promise<AdminLeadListData> => {
  const pool = getMySqlPool();
  const { whereClause, params } = buildWhereClause(query);
  const offset = (query.page - 1) * query.limit;
  const sortDirection = getSortDirection(query.sort);

  const [countRows] = await pool.query<CountRow[]>(
    `SELECT COUNT(*) AS totalItems
     FROM leads
     ${whereClause}`,
    params,
  );

  const [leadRows] = await pool.query<LeadRow[]>(
    `SELECT
       id,
       name,
       email,
       budget_range AS budgetRange,
       message,
       status,
       created_at AS createdAt,
       updated_at AS updatedAt
     FROM leads
     ${whereClause}
     ORDER BY created_at ${sortDirection}, id ${sortDirection}
     LIMIT ?
     OFFSET ?`,
    [...params, query.limit, offset],
  );

  const [statsRows] = await pool.query<StatsRow[]>(
    `SELECT
       COUNT(*) AS total,
       COALESCE(SUM(CASE WHEN status = 'NEW' THEN 1 ELSE 0 END), 0) AS newCount,
       COALESCE(SUM(CASE WHEN status = 'CONTACTED' THEN 1 ELSE 0 END), 0) AS contactedCount,
       COALESCE(SUM(CASE WHEN status = 'CLOSED' THEN 1 ELSE 0 END), 0) AS closedCount
     FROM leads`,
  );

  const [countRow] = countRows;
  const [statsRow] = statsRows;

  const totalItems = countRow ? toNumber(countRow.totalItems) : 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / query.limit));

  return {
    leads: leadRows.map(mapLeadRow),
    pagination: {
      page: query.page,
      limit: query.limit,
      totalItems,
      totalPages,
      hasPreviousPage: query.page > 1,
      hasNextPage: query.page < totalPages,
    },
    statistics: {
      total: statsRow ? toNumber(statsRow.total) : 0,
      new: statsRow ? toNumber(statsRow.newCount) : 0,
      contacted: statsRow ? toNumber(statsRow.contactedCount) : 0,
      closed: statsRow ? toNumber(statsRow.closedCount) : 0,
    } satisfies AdminLeadStatistics,
  };
};
