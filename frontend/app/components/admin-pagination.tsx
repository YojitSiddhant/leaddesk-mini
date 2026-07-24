import { Button } from "@/app/components/button";

type AdminPaginationProps = {
  page: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
};

export const AdminPagination = ({
  page,
  totalPages,
  hasPreviousPage,
  hasNextPage,
  onPreviousPage,
  onNextPage,
}: AdminPaginationProps) => {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600">
        Page <span className="font-semibold text-slate-900">{page}</span> of{" "}
        <span className="font-semibold text-slate-900">{totalPages}</span>
      </p>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onPreviousPage}
          disabled={!hasPreviousPage}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onNextPage}
          disabled={!hasNextPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
