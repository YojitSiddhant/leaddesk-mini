import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/app/utils/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  isLoading?: boolean;
  loadingLabel?: string;
  variant?: "primary" | "secondary";
};

export const Button = ({
  children,
  className,
  isLoading,
  loadingLabel = "Submitting...",
  variant = "primary",
  disabled,
  ...props
}: ButtonProps) => {
  const variantStyles =
    variant === "primary"
      ? "bg-blue-600 text-white shadow-[0_14px_32px_rgba(37,99,235,0.22)] hover:bg-blue-700 focus-visible:ring-blue-500"
      : "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 focus-visible:ring-blue-500";

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        variantStyles,
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? loadingLabel : children}
    </button>
  );
};
