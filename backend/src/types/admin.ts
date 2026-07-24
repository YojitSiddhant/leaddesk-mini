import type { ApiError } from "@/types/lead";

export type AdminUserRecord = {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminUserSummary = {
  id: number;
  name: string;
  email: string;
};

export type AdminSessionRecord = {
  id: number;
  sessionToken: string;
  adminUserId: number;
  expiresAt: Date;
  createdAt: Date;
};

export type AdminSessionWithUser = AdminSessionRecord & {
  adminUser: AdminUserSummary;
};

export type AdminLoginInput = {
  email: string;
  password: string;
};

export type AdminLoginResponse = {
  success: true;
  message: string;
  data: AdminUserSummary;
};

export type AdminErrorResponse = {
  success: false;
  message: string;
  error: ApiError;
};

export type AdminMeResponse = AdminLoginResponse | AdminErrorResponse;
export type AdminLoginRouteResponse = AdminLoginResponse | AdminErrorResponse;

export type AdminSessionLocals = {
  adminUser: AdminUserSummary;
};
