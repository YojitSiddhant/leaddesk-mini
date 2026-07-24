import { Card } from "@/app/components/card";

type AdminStatCardProps = {
  label: string;
  value: number;
  helperText?: string;
};

export const AdminStatCard = ({
  label,
  value,
  helperText,
}: AdminStatCardProps) => {
  return (
    <Card className="p-5">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <span className="text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </span>
        <div className="h-10 w-10 rounded-2xl bg-blue-50" />
      </div>
      {helperText ? (
        <p className="mt-2 text-sm text-slate-600">{helperText}</p>
      ) : null}
    </Card>
  );
};
