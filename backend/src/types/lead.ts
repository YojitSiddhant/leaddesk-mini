export type LeadBudgetRange = "LOW" | "MEDIUM" | "HIGH" | "ENTERPRISE";

export type CreateLeadInput = {
  name: string;
  email: string;
  budgetRange: LeadBudgetRange;
  message: string;
};

export type CreateLeadRecord = {
  id: number;
  name: string;
  email: string;
  budget_range: LeadBudgetRange;
  message: string;
};

export type ApiError = {
  code: string;
  details?: unknown;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  error: ApiError;
};
