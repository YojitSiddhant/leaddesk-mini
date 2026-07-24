import {
  budgetOptions,
  type LeadFieldErrors,
  type LeadFormValues,
} from "@/app/types/lead";

const budgetSet = new Set<string>(budgetOptions);

export const defaultLeadValues: LeadFormValues = {
  name: "",
  email: "",
  budgetRange: "LOW",
  message: "",
};

export const validateLeadValues = (values: LeadFormValues) => {
  const errors: LeadFieldErrors = {};

  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();

  if (name.length < 2) {
    errors.name = "Name must be at least 2 characters.";
  } else if (name.length > 120) {
    errors.name = "Name must be 120 characters or less.";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!budgetSet.has(values.budgetRange)) {
    errors.budgetRange = "Select a valid budget range.";
  }

  if (message.length < 10) {
    errors.message = "Message must be at least 10 characters.";
  } else if (message.length > 5000) {
    errors.message = "Message must be 5000 characters or less.";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
    sanitizedValues: {
      name,
      email,
      budgetRange: values.budgetRange,
      message,
    } satisfies LeadFormValues,
  };
};
