import type {
  AdminErrorResponse,
  AdminLoginFormValues,
  AdminLoginResponse,
  AdminUserSummary,
} from "@/app/types/admin";
import { getApiBaseUrl } from "@/app/lib/api-config";

const parseJson = async <T>(response: Response): Promise<T | null> => {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
};

export const fetchCurrentAdmin = async (): Promise<AdminUserSummary | null> => {
  const response = await fetch(`${getApiBaseUrl()}/api/admin/me`, {
    credentials: "include",
    cache: "no-store",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Unable to verify the admin session.");
  }

  const payload = (await parseJson<AdminLoginResponse>(response)) ?? null;
  return payload?.data ?? null;
};

export const loginAdmin = async (values: AdminLoginFormValues) => {
  const response = await fetch(`${getApiBaseUrl()}/api/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(values),
  });

  const payload =
    (await parseJson<AdminLoginResponse | AdminErrorResponse>(response)) ?? null;

  if (!response.ok) {
    return {
      success: false,
      message: payload?.message || "Unable to log in right now.",
    } as const;
  }

  if (!payload || !("data" in payload)) {
    return {
      success: false,
      message: "Unable to log in right now.",
    } as const;
  }

  return {
    success: true,
    message: payload.message || "Admin login successful.",
    data: payload.data,
  } as const;
};

export const logoutAdmin = async () => {
  const response = await fetch(`${getApiBaseUrl()}/api/admin/logout`, {
    method: "POST",
    credentials: "include",
  });

  const payload =
    (await parseJson<{ success?: boolean; message?: string }>(response)) ?? null;

  if (!response.ok) {
    return {
      success: false,
      message: payload?.message || "Unable to log out right now.",
    } as const;
  }

  return {
    success: true,
    message: payload?.message || "Logged out successfully.",
  } as const;
};
