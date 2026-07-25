import type { PoolConnection, RowDataPacket } from "mysql2/promise";

import { getMySqlPool } from "@/database/mysql";

type LeadsTableRow = RowDataPacket & {
  [tableName: string]: unknown;
};

type LeadColumnRow = RowDataPacket & {
  Field: string;
  Type: string;
  Null: "YES" | "NO";
  Key: string;
  Default: string | null;
  Extra: string;
};

const EXPECTED_COLUMNS = [
  {
    name: "id",
    type: /^bigint\(\d+\) unsigned$/i,
    nullable: "NO",
    key: "PRI",
    defaultValue: null,
    extra: "auto_increment",
  },
  {
    name: "name",
    type: /^varchar\(120\)$/i,
    nullable: "NO",
    key: "",
    defaultValue: null,
    extra: "",
  },
  {
    name: "email",
    type: /^varchar\(255\)$/i,
    nullable: "NO",
    key: "",
    defaultValue: null,
    extra: "",
  },
  {
    name: "budget_range",
    type: /^enum\('LOW','MEDIUM','HIGH','ENTERPRISE'\)$/i,
    nullable: "NO",
    key: "",
    defaultValue: null,
    extra: "",
  },
  {
    name: "message",
    type: /^text$/i,
    nullable: "NO",
    key: "",
    defaultValue: null,
    extra: "",
  },
] as const;

const formatColumns = (columns: ReadonlyArray<LeadColumnRow>) =>
  columns
    .map(
      (column) =>
        `${column.Field} ${column.Type} NULL=${column.Null} KEY=${column.Key} DEFAULT=${String(column.Default)} EXTRA=${column.Extra}`,
    )
    .join("\n");

export const verifyLeadsTableSchema = async () => {
  const pool = getMySqlPool();
  let connection: PoolConnection | null = null;

  try {
    connection = await pool.getConnection();

    const [databaseRows] = await connection.query<RowDataPacket[]>(
      "SELECT DATABASE() AS databaseName",
    );
    console.log("SELECT DATABASE() result:");
    console.log(databaseRows);

    const [tableRows] = await connection.query<LeadsTableRow[]>("SHOW TABLES");
    console.log("SHOW TABLES result:");
    console.log(tableRows);
    const tableNames = tableRows.map((row) => String(Object.values(row)[0] ?? ""));

    if (!tableNames.includes("leads")) {
      throw new Error(
        "Missing `leads` table. Expected `SHOW TABLES` to include `leads` before serving requests.",
      );
    }

    const [columnRows] =
      await connection.query<LeadColumnRow[]>("DESCRIBE leads");
    console.log("DESCRIBE leads result:");
    console.log(columnRows);

    const columnsByName = new Map(columnRows.map((column) => [column.Field, column]));
    const missingColumns = EXPECTED_COLUMNS.filter(
      (column) => !columnsByName.has(column.name),
    ).map((column) => column.name);

    if (missingColumns.length > 0) {
      throw new Error(
        `Missing required columns on leads: ${missingColumns.join(", ")}.`,
      );
    }

    const mismatches = EXPECTED_COLUMNS.flatMap((expected) => {
      const actual = columnsByName.get(expected.name);

      if (!actual) {
        return [`${expected.name}: missing`];
      }

      const issues: string[] = [];

      if (!expected.type.test(actual.Type.replace(/\s+/g, " ").trim())) {
        issues.push(`type expected ${expected.type}, got ${actual.Type}`);
      }

      if (actual.Null !== expected.nullable) {
        issues.push(`nullable expected ${expected.nullable}, got ${actual.Null}`);
      }

      if (actual.Key !== expected.key) {
        issues.push(`key expected ${expected.key || "(empty)"}, got ${actual.Key || "(empty)"}`);
      }

      if (actual.Default !== expected.defaultValue) {
        issues.push(
          `default expected ${String(expected.defaultValue)}, got ${String(actual.Default)}`,
        );
      }

      if (actual.Extra !== expected.extra) {
        issues.push(`extra expected ${expected.extra || "(empty)"}, got ${actual.Extra || "(empty)"}`);
      }

      return issues.map((issue) => `${expected.name}: ${issue}`);
    });

    if (mismatches.length > 0) {
      throw new Error(
        `Leads table schema mismatch:\n${mismatches.join("\n")}\n\nCurrent DESCRIBE leads output:\n${formatColumns(columnRows)}`,
      );
    }

    console.log("Leads table schema verification succeeded.");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown schema verification error.";

    console.error(`Leads table schema verification failed: ${message}`);
    throw error;
  } finally {
    connection?.release();
  }
};
