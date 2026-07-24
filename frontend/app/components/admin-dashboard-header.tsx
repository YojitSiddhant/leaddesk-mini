import { Button } from "@/app/components/button";
import { Card } from "@/app/components/card";
import type { AdminUserSummary } from "@/app/types/admin";

type AdminDashboardHeaderProps = {
  adminUser: AdminUserSummary;
  isLoggingOut: boolean;
  logoutError?: string;
  onLogout: () => void;
};

export const AdminDashboardHeader = ({
  adminUser,
  isLoggingOut,
  logoutError,
  onLogout,
}: AdminDashboardHeaderProps) => {
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
            LeadDesk Mini
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-600">
            Signed in as {adminUser.name} ({adminUser.email})
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 md:items-end">
          <Button
            type="button"
            variant="secondary"
            isLoading={isLoggingOut}
            loadingLabel="Logging out..."
            onClick={onLogout}
          >
            Log out
          </Button>
          {logoutError ? (
            <p className="text-sm text-rose-600" role="alert">
              {logoutError}
            </p>
          ) : null}
        </div>
      </div>
    </Card>
  );
};
