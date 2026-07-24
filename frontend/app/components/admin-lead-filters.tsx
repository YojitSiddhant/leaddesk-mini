import { Button } from "@/app/components/button";
import { Card } from "@/app/components/card";
import { Input } from "@/app/components/input";
import { Select } from "@/app/components/select";
import type {
  AdminLeadSort,
  AdminLeadStatus,
} from "@/app/types/admin-lead";

type AdminLeadFiltersProps = {
  search: string;
  status: AdminLeadStatus | "";
  sort: AdminLeadSort;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: AdminLeadStatus | "") => void;
  onSortChange: (value: AdminLeadSort) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
};

export const AdminLeadFilters = ({
  search,
  status,
  sort,
  onSearchChange,
  onStatusChange,
  onSortChange,
  onClearFilters,
  hasActiveFilters,
}: AdminLeadFiltersProps) => {
  return (
    <Card className="p-5 sm:p-6">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr_0.8fr_auto] lg:items-end">
        <Input
          label="Search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by name or email"
        />
        <Select
          label="Status"
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value as AdminLeadStatus | "")
          }
        >
          <option value="">All statuses</option>
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="CLOSED">Closed</option>
        </Select>
        <Select
          label="Sort"
          value={sort}
          onChange={(event) => onSortChange(event.target.value as AdminLeadSort)}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </Select>
        <Button
          type="button"
          variant="secondary"
          onClick={onClearFilters}
          disabled={!hasActiveFilters}
        >
          Clear filters
        </Button>
      </div>
    </Card>
  );
};
