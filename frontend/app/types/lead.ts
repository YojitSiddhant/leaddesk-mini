export const budgetOptions = ["LOW", "MEDIUM", "HIGH", "ENTERPRISE"] as const;

export type BudgetOption = (typeof budgetOptions)[number];

export type LeadFormValues = {
  name: string;
  email: string;
  budgetRange: BudgetOption;
  message: string;
};

export type LeadFieldErrors = Partial<Record<keyof LeadFormValues, string>>;

export type LeadSubmissionResponse = {
  success: boolean;
  message: string;
  data?: {
    id: number;
  };
  error?: {
    code: string;
    details?: unknown;
  };
};
