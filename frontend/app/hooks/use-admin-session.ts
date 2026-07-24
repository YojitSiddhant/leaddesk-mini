"use client";

import { useEffect, useState } from "react";

import { fetchCurrentAdmin } from "@/app/lib/admin-api";
import type { AdminUserSummary } from "@/app/types/admin";

export type AdminSessionStatus = "loading" | "authenticated" | "unauthenticated";

export const useAdminSession = () => {
  const [status, setStatus] = useState<AdminSessionStatus>("loading");
  const [adminUser, setAdminUser] = useState<AdminUserSummary | null>(null);

  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      try {
        const currentAdmin = await fetchCurrentAdmin();

        if (!isMounted) {
          return;
        }

        if (currentAdmin) {
          setAdminUser(currentAdmin);
          setStatus("authenticated");
          return;
        }

        setAdminUser(null);
        setStatus("unauthenticated");
      } catch {
        if (!isMounted) {
          return;
        }

        setAdminUser(null);
        setStatus("unauthenticated");
      }
    };

    void verifySession();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    status,
    adminUser,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  };
};
