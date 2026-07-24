export type AdminLeadStatus = "NEW" | "CONTACTED" | "CLOSED";

export type AdminLeadSort = "newest" | "oldest";

export type AdminLeadBudgetRange = "LOW" | "MEDIUM" | "HIGH" | "ENTERPRISE";

export type AdminLeadRecord = {
  id: number;
  name: string;
  email: string;
  budgetRange: AdminLeadBudgetRange;
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
  error?: {
    code: string;
    details?: unknown;
  };
};

export type AdminLeadFilters = {
  page: number;
  limit: number;
  search: string;
  status: AdminLeadStatus | "";
  sort: AdminLeadSort;
};

export type AdminLeadStatusFeedback = {
  type: "success" | "error";
  message: string;
};
