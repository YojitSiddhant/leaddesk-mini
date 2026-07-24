import type { ReactNode } from "react";

import { cn } from "@/app/utils/cn";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export const Card = ({ children, className }: CardProps) => {
  return (
    <div
      className={cn(
        "rounded-3xl border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)]",
        className,
      )}
    >
      {children}
    </div>
  );
};
