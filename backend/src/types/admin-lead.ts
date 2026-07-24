import type { LeadBudgetRange } from "@/types/lead";
import type { ApiError } from "@/types/lead";

export type AdminLeadStatus = "NEW" | "CONTACTED" | "CLOSED";

export type AdminLeadSort = "newest" | "oldest";

export type AdminLeadQuery = {
  page: number;
  limit: number;
  search?: string;
  status?: AdminLeadStatus;
  sort: AdminLeadSort;
};

export type AdminLeadRecord = {
  id: number;
  name: string;
  email: string;
  budgetRange: LeadBudgetRange;
  message: string;
  status: AdminLeadStatus;
  createdAt: string;
  updatedAt: string;
};

export type AdminLeadPagination = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type AdminLeadStatistics = {
  total: number;
  new: number;
  contacted: number;
  closed: number;
};

export type AdminLeadListData = {
  leads: AdminLeadRecord[];
  pagination: AdminLeadPagination;
  statistics: AdminLeadStatistics;
};

export type AdminLeadListResponse = {
  success: true;
  message: string;
  data: AdminLeadListData;
};

export type AdminLeadStatusUpdateInput = {
  id: number;
  status: AdminLeadStatus;
};

export type AdminLeadStatusUpdateResult = {
  id: number;
  status: AdminLeadStatus;
};

export type AdminLeadStatusUpdateResponse = {
  success: true;
  message: string;
  data: AdminLeadStatusUpdateResult;
};

export type AdminLeadErrorResponse = {
  success: false;
  message: string;
  error: ApiError;
};
