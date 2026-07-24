"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { logoutAdmin } from "@/app/lib/admin-api";

export const useAdminLogout = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setLogoutError("");

    try {
      const response = await logoutAdmin();

      if (!response.success) {
        setLogoutError(response.message);
        return;
      }

      router.replace("/admin/login");
      router.refresh();
    } catch {
      setLogoutError("Unable to log out right now. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return {
    isLoggingOut,
    logoutError,
    handleLogout,
  };
};
