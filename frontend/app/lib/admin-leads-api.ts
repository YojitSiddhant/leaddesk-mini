import type {
  AdminLeadErrorResponse,
  AdminLeadListData,
  AdminLeadListResponse,
  AdminLeadStatusUpdateResponse,
  AdminLeadSort,
  AdminLeadStatus,
} from "@/app/types/admin-lead";
import { getApiBaseUrl } from "@/app/lib/api-config";

type AdminLeadRequestFilters = {
  page: number;
  limit: number;
  search?: string;
  status?: AdminLeadStatus | "";
  sort: AdminLeadSort;
};

const parseJson = async <T>(response: Response): Promise<T | null> => {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
};

const buildQueryString = (filters: AdminLeadRequestFilters) => {
  const params = new URLSearchParams();
  params.set("page", String(filters.page));
  params.set("limit", String(filters.limit));
  params.set("sort", filters.sort);

  const search = filters.search?.trim();
  if (search) {
    params.set("search", search);
  }

  if (filters.status) {
    params.set("status", filters.status);
  }

  return params.toString();
};

export const fetchAdminLeads = async (
  filters: AdminLeadRequestFilters,
): Promise<
  | { success: true; data: AdminLeadListData; message: string }
  | { success: false; message: string; unauthorized?: boolean }
> => {
  const response = await fetch(
    `${getApiBaseUrl()}/api/admin/leads?${buildQueryString(filters)}`,
    {
      credentials: "include",
      cache: "no-store",
    },
  );

  if (response.status === 401) {
    return {
      success: false,
      unauthorized: true,
      message: "Unauthorized.",
    };
  }

  const payload =
    (await parseJson<AdminLeadListResponse | AdminLeadErrorResponse>(response)) ??
    null;

  if (!response.ok) {
    return {
      success: false,
      message: payload?.message || "Unable to load leads right now.",
    };
  }

  if (!payload || !("data" in payload)) {
    return {
      success: false,
      message: "Unable to load leads right now.",
    };
  }

  return {
    success: true,
    data: payload.data,
    message: payload.message,
  };
};

export const updateAdminLeadStatus = async (
  leadId: number,
  status: AdminLeadStatus,
): Promise<
  | { success: true; data: AdminLeadStatusUpdateResponse["data"]; message: string }
  | {
      success: false;
      message: string;
      unauthorized?: boolean;
      notFound?: boolean;
    }
> => {
  const response = await fetch(
    `${getApiBaseUrl()}/api/admin/leads/${leadId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
      body: JSON.stringify({ status }),
    },
  );

  if (response.status === 401) {
    return {
      success: false,
      unauthorized: true,
      message: "Unauthorized.",
    };
  }

  if (response.status === 404) {
    const payload =
      (await parseJson<AdminLeadErrorResponse>(response)) ?? null;

    return {
      success: false,
      notFound: true,
      message: payload?.message || "Lead not found.",
    };
  }

  const payload =
    (await parseJson<AdminLeadStatusUpdateResponse | AdminLeadErrorResponse>(
      response,
    )) ?? null;

  if (!response.ok) {
    return {
      success: false,
      message: payload?.message || "Unable to update lead status.",
    };
  }

  if (!payload || !("data" in payload)) {
    return {
      success: false,
      message: "Unable to update lead status.",
    };
  }

  return {
    success: true,
    data: payload.data,
    message: payload.message,
  };
};
