import { z } from "zod";

import type {
  AdminFieldErrors,
  AdminLoginFormValues,
} from "@/app/types/admin";

export const defaultAdminLoginValues: AdminLoginFormValues = {
  email: "",
  password: "",
};

const adminLoginSchema = z
  .object({
    email: z.string().trim().email("Enter a valid email address."),
    password: z.string().min(1, "Password is required."),
  })
  .strict();

export const validateAdminLoginValues = (values: AdminLoginFormValues) => {
  const result = adminLoginSchema.safeParse(values);

  if (result.success) {
    return {
      errors: {},
      isValid: true,
      sanitizedValues: result.data,
    };
  }

  const errors: AdminFieldErrors = {};

  for (const issue of result.error.issues) {
    const field = issue.path[0];

    if (field === "email" || field === "password") {
      errors[field] = issue.message;
    }
  }

  return {
    errors,
    isValid: false,
    sanitizedValues: {
      email: values.email.trim(),
      password: values.password,
    } satisfies AdminLoginFormValues,
  };
};
