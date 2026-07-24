import type { Metadata } from "next";

import { AdminLoginForm } from "@/app/components/admin-login-form";

export const metadata: Metadata = {
  title: "Admin Login | LeadDesk Mini",
  description: "Secure admin login for LeadDesk Mini.",
};

export default function AdminLoginPage() {
  return <AdminLoginForm />;
}
