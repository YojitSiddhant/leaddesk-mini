"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { fetchCurrentAdmin, loginAdmin } from "@/app/lib/admin-api";
import {
  defaultAdminLoginValues,
  validateAdminLoginValues,
} from "@/app/lib/admin-auth-validation";
import type {
  AdminFieldErrors,
  AdminLoginFormValues,
} from "@/app/types/admin";

export const useAdminLogin = () => {
  const router = useRouter();
  const [values, setValues] = useState<AdminLoginFormValues>(
    defaultAdminLoginValues,
  );
  const [errors, setErrors] = useState<AdminFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      try {
        const adminUser = await fetchCurrentAdmin();

        if (adminUser) {
          router.replace("/admin/dashboard");
          return;
        }
      } catch {
        if (isMounted) {
          setSubmitError("");
        }
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    };

    void verifySession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const updateField = <K extends keyof AdminLoginFormValues>(
    field: K,
    value: AdminLoginFormValues[K],
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

  const handleSubmit = async () => {
    const { errors: validationErrors, isValid, sanitizedValues } =
      validateAdminLoginValues(values);

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await loginAdmin(sanitizedValues);

      if (response.success) {
        router.replace("/admin/dashboard");
        return;
      }

      setSubmitError(response.message);
    } catch {
      setSubmitError("Unable to log in right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values,
    errors,
    isSubmitting,
    isCheckingSession,
    submitError,
    updateField,
    handleSubmit,
  };
};
