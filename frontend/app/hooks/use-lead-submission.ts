"use client";

import { useState } from "react";

import { submitLead } from "@/app/lib/api";
import {
  defaultLeadValues,
  validateLeadValues,
} from "@/app/lib/lead-validation";
import type {
  LeadFieldErrors,
  LeadFormValues,
} from "@/app/types/lead";

export const useLeadSubmission = () => {
  const [values, setValues] = useState<LeadFormValues>(defaultLeadValues);
  const [errors, setErrors] = useState<LeadFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const updateField = <K extends keyof LeadFormValues>(
    field: K,
    value: LeadFormValues[K],
  ) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
    setSubmitError("");
  };

  const resetForm = () => {
    setValues(defaultLeadValues);
    setErrors({});
  };

  const handleSubmit = async () => {
    const { errors: validationErrors, isValid, sanitizedValues } =
      validateLeadValues(values);

    if (!isValid) {
      setErrors(validationErrors);
      setSuccessMessage("");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSuccessMessage("");

    try {
      const response = await submitLead(sanitizedValues);

      if (response.success && response.data?.id) {
        setSuccessMessage("Lead submitted successfully.");
        resetForm();
        return;
      }

      setSubmitError(response.message || "Something went wrong.");
    } catch {
      setSubmitError("Unable to submit the lead right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values,
    errors,
    isSubmitting,
    successMessage,
    submitError,
    updateField,
    handleSubmit,
  };
};
