"use client";

import { useEffect, useRef, useState } from "react";

import { fetchAdminLeads, updateAdminLeadStatus } from "@/app/lib/admin-leads-api";
import type {
  AdminLeadFilters,
  AdminLeadListData,
  AdminLeadSort,
  AdminLeadStatusFeedback,
  AdminLeadStatus,
} from "@/app/types/admin-lead";

const DEFAULT_LIMIT = 10;
const SEARCH_DEBOUNCE_MS = 400;

const statusToStatisticsKey = {
  NEW: "new",
  CONTACTED: "contacted",
  CLOSED: "closed",
} as const;

const defaultFilters: AdminLeadFilters = {
  page: 1,
  limit: DEFAULT_LIMIT,
  search: "",
  status: "",
  sort: "newest",
};

export const useAdminLeads = (enabled: boolean) => {
  const [filters, setFilters] = useState<AdminLeadFilters>(defaultFilters);
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
  const [data, setData] = useState<AdminLeadListData | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [reloadCounter, setReloadCounter] = useState(0);
  const [leadStatusDrafts, setLeadStatusDrafts] = useState<
    Record<number, AdminLeadStatus>
  >({});
  const [savingLeadId, setSavingLeadId] = useState<number | null>(null);
  const [leadStatusFeedback, setLeadStatusFeedback] =
    useState<AdminLeadStatusFeedback | null>(null);
  const hasLoadedOnceRef = useRef(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(filters.search.trim());
      setFilters((current) =>
        current.page === 1 ? current : { ...current, page: 1 },
      );
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [filters.search]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const controller = new AbortController();

    const loadLeads = async () => {
      if (hasLoadedOnceRef.current) {
        setIsRefreshing(true);
      } else {
        setIsInitialLoading(true);
      }

      setError("");

      try {
        const response = await fetchAdminLeads({
          page: filters.page,
          limit: filters.limit,
          search: debouncedSearch || undefined,
          status: filters.status || undefined,
          sort: filters.sort,
        });

        if (controller.signal.aborted) {
          return;
        }

        if (response.success) {
          setData(response.data);
          hasLoadedOnceRef.current = true;
          setIsUnauthorized(false);
          setLeadStatusDrafts(
            response.data.leads.reduce<Record<number, AdminLeadStatus>>(
              (accumulator, lead) => {
                accumulator[lead.id] = lead.status;
                return accumulator;
              },
              {},
            ),
          );
          return;
        }

        if (response.unauthorized) {
          hasLoadedOnceRef.current = true;
          setIsUnauthorized(true);
          return;
        }

        setData(null);
        hasLoadedOnceRef.current = true;
        setError(response.message);
      } catch {
        if (!controller.signal.aborted) {
          setData(null);
          hasLoadedOnceRef.current = true;
          setError("Unable to load the dashboard right now. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsInitialLoading(false);
          setIsRefreshing(false);
        }
      }
    };

    void loadLeads();

    return () => {
      controller.abort();
    };
  }, [
    debouncedSearch,
    enabled,
    filters.limit,
    filters.page,
    filters.sort,
    filters.status,
    reloadCounter,
  ]);

  const hasActiveFilters =
    filters.search.trim().length > 0 ||
    filters.status.length > 0 ||
    filters.sort !== "newest";

  const setSearch = (value: string) => {
    setFilters((current) => ({
      ...current,
      search: value,
    }));
  };

  const setStatus = (value: AdminLeadStatus | "") => {
    setFilters((current) => ({
      ...current,
      page: 1,
      status: value,
    }));
  };

  const setSort = (value: AdminLeadSort) => {
    setFilters((current) => ({
      ...current,
      page: 1,
      sort: value,
    }));
  };

  const setPage = (value: number) => {
    setFilters((current) => ({
      ...current,
      page: value,
    }));
  };

  const setLeadStatusDraft = (leadId: number, status: AdminLeadStatus) => {
    setLeadStatusDrafts((current) => ({
      ...current,
      [leadId]: status,
    }));
  };

  const clearLeadStatusFeedback = () => {
    setLeadStatusFeedback(null);
  };

  const updateLeadStatus = async (leadId: number) => {
    if (savingLeadId !== null || !data) {
      return;
    }

    const targetLead = data.leads.find((lead) => lead.id === leadId);

    if (!targetLead) {
      setLeadStatusFeedback({
        type: "error",
        message: "That lead could not be found in the current list.",
      });
      return;
    }

    const nextStatus = leadStatusDrafts[leadId] ?? targetLead.status;

    if (nextStatus === targetLead.status) {
      setLeadStatusFeedback({
        type: "success",
        message: "Lead status updated successfully.",
      });
      return;
    }

    setSavingLeadId(leadId);
    setLeadStatusFeedback(null);

    try {
      const response = await updateAdminLeadStatus(leadId, nextStatus);

      if (response.success) {
        const nowIso = new Date().toISOString();

        setData((current) => {
          if (!current) {
            return current;
          }

          const lead = current.leads.find((item) => item.id === leadId);

          if (!lead) {
            return current;
          }

          const oldStatisticsKey = statusToStatisticsKey[lead.status];
          const nextStatisticsKey = statusToStatisticsKey[nextStatus];

          const nextStatistics = {
            ...current.statistics,
          };

          if (oldStatisticsKey !== nextStatisticsKey) {
            nextStatistics[oldStatisticsKey] = Math.max(
              0,
              nextStatistics[oldStatisticsKey] - 1,
            );
            nextStatistics[nextStatisticsKey] += 1;
          }

          return {
            ...current,
            leads: current.leads.map((item) =>
              item.id === leadId
                ? {
                    ...item,
                    status: nextStatus,
                    updatedAt: nowIso,
                  }
                : item,
            ),
            statistics: nextStatistics,
          };
        });

        setLeadStatusDrafts((current) => ({
          ...current,
          [leadId]: nextStatus,
        }));
        setLeadStatusFeedback({
          type: "success",
          message: response.message,
        });
        return;
      }

      if (response.unauthorized) {
        setIsUnauthorized(true);
        setLeadStatusFeedback({
          type: "error",
          message: "Your session expired. Please sign in again.",
        });
        return;
      }

      setLeadStatusFeedback({
        type: "error",
        message: response.message,
      });
    } catch {
      setLeadStatusFeedback({
        type: "error",
        message: "Unable to update the lead status right now. Please try again.",
      });
    } finally {
      setSavingLeadId((current) => (current === leadId ? null : current));
    }
  };

  useEffect(() => {
    if (!leadStatusFeedback) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setLeadStatusFeedback(null);
    }, 4000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [leadStatusFeedback]);

  const clearFilters = () => {
    setFilters({ ...defaultFilters });
    setDebouncedSearch("");
    setReloadCounter((current) => current + 1);
  };

  const refetch = () => {
    setReloadCounter((current) => current + 1);
  };

  return {
    data,
    error,
    hasActiveFilters,
    isInitialLoading,
    isRefreshing,
    isUnauthorized,
    filters,
    leadStatusDrafts,
    savingLeadId,
    leadStatusFeedback,
    refetch,
    clearFilters,
    setSearch,
    setStatus,
    setSort,
    setPage,
    clearLeadStatusFeedback,
    setLeadStatusDraft,
    updateLeadStatus,
  };
};
