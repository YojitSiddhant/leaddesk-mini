import { Card } from "@/app/components/card";
import { AdminLeadStatusControls } from "@/app/components/admin-lead-status-controls";
import type { AdminLeadRecord, AdminLeadStatus } from "@/app/types/admin-lead";
import {
  formatAdminLeadDate,
  getLeadMessagePreview,
  getStatusBadgeClasses,
  getStatusLabel,
} from "@/app/utils/admin-leads";

type AdminLeadsTableProps = {
  leads: AdminLeadRecord[];
  leadStatusDrafts: Record<number, AdminLeadStatus>;
  savingLeadId: number | null;
  onLeadStatusDraftChange: (leadId: number, status: AdminLeadStatus) => void;
  onLeadStatusSave: (leadId: number) => void;
};

const renderField = (label: string, value: string) => (
  <div className="space-y-1">
    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
      {label}
    </p>
    <p className="text-sm text-slate-900">{value}</p>
  </div>
);

export const AdminLeadsTable = ({
  leads,
  leadStatusDrafts,
  savingLeadId,
  onLeadStatusDraftChange,
  onLeadStatusSave,
}: AdminLeadsTableProps) => {
  if (leads.length === 0) {
    return null;
  }

  return (
    <>
      <Card className="hidden overflow-hidden lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th
                  scope="col"
                  className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
                >
                  Budget
                </th>
                <th
                  scope="col"
                  className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
                >
                  Update Status
                </th>
                <th
                  scope="col"
                  className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
                >
                  Submitted At
                </th>
                <th
                  scope="col"
                  className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
                >
                  Message Preview
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {leads.map((lead) => (
                <tr key={lead.id} className="align-top">
                  <td className="px-5 py-4 text-sm font-medium text-slate-900">
                    {lead.name}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {lead.email}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {lead.budgetRange}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${getStatusBadgeClasses(
                        lead.status,
                      )}`}
                    >
                      {getStatusLabel(lead.status)}
                    </span>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <AdminLeadStatusControls
                      leadId={lead.id}
                      currentStatus={lead.status}
                      draftStatus={leadStatusDrafts[lead.id] ?? lead.status}
                      isSaving={savingLeadId === lead.id}
                      isDisabled={savingLeadId !== null}
                      onDraftChange={(nextStatus) =>
                        onLeadStatusDraftChange(lead.id, nextStatus)
                      }
                      onSave={() => onLeadStatusSave(lead.id)}
                    />
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {formatAdminLeadDate(lead.createdAt)}
                  </td>
                  <td className="px-5 py-4 text-sm leading-6 text-slate-600">
                    {getLeadMessagePreview(lead.message)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="space-y-4 lg:hidden">
        {leads.map((lead) => (
          <Card key={lead.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {lead.name}
                </h3>
                <p className="text-sm text-slate-600">{lead.email}</p>
              </div>
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${getStatusBadgeClasses(
                  lead.status,
                )}`}
              >
                {getStatusLabel(lead.status)}
              </span>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {renderField("Budget", lead.budgetRange)}
              {renderField("Submitted", formatAdminLeadDate(lead.createdAt))}
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              {getLeadMessagePreview(lead.message, 130)}
            </p>
            <div className="mt-5">
              <AdminLeadStatusControls
                leadId={lead.id}
                currentStatus={lead.status}
                draftStatus={leadStatusDrafts[lead.id] ?? lead.status}
                isSaving={savingLeadId === lead.id}
                isDisabled={savingLeadId !== null}
                onDraftChange={(nextStatus) =>
                  onLeadStatusDraftChange(lead.id, nextStatus)
                }
                onSave={() => onLeadStatusSave(lead.id)}
              />
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};
