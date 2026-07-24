import type { AdminLeadRecord, AdminLeadStatus } from "@/app/types/admin-lead";

export const formatAdminLeadDate = (isoDate: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(isoDate));

export const getLeadMessagePreview = (
  message: string,
  maxLength = 90,
) => {
  if (message.length <= maxLength) {
    return message;
  }

  return `${message.slice(0, maxLength).trimEnd()}...`;
};

export const getStatusLabel = (status: AdminLeadStatus) => {
  switch (status) {
    case "NEW":
      return "New";
    case "CONTACTED":
      return "Contacted";
    case "CLOSED":
      return "Closed";
    default:
      return status;
  }
};

export const getStatusBadgeClasses = (status: AdminLeadStatus) => {
  switch (status) {
    case "NEW":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "CONTACTED":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "CLOSED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
};

export const getLeadKey = (lead: AdminLeadRecord) => lead.id;
