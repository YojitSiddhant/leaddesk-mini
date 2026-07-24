import { isMySqlAvailable } from "@/database/test-connection";

export type HealthStatus = {
  application: "healthy";
  database: "connected" | "disconnected";
  timestamp: string;
};

export const getHealthStatus = async (): Promise<HealthStatus> => {
  const databaseConnected = await isMySqlAvailable();

  return {
    application: "healthy",
    database: databaseConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  };
};
