import type { Metadata } from "next";

import { AdminDashboardPage } from "@/app/components/admin-dashboard-page";

export const metadata: Metadata = {
  title: "Admin Dashboard | LeadDesk Mini",
  description: "Protected admin dashboard for LeadDesk Mini.",
};

export default function DashboardRoute() {
  return <AdminDashboardPage />;
}
