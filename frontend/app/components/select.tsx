import type { SelectHTMLAttributes } from "react";

import { cn } from "@/app/utils/cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
};

export const Select = ({ label, error, className, id, children, ...props }: SelectProps) => {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        id={id}
        className={cn(
          "w-full rounded-2xl border bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100",
          error ? "border-rose-300" : "border-slate-200",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </label>
  );
};
