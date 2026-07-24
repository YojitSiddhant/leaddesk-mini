"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AdminDashboardHeader } from "@/app/components/admin-dashboard-header";
import { AdminDashboardState } from "@/app/components/admin-dashboard-state";
import { AdminLeadFilters } from "@/app/components/admin-lead-filters";
import { AdminLeadsTable } from "@/app/components/admin-leads-table";
import { AdminPagination } from "@/app/components/admin-pagination";
import { AdminStatCard } from "@/app/components/admin-stat-card";
import { Button } from "@/app/components/button";
import { Container } from "@/app/components/container";
import { useAdminLeads } from "@/app/hooks/use-admin-leads";
import { useAdminLogout } from "@/app/hooks/use-admin-logout";
import { useAdminSession } from "@/app/hooks/use-admin-session";

export const AdminDashboardPage = () => {
  const router = useRouter();
  const { status, adminUser, isLoading: isSessionLoading } = useAdminSession();
  const { isLoggingOut, logoutError, handleLogout } = useAdminLogout();
  const {
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
    setLeadStatusDraft,
    updateLeadStatus,
  } = useAdminLeads(status === "authenticated");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/admin/login");
    }
  }, [router, status]);

  useEffect(() => {
    if (isUnauthorized) {
      router.replace("/admin/login");
    }
  }, [isUnauthorized, router]);

  if (isSessionLoading) {
    return (
      <AdminDashboardState
        title="Checking session"
        description="Verifying admin access before loading the dashboard."
      />
    );
  }

  if (status === "unauthenticated") {
    return (
      <AdminDashboardState
        title="Redirecting to login"
        description="Your session is not available. Taking you back to the sign in page."
      />
    );
  }

  if (error && !data) {
    return (
      <AdminDashboardState
        title="Unable to load dashboard"
        description={error}
        action={
          <Button type="button" onClick={refetch}>
            Retry
          </Button>
        }
      />
    );
  }

  if (isInitialLoading || !data || !adminUser) {
    return (
      <AdminDashboardState
        title="Loading dashboard"
        description="Fetching leads and statistics."
      />
    );
  }

  const hasNoResults = data.leads.length === 0;
  const showNoResultsState = hasNoResults && hasActiveFilters && !error;
  const showEmptyState = hasNoResults && !hasActiveFilters && !error;

  return (
    <main className="min-h-screen bg-slate-50 py-8 sm:py-10">
      <Container className="space-y-6">
        <AdminDashboardHeader
          adminUser={adminUser}
          isLoggingOut={isLoggingOut}
          logoutError={logoutError}
          onLogout={handleLogout}
        />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard label="Total Leads" value={data.statistics.total} />
          <AdminStatCard label="New Leads" value={data.statistics.new} />
          <AdminStatCard
            label="Contacted Leads"
            value={data.statistics.contacted}
          />
          <AdminStatCard label="Closed Leads" value={data.statistics.closed} />
        </section>

        <AdminLeadFilters
          search={filters.search}
          status={filters.status}
          sort={filters.sort}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onSortChange={setSort}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {leadStatusFeedback ? (
          <div
            className={
              leadStatusFeedback.type === "success"
                ? "rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
                : "rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
            }
            role={leadStatusFeedback.type === "success" ? "status" : "alert"}
            aria-live="polite"
          >
            {leadStatusFeedback.message}
          </div>
        ) : null}

        {showEmptyState ? (
          <AdminDashboardState
            title="No leads yet"
            description="Submitted leads will appear here once they arrive."
          />
        ) : null}

        {showNoResultsState ? (
          <AdminDashboardState
            title="No results found"
            description="Try a different search term or clear the filters to see more leads."
            action={
              <Button type="button" variant="secondary" onClick={clearFilters}>
                Clear filters
              </Button>
            }
          />
        ) : null}

        {!showEmptyState && !showNoResultsState ? (
          <section className="space-y-4">
            {isRefreshing ? (
              <p className="text-sm font-medium text-slate-600" aria-live="polite">
                Refreshing results...
              </p>
            ) : null}

            {error ? (
              <div
                className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                role="alert"
              >
                {error}
              </div>
            ) : null}

            <AdminLeadsTable
              leads={data.leads}
              leadStatusDrafts={leadStatusDrafts}
              savingLeadId={savingLeadId}
              onLeadStatusDraftChange={setLeadStatusDraft}
              onLeadStatusSave={updateLeadStatus}
            />

            <AdminPagination
              page={data.pagination.page}
              totalPages={data.pagination.totalPages}
              hasPreviousPage={data.pagination.hasPreviousPage}
              hasNextPage={data.pagination.hasNextPage}
              onPreviousPage={() =>
                setPage(Math.max(1, data.pagination.page - 1))
              }
              onNextPage={() =>
                setPage(
                  Math.min(data.pagination.totalPages, data.pagination.page + 1),
                )
              }
            />
          </section>
        ) : null}
      </Container>
    </main>
  );
};
