"use client";

import { Button } from "@/app/components/button";
import { Select } from "@/app/components/select";
import type { AdminLeadStatus } from "@/app/types/admin-lead";

type AdminLeadStatusControlsProps = {
  leadId: number;
  currentStatus: AdminLeadStatus;
  draftStatus: AdminLeadStatus;
  isSaving: boolean;
  isDisabled: boolean;
  onDraftChange: (status: AdminLeadStatus) => void;
  onSave: () => void;
};

export const AdminLeadStatusControls = ({
  leadId,
  currentStatus,
  draftStatus,
  isSaving,
  isDisabled,
  onDraftChange,
  onSave,
}: AdminLeadStatusControlsProps) => {
  const isUnchanged = currentStatus === draftStatus;
  const isInteractionDisabled = isDisabled || isUnchanged;

  return (
    <div className="space-y-3">
      <Select
        id={`lead-status-${leadId}`}
        label="Update status"
        value={draftStatus}
        onChange={(event) => onDraftChange(event.target.value as AdminLeadStatus)}
        disabled={isDisabled}
      >
        <option value="NEW">New</option>
        <option value="CONTACTED">Contacted</option>
        <option value="CLOSED">Closed</option>
      </Select>
      <Button
        type="button"
        variant="secondary"
        className="w-full"
        isLoading={isSaving}
        loadingLabel="Saving..."
        onClick={onSave}
        disabled={isInteractionDisabled}
      >
        Save status
      </Button>
    </div>
  );
};
