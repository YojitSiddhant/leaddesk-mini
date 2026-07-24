export type AdminUserSummary = {
  id: number;
  name: string;
  email: string;
};

export type AdminLoginFormValues = {
  email: string;
  password: string;
};

export type AdminFieldErrors = Partial<Record<keyof AdminLoginFormValues, string>>;

export type AdminLoginResponse = {
  success: true;
  message: string;
  data: AdminUserSummary;
};

export type AdminErrorResponse = {
  success: false;
  message: string;
  error?: {
    code: string;
    details?: unknown;
  };
};
